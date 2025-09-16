'use client';

import React, { useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';

// Datos de ejemplo
interface Reservation {
  id: number;
  fecha: string;
  cliente: string;
  hora: string;
  servicio: string;
  totalPersonas: number;
  montoTotal: number;
  proveedor: string;
  estado: 'Pendiente de pago' | 'Pendiente de confirmación' | 'Confirmada' | 'Cancelada' | 'Realizada';
}

const reservations: Reservation[] = [
  { id: 1111, fecha: '25/08/25', cliente: 'Jane Doe', hora: '15:30', servicio: 'Embarcación', totalPersonas: 3, montoTotal: 30000, proveedor: 'Agustin López', estado: 'Confirmada' },
  { id: 2222, fecha: '25/08/25', cliente: 'Juan Gallo', hora: '17:00', servicio: 'Trekking', totalPersonas: 6, montoTotal: 60000, proveedor: 'Mariano Solo', estado: 'Cancelada' },
  { id: 3333, fecha: '26/08/25', cliente: 'Pedro Maldonado', hora: '14:00', servicio: 'Kayak', totalPersonas: 2, montoTotal: 20000, proveedor: 'Martín Cirio', estado: 'Realizada' },
  { id: 4444, fecha: '26/08/25', cliente: 'Sol Pérez', hora: '16:30', servicio: 'Kayak', totalPersonas: 5, montoTotal: 50000, proveedor: 'Mara Siri', estado: 'Pendiente de confirmación' },
  { id: 5555, fecha: '27/08/25', cliente: 'Paula López', hora: '18:00', servicio: 'Pesca', totalPersonas: 5, montoTotal: 50000, proveedor: 'Paula Marco', estado: 'Pendiente de pago' },
  // Puedes agregar más reservas para probar paginación
];

// Columnas
const columns: ColumnDef<Reservation>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'fecha', header: 'Fecha' },
  { accessorKey: 'cliente', header: 'Cliente' },
  { accessorKey: 'hora', header: 'Hora' },
  { accessorKey: 'servicio', header: 'Servicio' },
  { accessorKey: 'totalPersonas', header: 'Personas' },
  { accessorKey: 'montoTotal', header: 'Monto' },
  { accessorKey: 'proveedor', header: 'Proveedor' },
  { accessorKey: 'estado', header: 'Estado' },
];

const getEstadoColor = (estado: Reservation['estado']) => {
  switch (estado) {
    case 'Confirmada': return 'text-green-500';
    case 'Cancelada': return 'text-red-500';
    case 'Pendiente de confirmación': return 'text-yellow-500';
    case 'Pendiente de pago': return 'text-orange-500';
    case 'Realizada': return 'text-gray-500';
    default: return '';
  }
};

const ReservationsTable = () => {
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 5;

  // Filtrado de búsqueda
  const filteredData = useMemo(() => {
    return reservations.filter(r =>
      Object.values(r).some(val =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  // Paginación
  const pageCount = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pageIndex]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-4xl font-semibold mb-1">Reservas</h1>
        <Link href="/admin/reservations/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          + Nueva reserva
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar"
        className="mb-4 p-2 border border-gray-300 rounded w-1/3"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPageIndex(0); }}
      />

      <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
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

      {/* Paginación */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => setPageIndex(prev => Math.max(prev - 1, 0))}
          disabled={pageIndex === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            onClick={() => setPageIndex(i)}
            className={`px-3 py-1 border rounded ${i === pageIndex ? 'bg-blue-600 text-white' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPageIndex(prev => Math.min(prev + 1, pageCount - 1))}
          disabled={pageIndex === pageCount - 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReservationsTable;
