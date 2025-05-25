import prisma from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const AdminEmployeesPage = async () => {
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className='mx-auto p-6 max-w-5xl'>
      <h1 className='mb-4 font-bold text-2xl'>Manage Employees</h1>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left border-collapse'>
              <thead className='bg-muted'>
                <tr>
                  <th className='p-2'>Name</th>
                  <th className='p-2'>Email</th>
                  <th className='p-2'>Role</th>
                  <th className='p-2'>Joined</th>
                  <th className='p-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className='hover:bg-muted/30 border-b'>
                    <td className='p-2'>{emp.name}</td>
                    <td className='p-2'>{emp.email}</td>
                    <td className='p-2 capitalize'>{emp.role}</td>
                    <td className='p-2'>
                      {new Date(
                        emp.startDate ?? emp.createdAt,
                      ).toLocaleDateString()}
                    </td>
                    <td className='p-2'>
                      <Button variant='outline'>
                        <Link href={`/employees/${emp.id}`}>Edit</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEmployeesPage;
