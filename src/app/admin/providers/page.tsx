'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { getProviders } from '@/services/ApiHandler';
import { Provider } from '@/types/domain';
import { DataTable } from '@/components/DataTable';


const columns: ColumnDef<Provider>[] = [
  { accessorKey: 'fullname', header: 'Nombre' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phoneNumber', header: 'Teléfono', cell: ({ row }) => (row.original.phoneNumber || 'N/A') },
  { accessorKey: 'cuil', header: 'CUIL' },
  { accessorKey: 'city.name', header: 'Ciudad' },
  { accessorKey: 'type', header: 'Tipo' },
  { accessorKey: 'needConfirmation', header: 'Confirma reservas', cell: ({ row }) => (row.original.needConfirmation ? 'Sí' : 'No') }
];

const ProviderTable = () => {
  const [data, setData] = useState<Provider[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const res = await getProviders({ page, pageSize: pagination.pageSize, search });
      setData(res.items);
      setPagination(res.pagination);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.page);
  }, [pagination.page]);

  return (
    <div>
      <h1 className="text-4xl font-semibold mb-6">Proximas salidas</h1>
      <DataTable
        columns={columns}
        data={data}
        total={total}
        pagination={pagination}
        loading={loading}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onSearch={(term) => fetchData(1, term)}
      />
    </div>
  );
};

export default ProviderTable;
