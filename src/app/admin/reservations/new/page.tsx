'use client';

import { useState } from 'react';
import { Combobox } from '@headlessui/react';

interface Assistant {
  nombre: string;
  apellido: string;
  email: string;
  edad: string;
  documento: string;
}

export default function NewReservation() {
  const [assistants, setAssistants] = useState<Assistant[]>([
    { nombre: '', apellido: '', email: '', edad: '', documento: '' },
  ]);

  const services = ['Servicio 1', 'Servicio 2', 'Servicio 3'];
  const shifts = ['Mañana', 'Tarde', 'Noche'];
  const statuses = ['Pendiente', 'Confirmado', 'Cancelado'];
  const providers = ['Juan Pérez', 'Rick Sanchez', 'Value'];

  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedShift, setSelectedShift] = useState(shifts[0]);
  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const [date, setDate] = useState('');

  const addAssistant = () => {
    setAssistants([
      ...assistants,
      { nombre: '', apellido: '', email: '', edad: '', documento: '' },
    ]);
  };

  const removeAssistant = (index: number) => {
    setAssistants(assistants.filter((_, i) => i !== index));
  };

  const updateAssistant = (index: number, field: keyof Assistant, value: string) => {
    const updated = [...assistants];
    updated[index][field] = value;
    setAssistants(updated);
  };

  const confirmReservation = () => {
    console.log({
      service: selectedService,
      shift: selectedShift,
      status: selectedStatus,
      provider: selectedProvider,
      date,
      assistants,
    });
    alert('Reserva confirmada! Revisa consola.');
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Crear reserva</h1>

      {/* Combobox de proveedor primero */}
      <div className="mb-6 relative w-full md:w-1/2">
        <label className="block mb-1 font-medium">Proveedor</label>
        <Combobox
          value={selectedProvider}
          onChange={(value: string | null) => setSelectedProvider(value ?? '')}
        >
          <Combobox.Input
            className="w-full bg-white rounded-md border border-gray-300 p-2"
            placeholder="Buscar proveedor..."
            displayValue={(p: string) => p}
          />
          <Combobox.Options className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {providers.map((p) => (
              <Combobox.Option key={p} value={p} className="p-2 hover:bg-gray-100 cursor-pointer">
                {p}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Servicio */}
        <div>
          <label className="block mb-1 font-medium">Servicio</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-white rounded-md border border-gray-300 p-2"
          >
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
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
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="w-full bg-white rounded-md border border-gray-300 p-2"
          >
            {shifts.map((s) => (
              <option key={s} value={s}>
                {s}
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
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón agregar asistente */}
      <div className="flex justify-end mb-4">
        <h2 className="text-2xl font-semibold mr-auto">Asistentes</h2>
        <button
          onClick={addAssistant}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Agregar asistente
        </button>
      </div>

      {/* Cards de asistentes */}
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
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              placeholder="Nombre"
              value={assistant.nombre}
              onChange={(e) => updateAssistant(index, 'nombre', e.target.value)}
              className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
            />
            <label className="block text-sm font-medium mb-1">Apellido</label>
            <input
              type="text"
              placeholder="Apellido"
              value={assistant.apellido}
              onChange={(e) => updateAssistant(index, 'apellido', e.target.value)}
              className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
            />
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={assistant.email}
              onChange={(e) => updateAssistant(index, 'email', e.target.value)}
              className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
            />
            <label className="block text-sm font-medium mb-1">Edad</label>
            <input
              type="text"
              placeholder="Edad"
              value={assistant.edad}
              onChange={(e) => updateAssistant(index, 'edad', e.target.value)}
              className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
            />
            <label className="block text-sm font-medium mb-1">Documento</label>
            <input
              type="text"
              placeholder="Documento"
              value={assistant.documento}
              onChange={(e) => updateAssistant(index, 'documento', e.target.value)}
              className="w-full bg-white rounded-md border border-gray-300 p-2 mb-2"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={confirmReservation}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
        >
          Confirmar reserva
        </button>
      </div>
    </div>
  );
}
