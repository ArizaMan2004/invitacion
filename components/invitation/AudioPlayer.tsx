'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Pause } from 'lucide-react';

interface AudioPlayerProps {
  youtubeUrl?: string;
}

export function AudioPlayer({ youtubeUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Si no hay enlace configurado en el admin, no mostramos el botón
  if (!youtubeUrl) return null;

  // Extraer el ID exacto del video de YouTube
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(youtubeUrl);
  if (!videoId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      
      {/* El iframe de YouTube:
        En lugar de usar 'display: none' (que YouTube bloquea), 
        lo hacemos diminuto e invisible para engañar al sistema.
      */}
      {isPlaying && (
        <div className="absolute opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
          <iframe
            width="100"
            height="100"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`}
            allow="autoplay"
            title="Audio de fondo"
          />
        </div>
      )}

      {/* Botón Flotante Interactivo */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsPlaying(!isPlaying)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative group transition-colors duration-300 ${
          isPlaying ? 'bg-amber-100 text-amber-700' : 'bg-amber-600 text-white'
        }`}
      >
        {/* Efecto de ondas (ping) cuando la música está sonando */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping opacity-75" />
        )}
        
        {isPlaying ? (
          <Pause className="w-6 h-6 relative z-10" />
        ) : (
          <Music className="w-6 h-6 relative z-10" />
        )}
      </motion.button>
    </div>
  );
}