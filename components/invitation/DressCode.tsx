'use client';

interface DressCodeProps {
  dressCode: string;
}

export function DressCode({
  dressCode,
}: DressCodeProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Código de Vestimenta</h2>
        <p className="text-lg text-gray-600 mb-2">{dressCode}</p>
      </div>
    </section>
  );
}
