'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { getShiftsProvider } from '@/services/ApiHandler';
import { Shift } from '@/types/domain';
import { DataTable } from '@/components/DataTable';
import { formatDate } from '@/utils/utils';
import { useAuth } from '@/hooks/useAuth';


const columns: ColumnDef<Shift>[] = [
  { accessorKey: 'start', header: 'Inicio', cell: ({ row }) => formatDate(row.original.start) },
  { accessorKey: 'end', header: 'Fin', cell: ({ row }) => formatDate(row.original.end) },
  { accessorKey: 'maxCapacity', header: 'Capacidad Máxima' },
  { accessorKey: 'status', header: 'Estado' },
  { accessorKey: 'availablePlaces', header: 'Lugares Disponibles' },
];

const ShiftsTable = () => {
  const { user } = useAuth();
  const [providerId, setProviderId] = useState<string>("");
  const [data, setData] = useState<Shift[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page: number, providerIdParams?: string) => {
    setLoading(true);
    try {
      const providerIdToUse = providerIdParams || providerId;
      const res = await getShiftsProvider(providerIdToUse, { page, pageSize: pagination.pageSize });
      setData(res.items);
      setPagination(res.pagination);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
      if(user && user.providerId) {
      setProviderId(user.providerId);
      fetchData(pagination.page, user.providerId);    
      }
    }, [user]);

  useEffect(() => {
    if (!providerId) return;
    fetchData(pagination.page);
  }, [pagination.page, user]);



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
        searchable={false}
      />
    </div>
  );
};

export default ShiftsTable;
