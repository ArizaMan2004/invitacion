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
  guestName: string; // Nombre que viene de la invitación
  accentColor: string;
}

// --- PREGUNTAS PARA JESÚS ---
const QUESTIONS_JESUS: Question[] = [
  { id: 1, question: "¿Cuál es el deporte favorito de Jesús?", options: ["Fútbol", "Béisbol", "Básquet", "Tenis"], correctAnswer: 0 },
  { id: 2, question: "¿Qué prefiere comer Jesús los domingos?", options: ["Pizza", "Tacos", "Hamburguesas", "Sushi"], correctAnswer: 2 },
  { id: 3, question: "¿Cuál es su superhéroe favorito?", options: ["Batman", "Spider-Man", "Iron Man", "Superman"], correctAnswer: 1 },
];

// --- PREGUNTAS PARA JESSENIA ---
const QUESTIONS_JESSENIA: Question[] = [
  { id: 1, question: "¿Cuál es el color favorito de Jessenia?", options: ["Rosa", "Lila", "Azul Cielo", "Verde"], correctAnswer: 1 },
  { id: 2, question: "¿A qué país desea viajar Jessenia?", options: ["Francia", "Japón", "Corea del Sur", "Italia"], correctAnswer: 2 },
  { id: 3, question: "¿Cuál es su género de película favorito?", options: ["Terror", "Romance", "Acción", "Comedia"], correctAnswer: 1 },
];

type GamePhase = 'selection' | 'playing' | 'finished';
type Twin = 'Jesus' | 'Jessenia';

