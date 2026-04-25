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

// Al sacar el componente de la función principal, evitamos que se destruya 
// y vuelva a renderizar en cada tick del reloj.
const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 shadow-sm mb-2 md:mb-4">
      <span className="text-2xl md:text-5xl font-light text-gray-800">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-[10px] md:text-sm font-medium text-gray-500 uppercase tracking-widest">
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

  // Esto previene los desajustes de hidratación (Hydration Mismatch) 
  // al asegurar que el contador solo se muestre una vez cargado en el cliente.
  if (!isMounted) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-light text-center mb-8 md:mb-10 text-gray-800 tracking-wide">
          Faltan
        </h2>
        <div className="flex justify-center gap-3 md:gap-8">
          <TimeUnit value={timeRemaining.days} label="Días" />
          <TimeUnit value={timeRemaining.hours} label="Hrs" />
          <TimeUnit value={timeRemaining.minutes} label="Min" />
          <TimeUnit value={timeRemaining.seconds} label="Seg" />
        </div>
      </div>
    </section>
  );
}