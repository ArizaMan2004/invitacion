'use client';

import { Ticket } from 'lucide-react';

interface TicketsSectionProps {
  numberOfTickets?: number;
}

export function TicketsSection({ numberOfTickets = 2 }: TicketsSectionProps) {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-12 text-blue-900">
          Pases de Acceso
        </h2>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: numberOfTickets }).map((_, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Ticket */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white overflow-hidden relative">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Ticket className="w-8 h-8" />
                    <div className="text-right">
                      <p className="text-xs font-semibold opacity-75">PASE #{index + 1}</p>
                      <p className="text-2xl font-bold">XV</p>
                    </div>
                  </div>

                  <div className="border-t border-blue-300 my-4 opacity-50"></div>

                  <div className="space-y-2">
                    <p className="font-semibold text-lg">Jessenia Morochos</p>
                    <p className="text-sm opacity-90">11 de Julio de 2026</p>
                    <p className="text-sm opacity-90">Refugio, Ecuador</p>
                  </div>

                  <div className="border-t border-blue-300 my-4 opacity-50"></div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono">GUEST #{index + 1}</span>
                    <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Perforated edge effect */}
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-repeating-gradient" style={{
                  backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 16px)`
                }}></div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-12 p-6 bg-blue-100 rounded-lg border border-blue-300">
          <p className="text-center text-blue-900 font-semibold">
            Presenta estos pases en la entrada de la fiesta
          </p>
        </div>
      </div>
    </section>
  );
}
