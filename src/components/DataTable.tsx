'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { formatDate } from '@/utils/utils';

interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  total: number;
  pagination: {
    page: number;
    pageSize: number;
  };
  onPageChange: (page: number) => void;
  onSearch?: (term: string) => void;
  searchable?: boolean;
  loading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  total,
  pagination,
  onPageChange,
  onSearch,
  searchable = true,
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const pageCount = Math.ceil(total / pagination.pageSize);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      {/* Buscador */}
      {searchable && onSearch && (
        <input
          type="text"
          placeholder="Buscar..."
          className="mb-4 p-2 border border-gray-300 rounded w-1/3"
          value={search}
          disabled={loading}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearch(e.target.value);
          }}
        />
      )}

      {/* Tabla */}
      <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-sm font-bold text-gray-700"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500"
              >
                Cargando...
              </td>
            </tr>
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                    {['start', 'end', 'shift.start'].includes(cell.column.id)
                    ? formatDate(cell.getValue() as string)
                    : flexRender(cell.column.columnDef.cell, cell.getContext())
                    }
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-400"
              >
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
          disabled={pagination.page === 1 || loading}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            disabled={loading}
            className={`px-3 py-1 border rounded ${
              i + 1 === pagination.page ? 'bg-blue-600 text-white' : ''
            } ${loading ? 'opacity-50' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(pagination.page + 1, pageCount))}
          disabled={pagination.page === pageCount || loading}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
