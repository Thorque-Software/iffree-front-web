'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { getProviderProfit, getShiftsProvider,getProviderServices } from '@/services/ApiHandler';
import { Service, Shift } from '@/types/domain';
import { DataTable } from '@/components/DataTable';
import { formatDate } from '@/utils/utils';
import { useAuth } from '@/hooks/useAuth';
import ProfitChart from '@/components/ProfitChart';


const columns: ColumnDef<Shift>[] = [
  { accessorKey: 'start', header: 'Inicio', cell: ({ row }) => formatDate(row.original.start) },
  { accessorKey: 'end', header: 'Fin', cell: ({ row }) => formatDate(row.original.end) },
  { accessorKey: 'maxCapacity', header: 'Capacidad Máxima' },
  { accessorKey: 'status', header: 'Estado' },
  { accessorKey: 'availablePlaces', header: 'Lugares Disponibles' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [providerId, setProviderId] = useState<string>("");
  const [data, setData] = useState<Shift[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProfit = async (year: number, month: number) => {
    const res = await getProviderProfit(providerId, year, month);
    return res;
  }

  const fetchServices = async (providerIdParam: string) => {
    const res = await getProviderServices(providerIdParam, { page: 1, pageSize: 100 });
    setServices(res.items);
  }

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
      fetchServices(user.providerId);
      }
    }, [user]);

  useEffect(() => {
    if (!providerId) return;
    fetchData(pagination.page);
  }, [pagination.page, user]);

  if(services.length === 0 || !providerId){
      return <div>Cargando...</div>;
    }

  return (
    <div>
      <h1 className="text-4xl font-semibold mt-4 mb-6">Dashboard</h1>
      <ProfitChart services={services} fetchProfit={fetchProfit} />
      <h1 className="text-4xl font-semibold mt-4 mb-6">Proximas salidas</h1>
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

export default Dashboard;
