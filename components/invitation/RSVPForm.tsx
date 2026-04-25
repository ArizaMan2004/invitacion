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
      // 1. Guardar la confirmación de asistencia
      // Enviamos el nombre y valores por defecto/vacíos para el resto
      const rsvpId = await createRSVPResponse({
        invitationId,
        guestName: formData.name,
        guestEmail: '', 
        guestPhone: '',
        attending: true, 
        numberOfGuests: 1, 
        dietaryRestrictions: '',
      });

      if (!rsvpId) {
        throw new Error('No se pudo generar el registro de RSVP');
      }

      // 2. Guardar el mensaje para los cumpleañeros (solo si escribieron algo)
      if (formData.message.trim()) {
        await createGuestMessage({
          invitationId,
          guestName: formData.name,
          guestEmail: '', 
          message: formData.message,
          approved: false, 
        });
      }

      setSubmitted(true);
      
      // Opcional: resetear el formulario después de 5 segundos
      setTimeout(() => {
        setFormData({ name: '', message: '' });
        setSubmitted(false);
      }, 5000);

    } catch (err) {
      setError('Hubo un problema al guardar tu respuesta. Por favor, inténtalo de nuevo.');
      console.error('RSVP Error:', err);
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
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm animate-in fade-in zoom-in duration-300">
            <p className="text-xl font-medium text-green-800 mb-2">
              ¡Confirmación enviada!
            </p>
            <p className="text-green-700">
              Gracias por acompañarnos en este día tan especial.
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

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
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
                className="w-full bg-white border-gray-200 focus:ring-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Un mensaje para los cumpleañeros (Opcional)
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Escribe tus buenos deseos..."
                rows={4}
                className="w-full bg-white border-gray-200 focus:ring-gray-400 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white font-medium text-lg py-6 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Confirmar Asistencia'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}