'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createRSVPResponse, createGuestMessage } from '@/lib/supabase';

interface RSVPFormProps {
  invitationId: string;
}

export function RSVPForm({ invitationId }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Guardar respuesta RSVP. 
      // Enviamos valores por defecto para los campos que ya no usamos
      // para evitar que la función de Supabase falle.
      const rsvpId = await createRSVPResponse({
        invitationId,
        guestName: formData.name,
        guestEmail: '', // Ya no lo pedimos
        guestPhone: '', // Ya no lo pedimos
        attending: true, // Asumimos que asiste si llena el formulario
        numberOfGuests: 1, // Por defecto 1
        dietaryRestrictions: '', 
      });

      if (!rsvpId) {
        setError('Error al guardar tu confirmación. Intenta nuevamente.');
        setLoading(false);
        return;
      }

      // Guardar el mensaje para los cumpleañeros si escribieron algo
      if (formData.message.trim()) {
        await createGuestMessage({
          invitationId,
          guestName: formData.name,
          guestEmail: '', 
          message: formData.message,
          approved: false, // Puedes aprobarlos luego en tu panel
        });
      }

      setSubmitted(true);
      
      // Limpiar el formulario y quitar el mensaje de éxito después de unos segundos
      setTimeout(() => {
        setFormData({
          name: '',
          message: '',
        });
        setSubmitted(false);
      }, 5000); 

    } catch (err) {
      setError('Ocurrió un error al enviar tus datos. Por favor intenta de nuevo.');
      console.error('[v0] RSVP Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-light text-center mb-8 text-gray-800 tracking-wide">
          Confirmar Asistencia
        </h2>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center shadow-sm">
            <p className="text-xl font-medium text-green-800 mb-2">
              ¡Gracias por confirmar!
            </p>
            <p className="text-green-700">
              Nos alegra mucho que nos acompañes en este día tan especial.
            </p>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit} 
            className="space-y-6 bg-gray-50 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre y Apellido *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                required
                className="w-full bg-white"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Un mensaje para los cumpleañeros (Opcional)
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Escribe tus buenos deseos aquí..."
                rows={4}
                className="w-full bg-white resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium text-lg py-6 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Confirmar Asistencia'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}