"use client";

import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, format, eachDayOfInterval, getDay, setHours, setMinutes } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { ServiceDetail } from '@/types/domain';
import { getProviderServices, PostProviderShift, ShiftsPost } from "@/services/ApiHandler";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function TurnosView() {
  const router = useRouter();
  const { user } = useAuth();
  const [range, setRange] = useState<any>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [providerId, setProviderId] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [turnos, setTurnos] = useState<
    { day: string; start: string; service: string; capacity: number }[]
  >([]);

  const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const fetchData = async (providerIdParam?: string) => {
    try {
      const providerIdToUse = providerIdParam || providerId;
      const res = await getProviderServices(providerIdToUse, {
        page: 1,
        pageSize: 1000,
      });
      setServices(res.items);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    if (user && user.providerId) {
      setProviderId(user.providerId);
      fetchData(user.providerId);
    }
  }, [user]);

  const addTurno = (day: string, start: string, capacity: number) => {
    if (!selectedService)
      return Swal.fire(
        "Error",
        "Por favor selecciona un servicio antes de agregar un turno.",
        "error"
      );

    if (
      turnos.some(
        (t) =>
          t.day === day &&
          t.start === start &&
          t.service === selectedService
      )
    ) {
      return Swal.fire("Error", "El turno ya ha sido agregado.", "error");
    }

    setTurnos((prev) => [
      ...prev,
      { day, start, service: selectedService, capacity },
    ]);
  };

  const removeTurno = (index: number) => {
    setTurnos((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedServiceObj = services.find(
    (s) => String(s.id) === selectedService
  );

  const handleSubmit =  async () => {
    if (turnos.length === 0) {
      Swal.fire("Error", "No hay turnos cargados.", "error");
      return;
    }

    // Mapear nombres de días de la semana a índices (0=Domingo ... 6=Sábado)
    const dayMap: Record<string, number> = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };

    const daysInRange = eachDayOfInterval({
      start: range[0].startDate,
      end: range[0].endDate,
    });

    const result: any[] = [];

    turnos.forEach((t) => {
      const serviceId = Number(t.service);
      const [hour, minute] = t.start.split(":").map(Number);

      daysInRange.forEach((date) => {
        if (getDay(date) === dayMap[t.day]) {
          // Construir fecha completa con la hora seleccionada
          const turnoDate = setMinutes(setHours(date, hour), minute);

          result.push({
            serviceId,
            start: turnoDate.toISOString(), // UTC ISO
            maxCapacity: t.capacity,
            status: 1, // hardcodeado
          });
        }
      });
    });

    try {
      await PostProviderShift(providerId, result as ShiftsPost[]);
      Swal.fire({
        icon: 'success',
        title: 'Turnos creados con éxito',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        router.push('/provider/calendar');
      });

    } catch (error) {
      console.error("Error creating shifts:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear los turnos',
        text: error instanceof Error ? error.message : 'Ha ocurrido un error inesperado',
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Generador de Turnos</h1>

      {/* Paso 1: Selección de rango */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">
          1. Selecciona un rango de fechas
        </h2>
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={range}
        />
        <p className="mt-2 text-sm text-gray-600">
          Desde {format(range[0].startDate, "dd/MM/yyyy")} hasta{" "}
          {format(range[0].endDate, "dd/MM/yyyy")}
        </p>
      </div>

      {/* Paso 2: Selección de días */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">
          2. Selecciona días de la semana
        </h2>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map((d) => (
            <button
              key={d}
              onClick={() => toggleDay(d)}
              className={`px-3 py-1 rounded-full border ${
                selectedDays.includes(d)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Paso 3: Selección de servicio */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">3. Selecciona un servicio</h2>
        <select
          value={selectedService}
          onChange={(e) => {
            const foundService = services.find(
              (s) => s.id === Number(e.target.value)
            );
            setSelectedService(foundService ? String(foundService.id) : "");
          }}
          className="border p-2 rounded-md w-full"
        >
          <option value="">-- Selecciona un servicio --</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.duration} min)
            </option>
          ))}
        </select>
      </div>

      {/* Paso 4: Agregar turnos */}
      {selectedDays.length > 0 && selectedService && (
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">4. Agregar turnos</h2>
          {selectedDays.map((day) => (
            <div key={day} className="mb-3">
              <h3 className="font-medium">- {day}</h3>
              <div className="flex gap-2 mt-1">
                <label>Hora: </label>
                <input
                  type="time"
                  className="border rounded-md p-1"
                  id={`hora-${day}`}
                />
                <label>Capacidad: </label>
                <input
                  type="number"
                  min={1}
                  defaultValue={selectedServiceObj?.suggestedMaxCapacity || 1}
                  className="border rounded-md p-1 w-24"
                  id={`capacidad-${day}`}
                />
                <button
                  onClick={() => {
                    const horaInput = document.getElementById(
                      `hora-${day}`
                    ) as HTMLInputElement;
                    const capInput = document.getElementById(
                      `capacidad-${day}`
                    ) as HTMLInputElement;
                    if (horaInput.value) {
                      addTurno(day, horaInput.value, Number(capInput.value));
                    }
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded-md"
                >
                  + Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista de turnos creados */}
      {turnos.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Turnos a generar</h2>
          <h3 className="font-medium mb-2">Del {format(range[0].startDate, "dd/MM/yyyy")} al {format(range[0].endDate, "dd/MM/yyyy")}</h3>
          <ul className="list-disc pl-6 space-y-1">
            {turnos.map((t, i) => (
              <li key={i}>
                {t.day} - {t.start} (
                {services.find((s) => String(s.id) === t.service)?.name ||
                  "Servicio no encontrado"}
                ) - Capacidad: {t.capacity}
                <button
                  onClick={() => removeTurno(i)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        disabled={turnos.length === 0}
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Guardar Turnos
      </button>
    </div>
  );
}
