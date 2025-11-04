'use client';

import React, { useState, useEffect} from 'react';
import FullCalendar from '@fullcalendar/react';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import {getProviderBoatReservations} from '@/services/ApiHandler';
import { ReservationBoat } from '@/types/domain';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Calendar() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [providerId, setProviderId] = useState<string>("");

  useEffect(() => {
    if (user && user.providerId) {
      setProviderId(user.providerId);
    }
  }, [user]);

  const fetchEvents = async (start: string, end: string) => {
    if (!providerId) return;
    setLoading(true);
    try {
      const res = await getProviderBoatReservations(providerId,start,end);
      console.log('Eventos obtenidos:', res.items);
      const mappedEvents = res.items.map((item: ReservationBoat) => ({
        id: String(item.id),
        title: (item.boat.name && item.finalUser) ? 
          `${item.boat.name} - ${item.finalUser.name} ${item.finalUser.lastname}` : 
          item.boat.name || 'Sin nombre',
        start: item.start,
        end: item.end,
        allDay: true,
        color: item.status === 'payed' ? 'green' : item.status === 'paying' ? 'orange' : 'red',
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
    window.open(`/providerBoat/reservations/${id}`, "_blank", "noopener,noreferrer");
  };

   if (!providerId) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <p className="text-gray-500">Cargando calendario...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Calendario</h1>
        <Link href="/providerBoat/reservations/cancel" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Cancelar turnos para una embaracación
        </Link>
      </div>
      {loading && <p className="text-gray-500 mb-2">Cargando eventos...</p>}

      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="es"
        allDaySlot={true}
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
            left: 'prev,next',
            center: 'title',
            right: 'timeGridWeek,dayGridMonth',
        }}
        buttonText={{
            week: 'Semana',
            month: 'Mes',
        }}
        eventDidMount={(info) => {
          info.el.style.marginTop = '3px';
          info.el.style.marginBottom = '3px';
          info.el.style.borderRadius = '3px';
        }}
      />
    </div>
  );
}
