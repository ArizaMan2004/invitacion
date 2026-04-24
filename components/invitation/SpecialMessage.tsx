'use client';

interface SpecialMessageProps {
  message: string;
}

export function SpecialMessage({ message }: SpecialMessageProps) {
  const lines = message.split('\n');

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto">
        {/* Decorative top element */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1"></div>
          <div className="px-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">*</span>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1"></div>
        </div>

        {/* Message container */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 border-2 border-blue-200">
          <div className="text-center space-y-4">
            {lines.map((line, index) => (
              <p
                key={index}
                className="text-lg md:text-xl text-gray-800 font-semibold leading-relaxed"
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Decorative bottom element */}
        <div className="flex items-center justify-center mt-8">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1"></div>
          <div className="px-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">*</span>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1"></div>
        </div>
      </div>
    </section>
  );
}
