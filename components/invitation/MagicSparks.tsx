'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function MagicSparks() {
  const [isMounted, setIsMounted] = useState(false);

  // Evitamos errores de hidratación renderizando solo en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Creamos 40 chispas
  const sparks = Array.from({ length: 40 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {sparks.map((_, i) => {
        // Posiciones y tiempos aleatorios para que se vea natural
        const randomLeft = Math.floor(Math.random() * 100);
        const randomTop = Math.floor(Math.random() * 100);
        const randomDuration = Math.random() * 4 + 3; // Entre 3 y 7 segundos
        const randomDelay = Math.random() * 3; // Retraso aleatorio
        const randomSize = Math.random() * 3 + 1; // Tamaño aleatorio

        return (
          <motion.div
            key={i}
            className="absolute bg-amber-200 rounded-full shadow-[0_0_8px_2px_rgba(251,191,36,0.6)]"
            style={{ 
              left: `${randomLeft}%`, 
              top: `${randomTop}%`,
              width: randomSize,
              height: randomSize
            }}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0], // Aparece y desaparece
              scale: [0, 1.5, 0], // Crece y se encoge
              y: [0, -100], // Sube flotando
              x: [0, Math.random() * 40 - 20], // Se mueve un poco a los lados
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: randomDelay,
            }}
          />
        );
      })}
    </div>
  );
}