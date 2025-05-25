'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

import { differenceInCalendarDays, isSameWeek, isSameMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkLogWithEvaluation } from './page'; // Reuse the type from the server component

interface AnalyticsProps {
  logs: WorkLogWithEvaluation[];
  joinDate: Date;
}

const Analytics: React.FC<AnalyticsProps> = ({ logs, joinDate }) => {
  const totalDays = differenceInCalendarDays(new Date(), new Date(joinDate));

  console.log({ totalDays, joinDate });

  const logsThisWeek = logs.filter((log) =>
    isSameWeek(new Date(log.date), new Date(), { weekStartsOn: 1 }),
  );

  const logsThisMonth = logs.filter((log) =>
    isSameMonth(new Date(log.date), new Date()),
  );

  const averageScore =
    logs.reduce((acc, log) => acc + (log.evaluation?.score ?? 0), 0) /
    logs.filter((log) => log.evaluation?.score !== undefined).length;

  const chartData = logs.map((log) => ({
    name: new Date(log.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
    score: log.evaluation?.score ?? 0,
  }));

  return (
    <div className='space-y-8 mx-auto px-4 py-8 max-w-6xl'>
      <div>
        <h1 className='font-bold text-3xl'>Welcome back 👋</h1>
        <p className='mt-1 text-muted-foreground'>
          Here’s your work performance overview.
        </p>
      </div>

      <div className='gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4'>
        <Card>
          <CardHeader>
            <CardTitle>Days Since Joining</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='font-bold text-2xl'>{totalDays}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Worked This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='font-bold text-2xl'>{logsThisWeek.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Worked This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='font-bold text-2xl'>{logsThisMonth.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg. Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='font-bold text-2xl'>
              {isNaN(averageScore) ? '—' : averageScore.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Evaluation Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='score' fill='#6366F1' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
