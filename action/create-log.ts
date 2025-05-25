'use server';

import prisma from '@/lib/db';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { buildEvaluationMessages } from '@/lib/buildEvaluationMessages';
import { runLLM } from './run-llm';
import { AIMessage } from '@/types';

// 1. Zod validation schema
const logSchema = z.object({
  content: z.string().min(5, 'Log content must be at least 5 characters long'),
  date: z.string().datetime().optional(), // Optional custom date
});

export type CreateLogInput = z.infer<typeof logSchema>;

export const createLog = async (formData: CreateLogInput) => {
  const validated = logSchema.safeParse(formData);

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.errors[0]?.message || 'Invalid input',
    };
  }

  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      message: 'Unauthorized – please log in.',
    };
  }

  try {
    // Fetch the associated employee by Clerk user ID
    const employee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      return {
        success: false,
        message: 'Employee record not found.',
      };
    }

    const { content, date } = validated.data;

    const newLog = await prisma.workLog.create({
      data: {
        content,
        date: date ? new Date(date) : new Date(),
        employeeId: employee.id,
      },
    });

    const logs = await prisma.workLog.findMany({
      where: { employeeId: employee.id },
      orderBy: {
        createdAt: 'desc', // or 'createdAt': 'desc'
      },
    });

    const userPrompt = buildEvaluationMessages({
      companyPerformance: `The website is currently receiving only 3–4 clicks per day via Google Search Console. We haven’t acquired any new clients in the past few months, and overall business growth has stagnated. Due to the lack of revenue, the directors are covering operational expenses — including salaries — out of their own pockets.`,
      employee,
      logs,
    }) as AIMessage[];

    const res = await runLLM({
      messages: userPrompt,
    });

    if (res) {
      const parsed = JSON.parse(res);

      console.log('Parsed evaluation:', parsed);

      await prisma.evaluation.create({
        data: {
          score: parsed.score,
          summary: parsed.summary,
          workLogId: newLog.id,
          content: parsed.evaluation,
        },
      });
    }

    revalidatePath('/logs');

    return {
      success: true,
      message: 'Log submitted successfully.',
    };
  } catch (error) {
    console.error('Error creating log:', error);
    return {
      success: false,
      message: 'Something went wrong while creating the log.',
    };
  }
};
