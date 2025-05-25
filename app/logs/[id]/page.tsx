import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface DetailLogPageProps {
  params: Promise<{
    id: string;
  }>;
}

const DetailLogPage = async ({ params }: DetailLogPageProps) => {
  const { id } = await params;

  const log = await prisma.workLog.findUnique({
    where: { id },
    include: {
      evaluation: true,
    },
  });

  if (!log) {
    redirect('/logs');
  }

  return (
    <div className='space-y-4 mx-auto mt-10 p-6 max-w-2xl'>
      <h1 className='font-bold text-2xl'>Work Log Details</h1>

      <div>
        <span className='font-semibold'>Date:</span>{' '}
        {format(new Date(log.date), 'PPP')}
      </div>

      <div>
        <span className='font-semibold'>Work Summary:</span>
        <p className='mt-1 text-muted-foreground whitespace-pre-wrap'>
          {log.content}
        </p>
      </div>

      <div>
        <span className='font-semibold'>Score:</span>{' '}
        {log.evaluation?.score != null ? (
          <Badge variant='secondary'>{log.evaluation.score}</Badge>
        ) : (
          '—'
        )}
      </div>

      <div>
        <span className='font-semibold'>Evaluation Summary:</span>
        <p className='mt-1 text-muted-foreground text-sm italic'>
          {log.evaluation?.summary ?? 'No evaluation available.'}
        </p>
      </div>

      <div>
        <span className='font-semibold'>AI Manager Evaluation:</span>
        <p className='mt-1 text-muted-foreground text-sm italic'>
          {log.evaluation?.content ?? 'No evaluation available.'}
        </p>
      </div>
    </div>
  );
};

export default DetailLogPage;
