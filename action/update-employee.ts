'use server';

import prisma from '@/lib/db';
import { Employee } from '@/lib/generated/prisma';
import { revalidatePath } from 'next/cache';

export const updateEmployee = async (data: Partial<Employee>) => {
  console.log({ data });
  try {
    // Validate ID
    if (!data.id) {
      return {
        status: 'error',
        message: 'Employee ID is required.',
      };
    }

    // Optional validations
    if (data.name && data.name.trim().length < 2) {
      return {
        status: 'error',
        message: 'Name must be at least 2 characters.',
      };
    }

    if (data.startDate && isNaN(new Date(data.startDate).getTime())) {
      return {
        status: 'error',
        message: 'Invalid start date format.',
      };
    }

    // Perform update
    const updatedEmployee = await prisma.employee.update({
      where: { id: data.id },
      data: {
        name: data.name,
        goal: data.goal,
        strategy: data.strategy,
        startDate: data.startDate,
        jobPeriodInMonths: data.jobPeriodInMonths,
        role: data.role,
        active: data.active,
      },
    });

    revalidatePath(`/dashboard/employee/${updatedEmployee.id}`); // Adjust this if needed

    return {
      success: true,
      message: 'Employee updated successfully.',
    };
  } catch (error: any) {
    console.error('Failed to update employee:', error);

    return {
      success: false,
      message: 'Something went wrong while updating the employee.',
    };
  }
};
