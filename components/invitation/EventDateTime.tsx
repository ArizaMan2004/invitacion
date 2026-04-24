'use client';

import { Calendar, Clock } from 'lucide-react';

interface EventDateTimeProps {
  eventDate: string;
  eventTime: string;
}

export function EventDateTime({
  eventDate,
  eventTime,
}: EventDateTimeProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const dayName = days[date.getUTCDay()];
    const dayNum = date.getUTCDate();
    const monthName = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${dayName}, ${dayNum} de ${monthName} de ${year}`;
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Fecha y Hora</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-start md:items-center">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <p className="text-lg text-gray-600">{formatDate(eventDate)}</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-blue-300" />
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <p className="text-lg text-gray-600">{formatTime(eventTime)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
