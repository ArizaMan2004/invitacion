'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

export function CountdownTimer({
  eventDate,
  eventTime,
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
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

  const TimeUnit = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg p-4 md:p-6 border-2 border-blue-200 shadow-lg">
        <p className="text-3xl md:text-5xl font-bold text-blue-900">
          {String(value).padStart(2, '0')}
        </p>
      </div>
      <p className="mt-2 text-sm md:text-base font-semibold text-gray-600 uppercase tracking-widest">
        {label}
      </p>
    </motion.div>
  );

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
          Faltan:
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <TimeUnit value={timeRemaining.days} label="Días" />
          <TimeUnit value={timeRemaining.hours} label="Horas" />
          <TimeUnit value={timeRemaining.minutes} label="Minutos" />
          <TimeUnit value={timeRemaining.seconds} label="Segundos" />
        </div>
      </div>
    </section>
  );
}
