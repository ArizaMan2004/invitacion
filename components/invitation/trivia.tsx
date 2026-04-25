'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface TriviaProps {
  invitationId: string;
  guestName: string;
  accentColor: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "¿Cuál es el color favorito de la quinceañera?",
    options: ["Verde Esmeralda", "Azul Cielo", "Rosa Pastel", "Lila"],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "¿A qué país sueña con viajar?",
    options: ["Francia", "Japón", "Italia", "Corea del Sur"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "¿Cuál es su pasatiempo favorito?",
    options: ["Leer", "Bailar", "Pintar", "Jugar Videojuegos"],
    correctAnswer: 2,
  },
];

export function Trivia({ invitationId, guestName, accentColor }: TriviaProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    const correct = index === QUESTIONS[currentStep].correctAnswer;
    setIsCorrect(correct);

    if (correct) setScore(score + 1);

    setTimeout(() => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        finishTrivia();
      }
    }, 1500);
  };

  const finishTrivia = async () => {
    setIsFinished(true);
    // Guardar resultado en Supabase
    try {
      await supabase.from('trivia_results').insert({
        invitation_id: invitationId,
        guest_name: guestName || 'Invitado Anónimo',
        score: score + (isCorrect ? 1 : 0),
        total_questions: QUESTIONS.length,
      });
    } catch (err) {
      console.error("Error guardando trivia:", err);
    }
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-xl mx-auto backdrop-blur-xl bg-black/40 p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative z-10">
        
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <span className="text-xs tracking-[0.4em] uppercase opacity-50 mb-4 block" style={{ color: accentColor }}>
                Pregunta {currentStep + 1} de {QUESTIONS.length}
              </span>
              
              <h3 className="text-2xl md:text-3xl font-serif mb-10 text-[#fcfcf0]">
                {QUESTIONS[currentStep].question}
              </h3>

              <div className="space-y-4">
                {QUESTIONS[currentStep].options.map((option, index) => {
                  const isThisSelected = selectedOption === index;
                  const showSuccess = isThisSelected && isCorrect;
                  const showError = isThisSelected && isCorrect === false;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedOption !== null}
                      className={`w-full p-4 rounded-2xl border transition-all duration-300 text-lg font-light
                        ${isThisSelected ? 'scale-[1.02]' : 'hover:bg-white/5'}
                        ${showSuccess ? 'border-green-500 bg-green-500/20 text-green-200' : 
                          showError ? 'border-red-500 bg-red-500/20 text-red-200' : 
                          'border-white/10 text-white/80'}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center mx-auto mb-6 shadow-lg"
                   style={{ borderColor: accentColor }}>
                <span className="text-3xl font-bold text-white">{score}/{QUESTIONS.length}</span>
              </div>
              <h3 className="text-3xl font-serif mb-4 text-[#fcfcf0]">¡Buen intento, {guestName}!</h3>
              <p className="text-white/60 mb-8">
                {score === QUESTIONS.length ? "¡Wow! La conoces a la perfección." : "Casi lo logras, ¡lo importante es celebrar juntos!"}
              </p>
              <button 
                onClick={() => {
                  setCurrentStep(0);
                  setScore(0);
                  setIsFinished(false);
                  setSelectedOption(null);
                }}
                className="px-8 py-3 rounded-full text-sm uppercase tracking-widest font-bold transition-all"
                style={{ backgroundColor: accentColor, color: '#121912' }}
              >
                Volver a intentar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decoración de fondo (Interrogación gigante) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-serif opacity-[0.03] pointer-events-none select-none text-white">
        ?
      </div>
    </section>
  );
}