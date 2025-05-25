import prisma from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const NewUser = async () => {
  const user = await currentUser();

  const employee = await prisma.employee.findFirst({
    where: {
      userId: user?.id ?? '',
    },
  });

  if (!employee) {
    const res = await prisma.employee.create({
      data: {
        userId: user?.id ?? '',
        name: user?.firstName + ' ' + user?.lastName,
        email: user?.emailAddresses[0]?.emailAddress ?? '',
      },
    });

    if (res) {
      redirect('/dashboard');
    }
  } else {
    // If the employee already exists, redirect to the dashboard
    redirect('/dashboard');
  }

  return null;
};

export default NewUser;
