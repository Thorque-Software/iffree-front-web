'use client';

import React, { useState, useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select';
  options?: Array<{ label: string; value: any }>;
}

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

  // 🔹 Filtros nuevos
  filters?: Record<string, any>;
  onFilterChange?: (newFilters: Record<string, any>) => void;
  filterConfig?: FilterConfig[];
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
  filters = {},
  onFilterChange,
  filterConfig,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [localFilters, setLocalFilters] = useState(filters || {});
  const pageCount = Math.ceil(total / pagination.pageSize);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearch) {
        onSearch(search.trim());
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  return (
    <div className="overflow-x-auto">
      {/* 🔹 Filtros dinámicos */}
      {filterConfig && onFilterChange && (
      <div className="mb-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {filterConfig.map((f) =>
            f.type === 'select' ? (
              <div key={f.key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {f.label}
                </label>
                <select
                  value={localFilters?.[f.key] || ''}
                  disabled={loading}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      [f.key]: e.target.value,
                    }))
                  }
                  className="p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div key={f.key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {f.label}
                </label>
                <input
                  type="text"
                  value={localFilters?.[f.key] || ''}
                  disabled={loading}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      [f.key]: e.target.value,
                    }))
                  }
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )
          )}
        </div>

        {/* 🔹 Botones de acciones */}
        <div className="flex justify-end mt-4 space-x-3">
          <button
            onClick={() => {
              setLocalFilters({});
              onFilterChange({});
            }}
            className="px-4 py-2 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-400 transition"
            disabled={loading}
          >
            Resetear
          </button>

          <button
            onClick={() => {onFilterChange(localFilters)}}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            Aplicar
          </button>
        </div>
      </div>
      )}

      {/* 🔎 Buscador */}
      {searchable && onSearch && (
        <input
          type="text"
          placeholder="Buscar..."
          className="mb-4 p-2 border border-gray-300 rounded w-1/3"
          value={search}
          disabled={loading}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {/* 🧾 Tabla */}
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
              <td colSpan={columns.length} className="text-center py-6 text-gray-500">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-6 text-gray-400">
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔽 Paginación */}
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
