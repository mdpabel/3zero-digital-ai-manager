import prisma from '@/lib/db';
import Analytics from './analytics';
import { WorkLog } from '@/lib/generated/prisma';
import { auth } from '@clerk/nextjs/server';

export type WorkLogWithEvaluation = WorkLog & {
  evaluation: {
    score: number;
  } | null;
};

const Dashboard = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await prisma.employee.findUnique({
    where: { userId },
  });

  if (!user) {
    return null;
  }

  const logs = await prisma.workLog.findMany({
    where: {
      employeeId: user.id,
    },
    include: {
      evaluation: {
        select: { score: true },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  return <Analytics logs={logs} joinDate={user.startDate ?? user.createdAt} />;
};

export default Dashboard;
