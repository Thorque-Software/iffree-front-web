'use client';

import { useState, useEffect } from 'react';
import{ ServiceDetail } from '@/types/domain';

export type mappedShifts = { id: number; shift: string }[];

const statuses = [
  {
    value: 'to_confirm',
    label: 'A confirmar'
  },
  {
    value: 'to_pay',
    label: 'A pagar'
  },
  {
    value: 'payed',
    label: 'Pagado'
  },
  {
    value: 'paying',
    label: 'En proceso de pago'
  }
]

interface Assistant {
  nombre: string;
  apellido: string;
  email: string;
  edad: string;
  documento: string;
}

interface ReservationFormProps {
  services: ServiceDetail[];
  shifts: mappedShifts;
  initialData?: {
    service?: ServiceDetail;
    shiftId?: number;
    status?: string;
    date?: string;
    assistants?: Assistant[];
  };
  onSubmit: (data: {
    serviceId: number;
    shiftId: number;
    status: string;
    date: string;
    assistants: Assistant[];
  }) => void;
  onServiceChange: (serviceId: number, date: string) => Promise<void> | void;
}

export default function ReservationForm({
  services,
  shifts,
  initialData,
  onSubmit,
  onServiceChange,
}: ReservationFormProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<number>(services[0]?.id || 0);
  const [selectedShiftId, setSelectedShiftId] = useState<number>(
    initialData?.shiftId ? Number(initialData.shiftId) : shifts[0]?.id || 0
  );
  const [selectedStatus, setSelectedStatus] = useState(initialData?.status || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [assistants, setAssistants] = useState<Assistant[]>(
    initialData?.assistants || [{ nombre: '', apellido: '', email: '', edad: '', documento: '' }]
  );

  // Cuando cambia el servicio, llamamos al fetch externo
  useEffect(() => {
    if (selectedServiceId && date) onServiceChange(selectedServiceId, date);
  }, [selectedServiceId, date]);

  const addAssistant = () => {
    setAssistants([...assistants, { nombre: '', apellido: '', email: '', edad: '', documento: '' }]);
  };

  const removeAssistant = (index: number) => {
    setAssistants(assistants.filter((_, i) => i !== index));
  };

  const updateAssistant = (index: number, field: keyof Assistant, value: string) => {
    const updated = [...assistants];
    updated[index][field] = value;
    setAssistants(updated);
  };

  const handleSubmit = () => {
    onSubmit({
      serviceId: selectedServiceId || 0,
      shiftId: selectedShiftId,
      status: selectedStatus,
      date,
      assistants,
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Reserva</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Servicio */}
        <div>
          <label className="block mb-1 font-medium">Servicio</label>
          <select
            value={selectedServiceId || 0}
            onChange={(e) => setSelectedServiceId(Number(e.target.value))}
            className="w-full bg-white rounded-md border border-gray-300 p-2"
          >
            <option value={0}>Selecciona un servicio</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="block mb-1 font-medium">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white rounded-md border border-gray-300 p-2"
          />
        </div>

        {/* Turno */}
        <div>
          <label className="block mb-1 font-medium">Turno</label>
          <select
            value={selectedShiftId || 0}
            onChange={(e) => setSelectedShiftId(Number(e.target.value))}
            className="w-full bg-white rounded-md border border-gray-300 p-2"
          >
            {shifts.length === 0 ? <option value={0}>No hay turnos disponibles en esta fecha</option> : <option value={0}>Selecciona un turno</option>}
            {shifts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shift}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block mb-1 font-medium">Estado</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-white rounded-md border border-gray-300 p-2"
          >
            <option value="">Selecciona un estado</option>
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Asistentes */}
      <div className="flex justify-end mb-4">
        <h2 className="text-2xl font-semibold mr-auto">Asistentes</h2>
        <button
          onClick={addAssistant}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Agregar asistente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {assistants.map((assistant, index) => (
          <div key={index} className="bg-gray-200 p-4 rounded-md relative">
            <button
              onClick={() => removeAssistant(index)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
            >
              ×
            </button>

            <h2 className="font-bold mb-2">Asistente {index + 1}</h2>

            {(['nombre', 'apellido', 'email', 'edad', 'documento'] as (keyof Assistant)[]).map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    placeholder={field}
                    value={assistant[field]}
                    onChange={(e) => updateAssistant(index, field, e.target.value)}
                    className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
                  />
                </div>
              )
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
        >
          Confirmar reserva
        </button>
      </div>
    </div>
  );
}
