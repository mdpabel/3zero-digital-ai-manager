import { LogsTable } from './log-table';
import prisma from '@/lib/db';

const Logs = async () => {
  const logs = await prisma.workLog.findMany({
    include: {
      evaluation: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return (
    <div className='mx-auto mt-6 p-4 max-w-4xl'>
      <LogsTable data={logs} />
    </div>
  );
};

export default Logs;
