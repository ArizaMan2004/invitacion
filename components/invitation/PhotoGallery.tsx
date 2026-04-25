'use client';

import Image from 'next/image';

// Definimos las imágenes fijas aquí. 
// IMPORTANTE: Los nombres deben coincidir exactamente con los archivos en tu carpeta 'public'
const fixedImages = [
  '/foto1.jpg', 
  '/foto2.jpg',
  '/foto3.jpg'
];

export function PhotoGallery() {
  return (
    <section className="py-24 px-6 bg-[#121f12]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-serif text-center mb-16 text-[#6b8e23] uppercase tracking-[0.2em]">
          Galería de Fotos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fixedImages.map((imagePath, index) => (
            <div
              key={index}
              className="relative group rounded-2xl overflow-hidden shadow-2xl h-80 border border-white/5"
            >
              <Image
                src={imagePath}
                alt={`Fotografía de la Quinceañera ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index === 0} // Da prioridad de carga a la primera imagen
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}