'use server';
import { AIMessage } from '@/types';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat, zodTextFormat } from 'openai/helpers/zod';

const EvalSchema = z.object({
  summary: z.string(),
  evaluation: z.string(),
  score: z.number().int().min(1).max(10),
});

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

export const runLLM = async ({ messages }: { messages: AIMessage[] }) => {
  const res = await client.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    temperature: 0.1,
    messages,
    response_format: zodResponseFormat(EvalSchema, 'EvalSchema'),
  });

  // if (!input?.choices[0]?.message.content) {
  //   return;
  // }

  // const response = await client.responses.parse({
  //   model: 'gpt-4o-2024-08-06',
  //   input: input?.choices[0]?.message.content,
  //   text: {
  //     format: zodTextFormat(EvalSchema, 'EvalSchema'),
  //   },
  // });

  return res?.choices[0]?.message.content;
};
