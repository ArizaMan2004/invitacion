'use client';

import { MapPin } from 'lucide-react';

interface LocationMapProps {
  venue: string;
  mapIframeSrc: string;
}

export function LocationMap({
  venue,
  mapIframeSrc,
}: LocationMapProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center text-blue-900 flex items-center justify-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          Ubicación
        </h2>

        <div className="rounded-lg overflow-hidden shadow-lg mb-6 h-96">
          {mapIframeSrc ? (
            <iframe
              src={mapIframeSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación del Evento"
            />
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
              <p className="text-blue-600">Mapa no configurado</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-blue-900 mb-4">{venue}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(venue)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center"
            >
              Ver en Google Maps
            </a>
            <a
              href={`https://waze.com/ul?q=${encodeURIComponent(venue)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center"
            >
              Abre en Waze
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
