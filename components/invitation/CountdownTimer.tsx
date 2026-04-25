'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  eventDate: string;
  eventTime: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Convertimos los recuadros en "cristal" redondeado
const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl md:rounded-[2rem] border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)] mb-3 md:mb-5 transition-transform hover:scale-105">
      <span className="text-3xl md:text-5xl font-light text-[#fcfcf0] drop-shadow-md">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-[10px] md:text-xs font-medium text-[#a0b0a0] uppercase tracking-[0.2em]">
      {label}
    </span>
  </div>
);

export function CountdownTimer({ eventDate, eventTime }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const calculateTimeRemaining = () => {
      const eventDateTime = new Date(`${eventDate}T${eventTime}`);
      const now = new Date();
      const diff = eventDateTime.getTime() - now.getTime();

      if (diff > 0) {
        setTimeRemaining({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [eventDate, eventTime]);

  if (!isMounted) return null;

  return (
    // Eliminamos el bg-white para que se vea el fondo del contenedor principal
    <section className="py-10 md:py-14 w-full">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-10 tracking-[0.2em] text-[#b8860b] uppercase">
          Faltan
        </h2>
        <div className="flex justify-center gap-4 md:gap-8">
          <TimeUnit value={timeRemaining.days} label="Días" />
          <TimeUnit value={timeRemaining.hours} label="Hrs" />
          <TimeUnit value={timeRemaining.minutes} label="Min" />
          <TimeUnit value={timeRemaining.seconds} label="Seg" />
        </div>
      </div>
    </section>
  );
}