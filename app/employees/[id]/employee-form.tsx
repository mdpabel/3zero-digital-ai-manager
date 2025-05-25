'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useState } from 'react';
import { Employee } from '@/lib/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { updateEmployee } from '@/action/update-employee';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type Props = {
  employee: Employee;
};

const roles = [
  { label: 'Employee', value: 'employee' },
  { label: 'Manager', value: 'manager' },
  { label: 'Admin', value: 'admin' },
  { label: 'Digital Marketer', value: 'digital marketer' },
];

const EmployeeForm = ({ employee }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(employee.name ?? '');
  const [goal, setGoal] = useState(employee.goal ?? '');
  const [strategy, setStrategy] = useState(employee.strategy ?? '');
  const [startDate, setStartDate] = useState(
    employee.startDate
      ? format(new Date(employee.createdAt), 'yyyy-MM-dd')
      : '',
  );
  const [jobPeriodInMonths, setJobPeriodInMonths] = useState(
    employee.jobPeriodInMonths?.toString() ?? '',
  );
  const [role, setRole] = useState(employee.role ?? 'employee');
  const [active, setActive] = useState(employee.active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedData = {
      ...employee,
      name,
      goal,
      strategy,
      startDate: new Date(startDate),
      jobPeriodInMonths: parseInt(jobPeriodInMonths || '0'),
      role,
      active,
    };

    const { message, success } = await updateEmployee(updatedData);

    if (message) {
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 mx-auto max-w-xl'>
      <h1 className='font-medium text-xl text-center'>Update Employee</h1>

      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='goal'>Goal</Label>
        <Textarea
          id='goal'
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={2}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='strategy'>Strategy</Label>
        <Textarea
          id='strategy'
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          rows={2}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='startDate'>Start Date</Label>
        <Input
          id='startDate'
          type='date'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='jobPeriodInMonths'>Job Period (Months)</Label>
        <Input
          id='jobPeriodInMonths'
          type='number'
          value={jobPeriodInMonths}
          onChange={(e) => setJobPeriodInMonths(e.target.value)}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='role'>Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select role' />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r, index) => (
              <SelectItem key={index} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center gap-3'>
        <Label htmlFor='active'>Active</Label>
        <Switch id='active' checked={active} onCheckedChange={setActive} />
        <span className='text-muted-foreground text-sm'>
          {active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <Button type='submit'>
        Update{' '}
        {isSubmitting ? <Loader2 className='w-5 h-5 animate-spin' /> : null}
      </Button>
    </form>
  );
};

export default EmployeeForm;
