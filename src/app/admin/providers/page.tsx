'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { getCities, getProviders } from '@/services/ApiHandler';
import { Provider } from '@/types/domain';
import { DataTable } from '@/components/DataTable';
import Link from 'next/link';


const columns: ColumnDef<Provider>[] = [
  { accessorKey: 'fullname', header: 'Nombre' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phoneNumber', header: 'Teléfono', cell: ({ row }) => (row.original.phoneNumber || 'N/A') },
  { accessorKey: 'cuil', header: 'CUIL' },
  { accessorKey: 'city.name', header: 'Ciudad' },
  { accessorKey: 'type', header: 'Tipo' , cell: ({ row }) => (row.original.type === 'default' ? 'Normal' : 'Náutico')},
  { accessorKey: 'needConfirmation', header: 'Confirma reservas', cell: ({ row }) => (row.original.needConfirmation ? 'Sí' : 'No') },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return (
        <Link href={`/admin/providers/details/${row.original.id}`} className="bg-green-700 text-white px-4 py-2 rounded mr-4">Detalle</Link>
      );
    },
  },
];

const ProviderTable = () => {
  const [data, setData] = useState<Provider[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState<{ label: string; value: number }[]>([]);

  const fetchCities = async () => {
    try {
      const res = await getCities();
      const labeledCities = res.items.map(city => ({
        label: city.name,
        value: city.id
      }));
      setCities(labeledCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchData = async (page: number, searchParams?: string, filtersParams?: Record<string, any>) => {
    setLoading(true);
    try {
      const sear = searchParams || search;
      const filt = filtersParams || filters;
      const res = await getProviders({ page, pageSize: pagination.pageSize, search: sear, filters: filt });
      setData(res.items);
      setPagination(res.pagination);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.page);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold mb-6">Proveedores</h1>
        <Link href="/admin/providers/new" className="bg-blue-600 text-white px-4 py-2 rounded mr-4">+ Nuevo proveedor</Link>
      </div>
      
      <DataTable
        columns={columns}
        data={data}
        total={total}
        pagination={pagination}
        loading={loading}
        onPageChange={(page) => fetchData(page)}
        onSearch={(term) => {
          fetchData(1, term);
          setSearch(term);
        }}
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          fetchData(1, "", newFilters);
        }}
        filterConfig={[
          { key: 'type', label: 'Tipo', type: 'select', options: [
            { label: 'Normal', value: 'default' },
            { label: 'Náutico', value: 'boat' },
          ]
          },
          { key: 'needConfirmation', label: 'Confirma reservas', type: 'select', options: [
            { label: 'Sí', value: true },
            { label: 'No', value: false },
          ]
          },
          { key: 'cityId', label: 'Ciudad', type: 'select', options: cities
          },
        ]}
      />
    </div>
  );
};

export default ProviderTable;
