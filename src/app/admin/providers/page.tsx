'use client';

import React, { useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';

// Datos de ejemplo de proveedores
interface Provider {
  id: number;
  nombre: string;
  ciudad: string;
  contacto: string;
  tipo: string;
  email: string;
  cuil: string;
  ingresos: number;
}

const providers: Provider[] = [
  { id: 1, nombre: 'Juan Pérez', ciudad: 'Bariloche', contacto: '1451257896', tipo: 'Normal', email: 'juanperez@icloud.com', cuil: '50487963214', ingresos: 50000 },
  { id: 2, nombre: 'Juan Gallo', ciudad: 'Villa Traful', contacto: '5687941235', tipo: 'Normal', email: 'juangallo1974@hotmail.com', cuil: '84113518610', ingresos: 150000 },
  { id: 3, nombre: 'Pedro Maldonado', ciudad: 'Villa Langostura', contacto: '7981325645', tipo: 'Náutico', email: 'pedromaldonado@gmail.com', cuil: '16841033894', ingresos: 48710 },
  { id: 4, nombre: 'Sol Pérez', ciudad: 'San Martín', contacto: '6847849521', tipo: 'Náutico', email: 'solperez2810@live.com', cuil: '87951351238', ingresos: 98200 },
  { id: 5, nombre: 'Paula López', ciudad: 'El Bolsón', contacto: '9874123548', tipo: 'Normal', email: 'paulalopez203@gmail.com', cuil: '41356841135', ingresos: 100000 },
];

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
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 5;

  // Filtrado de búsqueda
  const filteredData = useMemo(() => {
    return providers.filter(p =>
      Object.values(p).some(val =>
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
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-semibold">Proveedores</h1>
        <Link href="/admin/providers/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          + Nuevo proveedor
        </Link>
      </div>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar"
        className="mb-4 p-2 border border-gray-300 rounded w-1/3"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPageIndex(0); }}
      />

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

export default ProvidersTable;
