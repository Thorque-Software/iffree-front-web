'use client';

import ReservationForm, {mappedShifts} from '@/components/ReservationForm';
import { getProviderServices,getShiftsServicesByDate } from '@/services/ApiHandler';
import { useEffect, useState } from 'react';
import { ServiceDetail, Shift } from '@/types/domain';
import { useAuth } from '@/hooks/useAuth';

function mapShifts(data: Shift[]): { id: number; shift: string }[] {
  return Object.values(data).map((item) => {
    const formatTimeUTC = (iso: string) => {
      const d = new Date(iso);
      const hours = String(d.getUTCHours()).padStart(2, '0');
      const minutes = String(d.getUTCMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    return {
      id: item.id,
      shift: `${formatTimeUTC(item.start)} a ${formatTimeUTC(item.end)}`,
    };
  });
}



export default function NewReservation() {
  const { user } = useAuth();
  const [providerId, setProviderId] = useState<string>("");
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [shifts, setShifts] = useState<mappedShifts>([]);

  const fetchData = async (providerIdParam?: string) => {
      try {
        const providerIdToUse = providerIdParam || providerId;
        const res = await getProviderServices(providerIdToUse, {
          page: 1,
          pageSize: 1000,
        });
        setServices(res.items);
        }catch (error) {
        console.error('Error fetching services:', error);
      }

    };

  useEffect(() => {
    if (user && user.providerId) {
      setProviderId(user.providerId);
      fetchData(user.providerId);
    }
  }, [user]);

  const handleServiceChange = async (serviceId: number, date: string) => {
    console.log('Cambiando servicio a:', serviceId, 'en fecha:', date);
    try {
        const res = await getShiftsServicesByDate(providerId, date, serviceId);
        const items = res.items as Shift[];
        const mappedShifts = mapShifts(items);
        setShifts(mappedShifts);
        }catch (error) {
        console.error('Error fetching shifts:', error);
    }   
  };

  const handleSubmit = (data: any) => {
    console.log('Datos de reserva:', data);
    alert('Reserva enviada correctamente');
  };

  return (
    <ReservationForm
      services={services}
      shifts={shifts}
      onServiceChange={handleServiceChange}
      onSubmit={handleSubmit}
    />
  );
}
