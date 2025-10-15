"use client";

import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, format } from "date-fns";

// Mock servicios con duración en minutos
const services = [
  { id: 1, name: "Consulta Médica", duration: 40 },
  { id: 2, name: "Sesión de Fisioterapia", duration: 60 },
  { id: 3, name: "Corte de Pelo", duration: 30 },
];

export default function TurnosView() {
  const [range, setRange] = useState<any>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [turnos, setTurnos] = useState<
    { day: string; start: string; service: string }[]
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

  const addTurno = (day: string, start: string) => {
    if (!selectedService) return alert("Selecciona un servicio primero");
    setTurnos((prev) => [
      ...prev,
      { day, start, service: selectedService.name },
    ]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Generador de Turnos</h1>

      {/* Paso 1: Selección de rango */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">1. Selecciona un rango de fechas</h2>
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
        <h2 className="text-lg font-semibold mb-2">2. Selecciona días de la semana</h2>
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
          value={selectedService?.id || ""}
          onChange={(e) =>
            setSelectedService(
              services.find((s) => s.id === Number(e.target.value)) || null
            )
          }
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
              <h3 className="font-medium">{day}</h3>
              <div className="flex gap-2 mt-1">
                <input
                  type="time"
                  className="border rounded-md p-1"
                  id={`hora-${day}`}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById(
                      `hora-${day}`
                    ) as HTMLInputElement;
                    if (input.value) addTurno(day, input.value);
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
          <h2 className="text-lg font-semibold mb-2">Turnos Generados</h2>
          <ul className="list-disc pl-6 space-y-1">
            {turnos.map((t, i) => (
              <li key={i}>
                {t.day} - {t.start} ({t.service})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
