'use client';

import React, { useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { getShifts } from '@/services/ApiHandler';
import { Shift } from '@/types/domain';


// Columnas de la tabla
const columns: ColumnDef<Provider>[] = [
  { accessorKey: 'nombre', header: 'Proveedor' },
  { accessorKey: 'ciudad', header: 'Ciudad' },
  { accessorKey: 'contacto', header: 'Contacto' },
  { accessorKey: 'tipo', header: 'Tipo' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'cuil', header: 'CUIL' },
  { accessorKey: 'ingresos', header: 'Ingresos' },
];

const ProvidersTable = () => {
  const [Shifts, setShifts] = React.useState<Shift[]>([]);

  const table = useReactTable({
    data: Shifts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const fetchData = async () => {
      getShifts().then(data => {
        console.log(data.items);
        setShifts(data.items);
      }).catch(error => {
        console.error('Error fetching shifts:', error);
      });
    }
    fetchData();
  } , []);

  return (
    <div className="overflow-x-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-semibold">Próximas actividades</h1>
      </div>

      {/* Tabla */}
      <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-md overflow-hidden">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-sm font-bold text-gray-700 tracking-wider"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {cell.column.id === 'ingresos'
                    ? `$${(cell.getValue() as number).toLocaleString()}`
                    : flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default ProvidersTable;
