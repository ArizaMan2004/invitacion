'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface MagicalSparklesProps {
  isActive: boolean;
  color: string;
  count?: number;
}

export function MagicalSparkles({ isActive, color, count = 30 }: MagicalSparklesProps) {
  const sparkles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 0.5,
      size: 2 + Math.random() * 4,
    }));
  }, [count]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: `${sparkle.left}vw`,
            y: `${sparkle.top}vh`,
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [`${sparkle.top}vh`, `${sparkle.top - 20}vh`],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            ease: 'easeOut',
          }}
          className="fixed rounded-full"
          style={{
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: color,
            boxShadow: `0 0 ${sparkle.size * 2}px ${color}`,
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
          }}
        />
      ))}
    </div>
  );
}
