'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  eventDate?: string; // Cambiado a opcional para validación
  eventTime?: string; // Cambiado a opcional para validación
  targetDate?: string; // Soporte para el nombre de prop usado en el SPA
  accentColor?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl md:rounded-[2rem] border border-white/10 shadow-xl mb-3 transition-transform hover:scale-105">
      <span className="text-2xl md:text-5xl font-light text-[#fcfcf0]">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-[10px] md:text-xs font-medium text-[#a0b0a0] uppercase tracking-[0.2em]">
      {label}
    </span>
  </div>
);

export function CountdownTimer({ eventDate, eventTime, targetDate, accentColor = '#b8860b' }: CountdownTimerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Usamos targetDate si existe, si no eventDate
  const dateToUse = targetDate || eventDate;
  const timeToUse = eventTime || "19:00"; // Hora por defecto si no viene nada

  useEffect(() => {
    setIsMounted(true);
    
    const calculateTimeRemaining = () => {
      if (!dateToUse) return;

      // Formato ISO robusto: YYYY-MM-DDTHH:mm:ss
      // Aseguramos que la fecha tenga el formato correcto para el constructor de Date
      const dateString = dateToUse.includes('T') ? dateToUse : `${dateToUse}T${timeToUse}`;
      const eventDateTime = new Date(dateString);
      const now = new Date();
      
      const diff = eventDateTime.getTime() - now.getTime();

      if (diff > 0) {
        setTimeRemaining({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        // Si la fecha ya pasó
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [dateToUse, timeToUse]);

  if (!isMounted || !dateToUse) return null;

  return (
    <section className="py-10 w-full">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="flex gap-4 md:gap-8 justify-center items-center">
          <TimeUnit value={timeRemaining.days} label="Días" />
          <TimeUnit value={timeRemaining.hours} label="Horas" />
          <TimeUnit value={timeRemaining.minutes} label="Min." />
          <TimeUnit value={timeRemaining.seconds} label="Seg." />
        </div>
      </div>
    </section>
  );
}