import prisma from '@/lib/db';
import React from 'react';
import EmployeeForm from './employee-form';
import { redirect } from 'next/navigation';

interface EmployeePageProps {
  params: Promise<{
    id: string;
  }>;
}

const EmployeePage = async ({ params }: EmployeePageProps) => {
  const { id } = await params;

  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    return (
      <div className='flex justify-center items-center h-full text-red-500 text-center'>
        Employee not found.
      </div>
    );
  }

  return <EmployeeForm employee={employee} />;
};

export default EmployeePage;
