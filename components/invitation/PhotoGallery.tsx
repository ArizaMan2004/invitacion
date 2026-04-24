'use client';

import Image from 'next/image';

interface PhotoGalleryProps {
  images: string[];
}

export function PhotoGallery({
  images,
}: PhotoGalleryProps) {
  return (
    <section className="py-16 px-4 bg-blue-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
          Galería de Fotos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden shadow-lg h-72"
            >
              <Image
                src={image}
                alt={`Galería ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
