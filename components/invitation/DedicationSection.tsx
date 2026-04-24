'use client';

interface DedicationSectionProps {
  message: string;
}

export function DedicationSection({
  message,
}: DedicationSectionProps) {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-8 text-blue-900">
          Dedicatoria
        </h2>
        <p className="text-lg text-gray-700 text-center leading-relaxed italic font-light">
          {message}
        </p>
      </div>
    </section>
  );
}
