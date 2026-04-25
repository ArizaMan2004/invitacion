'use client';

import { Calendar, Clock } from 'lucide-react';

interface EventDateTimeProps {
  date?: string;      // Aceptamos 'date' (como envía el SPA)
  eventDate?: string; // O 'eventDate' (como estaba antes)
  time?: string;
  eventTime?: string;
  accentColor?: string;
}

export function EventDateTime({
  date,
  eventDate,
  time,
  eventTime,
  accentColor = '#b8860b'
}: EventDateTimeProps) {
  
  // Priorizamos los nombres que vienen del SPA, si no, los originales
  const finalDate = date || eventDate;
  const finalTime = time || eventTime;

  const formatDate = (dateString: string | undefined) => {
    // Si no hay fecha en la DB, ponemos la tuya por defecto para que no salga "Confirmar"
    if (!dateString) return 'Sábado, 11 de Julio de 2026';
    
    try {
      const dateObj = new Date(dateString + 'T00:00:00'); 
      if (isNaN(dateObj.getTime())) return 'Sábado, 11 de Julio de 2026';

      return new Intl.DateTimeFormat('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'UTC'
      }).format(dateObj);
    } catch (e) {
      return 'Sábado, 11 de Julio de 2026';
    }
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString || typeof timeString !== 'string' || !timeString.includes(':')) {
      return '19:00 PM'; // Hora por defecto si falla
    }

    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    } catch (error) {
      return timeString;
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl font-serif mb-10 uppercase tracking-[0.3em]"
          style={{ color: accentColor }}
        >
          Fecha y Hora
        </motion.h2>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center bg-white/[0.02] backdrop-blur-md p-10 rounded-[3rem] border border-white/10 shadow-2xl">
          {/* BLOQUE FECHA */}
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-white/5 border border-white/5">
              <Calendar className="w-7 h-7" style={{ color: accentColor }} />
            </div>
            <p className="text-2xl font-serif text-[#fcfcf0] capitalize">
              {formatDate(finalDate)}
            </p>
          </div>

          {/* SEPARADOR */}
          <div className="hidden md:block w-px h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          {/* BLOQUE HORA */}
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-white/5 border border-white/5">
              <Clock className="w-7 h-7" style={{ color: accentColor }} />
            </div>
            <p className="text-2xl font-serif text-[#fcfcf0]">
              {formatTime(finalTime)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion'; // Asegúrate de tener framer-motion instalado