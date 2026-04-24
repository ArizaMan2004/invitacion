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
    email: '',
    phone: '',
    guests: '1',
    attending: 'si',
    dietary: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      // Guardar respuesta RSVP
      const rsvpId = await createRSVPResponse({
        invitationId,
        guestName: formData.name,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        attending: formData.attending === 'si',
        numberOfGuests: parseInt(formData.guests),
        dietaryRestrictions: formData.dietary,
      });

      if (!rsvpId) {
        setError('Error al guardar tu respuesta. Intenta nuevamente.');
        setLoading(false);
        return;
      }

      // Guardar mensaje si se proporcionó
      if (formData.message.trim()) {
        await createGuestMessage({
          invitationId,
          guestName: formData.name,
          guestEmail: formData.email,
          message: formData.message,
          approved: false,
        });
      }

      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          guests: '1',
          attending: 'si',
          dietary: '',
          message: '',
        });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError('Error al guardar tu respuesta. Por favor intenta nuevamente.');
      console.error('[v0] RSVP Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Confirmar Asistencia
        </h2>

        {submitted ? (
          <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 text-center">
            <p className="text-lg font-semibold text-green-800">
              ¡Gracias por confirmar tu asistencia!
            </p>
            <p className="text-green-700 mt-2">
              Te esperamos en este día especial.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 text-red-800">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Tu Nombre *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Correo Electrónico *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@correo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Teléfono (Opcional)
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+34 XXX XXX XXX"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="attending" className="block text-sm font-medium mb-2">
                  ¿Asistirás? *
                </label>
                <select
                  id="attending"
                  name="attending"
                  value={formData.attending}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="si">Sí, asistiré</option>
                  <option value="no">No podré asistir</option>
                  <option value="quizas">Aún no sé</option>
                </select>
              </div>

              <div>
                <label htmlFor="guests" className="block text-sm font-medium mb-2">
                  Número de Acompañantes
                </label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.guests}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="dietary" className="block text-sm font-medium mb-2">
                Restricciones Dietéticas (Opcional)
              </label>
              <Input
                id="dietary"
                name="dietary"
                type="text"
                value={formData.dietary}
                onChange={handleChange}
                placeholder="Ej: vegetariano, sin gluten, etc."
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Mensaje (Opcional)
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Comparte un mensaje para María Elena..."
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Confirmar Asistencia'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
