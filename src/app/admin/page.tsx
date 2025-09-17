'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { getShifts } from '@/services/ApiHandler';
import { Shift } from '@/types/domain';
import { DataTable } from '@/components/DataTable';


const columns: ColumnDef<Shift>[] = [
  { accessorKey: 'start', header: 'Inicio' },
  { accessorKey: 'end', header: 'Fin' },
  { accessorKey: 'maxCapacity', header: 'Capacidad Máxima' },
  { accessorKey: 'status', header: 'Estado' },
  { accessorKey: 'availablePlaces', header: 'Lugares Disponibles' },
];

const ShiftsTable = () => {
  const [data, setData] = useState<Shift[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page: number, search?: string) => {
    setLoading(true);
    try {
      const res = await getShifts({ page, pageSize: pagination.pageSize, search });
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
        searchable={false}
      />
    </div>
  );
};

export default ShiftsTable;