export function Trivia({ invitationId, guestName, accentColor }: TriviaProps) {
  // Estados del flujo
  const [phase, setPhase] = useState<GamePhase>('selection');
  const [selectedTwin, setSelectedTwin] = useState<Twin | null>(null);
  
  // Estados de registro
  const [wantsToSave, setWantsToSave] = useState(false);
  const [playerName, setPlayerName] = useState('');

  // Estados del juego
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const activeQuestions = selectedTwin === 'Jesus' ? QUESTIONS_JESUS : QUESTIONS_JESSENIA;

  const handleStartGame = () => {
    if (!selectedTwin) return;
    setPhase('playing');
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return; // Evitar múltiples clicks

    setSelectedOption(index);
    const correct = index === activeQuestions[currentStep].correctAnswer;
    setIsCorrect(correct);

    if (correct) setScore(prev => prev + 1);

    // Esperar un momento para mostrar si fue correcta antes de pasar
    setTimeout(async () => {
      if (currentStep < activeQuestions.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        // Calcular score final incluyendo la última respuesta
        const finalScore = score + (correct ? 1 : 0);
        await finishGame(finalScore);
      }
    }, 1200);
  };

  const finishGame = async (finalScore: number) => {
    setPhase('finished');
    
    if (wantsToSave) {
      setIsSaving(true);
      const nameToRegister = playerName.trim() !== '' ? playerName.trim() : (guestName || 'Invitado Anónimo');
      
      try {
        await supabase.from('trivia_results').insert({
          invitation_id: invitationId,
          guest_name: nameToRegister,
          twin_selected: selectedTwin,
          score: finalScore,
          total_questions: activeQuestions.length,
          created_at: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error al guardar resultado:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const resetGame = () => {
    setPhase('selection');
    setSelectedTwin(null);
    setCurrentStep(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setWantsToSave(false);
    setPlayerName('');
  };

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-xl mx-auto backdrop-blur-xl bg-black/40 p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl min-h-[450px] flex flex-col justify-center relative z-10">
        
        <AnimatePresence mode="wait">
          
          {/* 1. SELECCIÓN DE GEMELO Y REGISTRO */}
          {phase === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-8"
            >
              <div>
                <h3 className="text-3xl font-serif text-[#fcfcf0] mb-2">¡Trivia de Gemelos!</h3>
                <p className="text-white/50 text-sm italic">¿De quién quieres responder preguntas hoy?</p>
              </div>

              <div className="flex gap-4">
                {(['Jesus', 'Jessenia'] as Twin[]).map((twin) => (
                  <button
                    key={twin}
                    onClick={() => setSelectedTwin(twin)}
                    className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold text-lg
                      ${selectedTwin === twin 
                        ? 'bg-white/10 border-white/40 text-white' 
                        : 'bg-transparent border-white/10 text-white/40 hover:border-white/20'}`}
                    style={selectedTwin === twin ? { borderColor: accentColor, color: accentColor } : {}}
                  >
                    {twin}
                  </button>
                ))}
              </div>

              {selectedTwin && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-center gap-3 bg-white/5 p-4 rounded-2xl cursor-pointer" onClick={() => setWantsToSave(!wantsToSave)}>
                    <input 
                      type="checkbox" 
                      checked={wantsToSave} 
                      readOnly
                      className="w-5 h-5 accent-[#b8860b]"
                    />
                    <span className="text-sm text-white/80">¿Guardar mi resultado para el ranking?</span>
                  </div>

                  {wantsToSave && (
                    <input 
                      type="text" 
                      placeholder="Escribe tu nombre o apodo..." 
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white text-center focus:outline-none focus:border-white/30 transition-all"
                    />
                  )}

                  <button 
                    onClick={handleStartGame}
                    className="w-full py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: accentColor, color: '#121912' }}
                  >
                    Comenzar Juego
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* 2. JUEGO EN PROGRESO */}
          {phase === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center"
            >
              <div className="mb-8">
                <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 block mb-2">Trivia de {selectedTwin}</span>
                <div className="flex justify-center gap-1">
                  {activeQuestions.map((_, i) => (
                    <div key={i} className={`h-1 w-8 rounded-full transition-all ${i <= currentStep ? 'bg-white' : 'bg-white/10'}`} 
                         style={{ backgroundColor: i <= currentStep ? accentColor : undefined }} />
                  ))}
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-serif text-[#fcfcf0] mb-10 leading-snug">
                {activeQuestions[currentStep].question}
              </h3>

              <div className="space-y-3">
                {activeQuestions[currentStep].options.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isAnswerCorrect = index === activeQuestions[currentStep].correctAnswer;
                  
                  // Feedback visual
                  let btnClass = "border-white/10 text-white/70 hover:bg-white/5";
                  if (isSelected) {
                    btnClass = isCorrect 
                      ? "border-green-500 bg-green-500/20 text-green-200" 
                      : "border-red-500 bg-red-500/20 text-red-200";
                  } else if (selectedOption !== null && isAnswerCorrect) {
                    // Mostrar la correcta si el usuario falló
                    btnClass = "border-green-500/50 bg-green-500/10 text-green-200";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedOption !== null}
                      className={`w-full p-4 rounded-2xl border text-lg transition-all duration-300 ${btnClass}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 3. RESULTADO FINAL */}
          {phase === 'finished' && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center mx-auto mb-8 shadow-2xl bg-white/5" style={{ borderColor: accentColor }}>
                <span className="text-4xl font-bold text-white">{score}</span>
                <span className="text-[10px] uppercase opacity-50 font-bold">Puntos</span>
              </div>

              <h3 className="text-3xl font-serif text-[#fcfcf0] mb-2">
                {score === activeQuestions.length ? "¡Perfecto!" : "¡Buen intento!"}
              </h3>
              
              <p className="text-white/60 mb-10 text-sm max-w-[280px] mx-auto">
                {score === activeQuestions.length 
                  ? `Demostraste que conoces increíblemente bien a ${selectedTwin}.`
                  : `Te faltó muy poco para conocer todo sobre ${selectedTwin}.`}
              </p>

              <div className="space-y-3">
                <button 
                  onClick={resetGame}
                  className="w-full py-4 rounded-full font-bold uppercase tracking-widest text-sm"
                  style={{ backgroundColor: accentColor, color: '#121912' }}
                >
                  Jugar de nuevo
                </button>
                {wantsToSave && (
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">
                    {isSaving ? "Guardando en el ranking..." : "Resultado guardado en el sistema"}
                  </p>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Decoración de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-serif opacity-[0.03] pointer-events-none select-none text-white z-0">
        ?
      </div>
    </section>
  );
}