import { format, parseISO } from 'date-fns';
import { Employee, WorkLog } from './generated/prisma';

type EvaluationInput = {
  employee: Employee;
  logs: WorkLog[]; // Make sure this is ordered by date DESC from Prisma
  companyPerformance: string;
};

const systemPrompt = `
You are an AI performance evaluator for a remote marketing team at 3 Zero Digital.

Each marketer has:
- A specific business goal (e.g. avoiding financial loss)
- A clear timeline 
- A defined strategy (e.g. Facebook ads, retargeting, landing pages)

Your job is to analyze their daily work logs in context of:
1. Their overall goal
2. The strategy they proposed
3. Time passed since they started
4. Actual business performance

When evaluating, consider:
- Is today's work meaningful, or too small for the urgency?
- Are they building momentum or just doing small busywork?
- Are they responding to actual company needs (e.g. low sales)?
- How likely is it that their actions will lead to real business improvement?

You must:
- Summarize today’s work in 1 line
- Briefly evaluate whether this is meaningful progress given the company status and remaining time
- Give a strict score from 1–10:
  - 9–10: Significant progress with clear business impact
  - 6–8: Moderate progress, needs more speed or impact
  - 4–5: Weak or slow work
  - 1–3: Minimal contribution

Always stay brief, objective, and outcome-driven. Don’t praise basic tasks.
`;

export function buildEvaluationMessages({
  employee,
  logs,
  companyPerformance,
}: EvaluationInput) {
  if (!logs.length || !employee) {
    return [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `No logs found for ${employee.name}. Cannot evaluate performance.`,
      },
    ];
  }

  // logs should be ordered by date DESC in the query
  const [latestLog, ...earlierLogs] = logs;

  const formattedStartDate =
    typeof employee.startDate === 'string'
      ? format(parseISO(employee.startDate), 'MMMM d, yyyy')
      : format(employee.startDate ?? employee.createdAt, 'MMMM d, yyyy');

  const todayLogText = `• ${latestLog.content.trim()}`;

  const recentLogsText =
    earlierLogs
      .map(
        (log) =>
          `${format(new Date(log.date), 'MMM d')}: ${log.content.trim()}`,
      )
      .join('\n') || 'No previous logs found.';

  const profile = `
Name: ${employee.name}  
Goal: ${employee.goal}  
Start Date: ${formattedStartDate}
`;

  const userPrompt = `
Employee Profile:\n${profile}

Current Company Performance:\n${companyPerformance}

Recent Logs:\n${recentLogsText}

Today's Log:\n${todayLogText}

Please evaluate today's work. Consider how much time has passed since ${formattedStartDate} and whether this is enough to make progress toward the goal. Focus on business outcomes, not task completion.
`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}
