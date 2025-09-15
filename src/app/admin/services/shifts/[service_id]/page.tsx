'use client';

import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Datos inventados
interface Reservation {
  id: number;
  fecha: string;
  hora: string;
  totalPersonas: number;
  montoTotal: number;
  estado: 'Pendiente de confirmación' | 'Confirmada' | 'Cancelada' | 'Realizada';
}

interface ShiftTableProps {
  params: { service_id: string };
}

const data: Reservation[] = [
  { id: 1111, fecha: '25/08/25', hora: '15:30', totalPersonas: 3, montoTotal: 30000, estado: 'Confirmada' },
  { id: 2222, fecha: '25/08/25', hora: '17:00', totalPersonas: 6, montoTotal: 60000, estado: 'Cancelada' },
  { id: 3333, fecha: '26/08/25', hora: '14:00', totalPersonas: 2, montoTotal: 20000, estado: 'Realizada' },
  { id: 4444, fecha: '26/08/25', hora: '16:30', totalPersonas: 5, montoTotal: 50000, estado: 'Pendiente de confirmación' },
  { id: 5555, fecha: '27/08/25', hora: '18:00', totalPersonas: 5, montoTotal: 50000, estado: 'Confirmada' },
];

// Columnas
const columns: ColumnDef<Reservation>[] = [
  { accessorKey: 'fecha', header: 'Fecha' },
  { accessorKey: 'hora', header: 'Hora' },
  { accessorKey: 'totalPersonas', header: 'Personas' },
  { accessorKey: 'montoTotal', header: 'Monto' },
  { accessorKey: 'estado', header: 'Estado' },
];

const getEstadoColor = (estado: Reservation['estado']) => {
  switch (estado) {
    case 'Confirmada':
      return 'text-green-500';
    case 'Cancelada':
      return 'text-red-500';
    case 'Pendiente de confirmación':
      return 'text-yellow-500';
    case 'Realizada':
      return 'text-gray-500';
    default:
      return '';
  }
};

const ShiftTable = ({ params }: ShiftTableProps) => {
  const { service_id } = params;
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <h1 className="text-4xl font-semibold mb-1">Turnos</h1>
      <h2 className="text-2xl font-semibold ">Turnos del servicio Kayak {service_id}</h2>
      <h2 className="text-2xl font-semibold mb-4">Proveedor: {service_id}</h2>
      <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-sm font-bold text-gray-700 tracking-wider"
                >
                  <span className="font-bold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  </span>
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
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                    cell.column.id === 'estado'
                      ? getEstadoColor(cell.getValue() as Reservation['estado'])
                      : ''
                  }`}
                >
                  {cell.column.id === 'montoTotal'
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

export default ShiftTable;
