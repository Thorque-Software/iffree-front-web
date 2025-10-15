'use client';

import React, { useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import {getShiftsServicesByDate} from '@/services/ApiHandler';
import { Shift } from '@/types/domain';

export default function Calendar() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async (start: string, end: string) => {
    setLoading(true);
    try {
      const res = await getShiftsServicesByDate("1", start, undefined, end);
      console.log('Eventos obtenidos:', res.items);
      const mappedEvents = res.items.map((shift: Shift) => ({
        id: String(shift.id),
        title: shift.service?.name || 'Sin nombre',
        start: shift.start,
        end: shift.end,
        allDay: false,
      }));
      setEvents(mappedEvents);
    } catch (err) {
      console.error('Error fetching events', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDatesSet = (info: any) => {
    const start = info.startStr;
    const end = info.endStr;
    fetchEvents(start, end);
  };

  const handleEventClick = async (clickInfo: EventClickArg) => {
    const id = clickInfo.event.id;
    window.open(`/provider/reservations?shiftId=${id}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Calendario</h1>
      {loading && <p className="text-gray-500 mb-2">Cargando eventos...</p>}

      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale="es"
        allDaySlot={false}
        editable={false}          
        eventResizableFromStart={false}
        eventStartEditable={false}
        eventDurationEditable={false}
        selectMirror
        nowIndicator
        events={events}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}  
        eventOverlap={true}
        slotEventOverlap={true}
        slotDuration="00:20:00"
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
        height="85vh"
        headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth',
        }}
        buttonText={{
            today: 'Hoy',
            week: 'Semana',
            day: 'Día',
            month: 'Mes',
        }}
      />
    </div>
  );
}
