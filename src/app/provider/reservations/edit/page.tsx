'use client';

import { useEffect, useState } from 'react';
import ReservationForm from '@/components/ReservationForm';

interface Assistant {
  nombre: string;
  apellido: string;
  email: string;
  edad: string;
  documento: string;
}

export default function EditReservation({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  const services = ['Servicio 1', 'Servicio 2', 'Servicio 3'];
  const [shifts, setShifts] = useState(['Mañana', 'Tarde', 'Noche']);
  const statuses = ['Pendiente', 'Confirmado', 'Cancelado'];

  // Simula obtener la reserva existente
  useEffect(() => {
    const fetchReservation = async () => {
      setLoading(true);
      // Ejemplo: simulamos llamada a API
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              service: 'Servicio 2',
              shift: 'Tarde',
              status: 'Confirmado',
              date: '2025-10-10',
              assistants: [
                {
                  nombre: 'Juan',
                  apellido: 'Pérez',
                  email: 'juan@example.com',
                  edad: '28',
                  documento: '12345678',
                },
              ],
            }),
          600
        )
      );

      setInitialData(response);
      setLoading(false);
    };

    fetchReservation();
  }, [params.id]);

  // Fetch de horarios según servicio
  const handleServiceChange = async (service: string) => {
    console.log('Actualizando horarios para', service);
    const horarios = await fetch(`/api/horarios?servicio=${service}`).then((r) => r.json());
    setShifts(horarios);
  };

  // Enviar actualización
  const handleSubmit = (data: {
    service: string;
    shift: string;
    status: string;
    date: string;
    assistants: Assistant[];
  }) => {
    console.log('Reserva actualizada:', data);
    alert('Reserva actualizada correctamente');
    // Acá podrías hacer un fetch PUT o PATCH, ejemplo:
    // await fetch(`/api/reservations/${params.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Cargando reserva...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64 text-gray-500">
        Cargando reserva...
      </div>
  );
}
