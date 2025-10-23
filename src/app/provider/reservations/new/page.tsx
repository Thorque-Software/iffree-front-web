'use client';

import ReservationForm, {mappedShifts,PostReservation} from '@/components/ReservationForm';
import { getProviderServices,getShiftsServicesByDate,PostProviderReservation } from '@/services/ApiHandler';
import { useEffect, useState } from 'react';
import { ServiceDetail, Shift } from '@/types/domain';
import { useAuth } from '@/hooks/useAuth';
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";


function mapShifts(data: Shift[]): { id: number; shift: string }[] {
  return data.map((item) => {
    const formatTimeLocal = (iso: string) => {
      const d = new Date(iso);
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    return {
      id: item.id,
      shift: `${formatTimeLocal(item.start)} a ${formatTimeLocal(item.end)}`,
    };
  });
}



export default function NewReservation() {
  const { user } = useAuth();
  const router = useRouter();
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

  const handleSubmit = async (data: PostReservation) => {
    console.log('Datos de reserva:', data);
    try {
          await PostProviderReservation(providerId, data);
          Swal.fire({
            icon: 'success',
            title: 'Reserva creada con éxito',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            router.push('/provider/reservations');
          });
    
        } catch (error) {
          console.error("Error creating reservation:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error al crear el servicio',
            text: error instanceof Error ? error.message : 'Ha ocurrido un error inesperado',
          });
        }
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
