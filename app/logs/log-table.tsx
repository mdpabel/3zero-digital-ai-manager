'use client';

import { useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Evaluation, WorkLog } from '@/lib/generated/prisma';
import Link from 'next/link';

type WorkLogWithEvaluation = WorkLog & {
  evaluation: Evaluation | null;
};

interface LogsTableProps {
  data: WorkLogWithEvaluation[];
}

export function LogsTable({ data }: LogsTableProps) {
  const columns = useMemo<ColumnDef<WorkLogWithEvaluation>[]>(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) =>
          new Date(row.original.date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
      },
      {
        accessorKey: 'content',
        header: 'Work Summary',
        cell: ({ row }) => (
          <div className='max-w-sm text-muted-foreground text-sm truncate'>
            {row.original.content}
          </div>
        ),
        meta: {
          className: 'hidden sm:table-cell', // hide on mobile
        },
      },
      {
        id: 'score',
        header: 'Score',
        cell: ({ row }) => row.original.evaluation?.score ?? '—',
      },

      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button asChild variant='outline' size='sm'>
            <Link href={`/logs/${row.original.id}`}>View</Link>
          </Button>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className='border rounded-md w-full overflow-x-auto'>
      <Table className='min-w-full'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={(header.column.columnDef.meta as any)?.className}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={(cell.column.columnDef.meta as any)?.className}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='py-4 text-center'>
                No logs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className='flex justify-between items-center space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
