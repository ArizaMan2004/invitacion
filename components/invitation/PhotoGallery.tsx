'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

// Definimos las 3 imágenes fijas
const fixedImages = [
  '/foto1.jpg', 
  '/foto2.jpg',
  '/foto3.jpg'
];

export function PhotoGallery() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-serif text-center mb-16 text-[#b8860b] uppercase tracking-[0.3em]"
        >
          Nuestros Momentos
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fixedImages.map((imagePath, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              // Bordes muy redondeados y sombra suave para mezclar con el fondo
              className="relative group rounded-[3rem] overflow-hidden shadow-2xl h-[450px] border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <Image
                src={imagePath}
                alt={`Fotografía ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              
              {/* Overlay sutil para mejorar la integración visual */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              
              {/* Borde interior decorativo */}
              <div className="absolute inset-0 rounded-[3rem] border border-white/5 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}