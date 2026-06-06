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

const QUESTIONS_JESUS: Question[] = [
  { id: 1, question: "¿Cuál es el deporte favorito de Jesús?", options: ["Fútbol", "Béisbol", "Básquet", "Tenis"], correctAnswer: 0 },
  { id: 2, question: "¿Qué prefiere comer Jesús los domingos?", options: ["Pizza", "Tacos", "Hamburguesas", "Sushi"], correctAnswer: 2 },
  { id: 3, question: "¿Cuál es su superhéroe favorito?", options: ["Batman", "Spider-Man", "Iron Man", "Superman"], correctAnswer: 1 },
];

const QUESTIONS_JESSENIA: Question[] = [
  { id: 1, question: "¿Cuál es el equipo favorito de Jessenia?", options: ["Real Madrid", "Barca", "Roma", "City"], correctAnswer: 0 },
  { id: 2, question: "¿Cuál fue el primer deporte que practicó Jessenia?", options: ["Gimnasia artística", "Ballet", "Fútbol", "Natación"], correctAnswer: 1 },
  { id: 3, question: "¿Qué es lo que más hace Jessenia en las tardes?", options: ["Dormir", "Estudiar", "Entrenar", "Nada"], correctAnswer: 2 },
];

type GamePhase = 'selection' | 'playing' | 'finished';
type Twin = 'Jesus' | 'Jessenia';

export function Trivia({ invitationId, guestName, accentColor }: TriviaProps) {
  const [phase, setPhase] = useState<GamePhase>('selection');
  const [selectedTwin, setSelectedTwin] = useState<Twin | null>(null);
  const [wantsToSave, setWantsToSave] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const activeQuestions = selectedTwin === 'Jesus' ? QUESTIONS_JESUS : QUESTIONS_JESSENIA;

  const handleStartGame = () => { if (!selectedTwin) return; setPhase('playing'); };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    const correct = index === activeQuestions[currentStep].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);

    setTimeout(async () => {
      if (currentStep < activeQuestions.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        await finishGame(score + (correct ? 1 : 0));
      }
    }, 1200);
  };

  const finishGame = async (finalScore: number) => {
    setPhase('finished');
    if (wantsToSave) {
      setIsSaving(true);
      try {
        await supabase.from('trivia_results').insert({
          invitation_id: invitationId,
          guest_name: playerName.trim() || guestName || 'Invitado Anónimo',
          twin_selected: selectedTwin,
          score: finalScore,
          total_questions: activeQuestions.length,
          created_at: new Date().toISOString()
        });
      } finally { setIsSaving(false); }
    }
  };

  return (
    <section className="py-10 px-4 relative">
      {/* TARJETA DE CRISTAL EXAGERADA */}
      <motion.div 
        className="relative z-10 p-8 md:p-12 rounded-[2.5rem] border border-[#ffd700]/40 backdrop-blur-md shadow-[0_0_30px_rgba(255,215,0,0.15)] max-w-xl mx-auto w-full text-white overflow-hidden"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
        whileHover={{ boxShadow: '0 0 50px rgba(255,215,0,0.4)', borderColor: 'rgba(255,215,0,0.8)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {phase === 'selection' && (
            <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8 relative z-10">
              <h3 className="text-4xl font-serif text-[#ffd700] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">¡Trivia de Gemelos!</h3>
              <div className="flex gap-4">
                {(['Jesus', 'Jessenia'] as Twin[]).map((twin) => (
                  <button
                    key={twin}
                    onClick={() => setSelectedTwin(twin)}
                    className={`flex-1 py-4 rounded-full border-2 transition-all font-bold text-lg ${selectedTwin === twin ? 'bg-[#ffd700]/20 border-[#ffd700]' : 'border-white/20 hover:border-[#ffd700]/50'}`}
                  >
                    {twin}
                  </button>
                ))}
              </div>
              {selectedTwin && (
                <div className="space-y-4">
                  <input type="text" placeholder="Tu nombre..." value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="w-full p-4 rounded-full bg-white/5 border border-[#ffd700]/30 text-white text-center focus:border-[#ffd700] outline-none" />
                  <button onClick={handleStartGame} className="w-full py-4 rounded-full font-bold uppercase tracking-widest text-sm bg-[#ffd700] text-[#0a0514] hover:shadow-[0_0_20px_#ffd700]">Comenzar</button>
                </div>
              )}
            </motion.div>
          )}

          {phase === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center relative z-10">
              <h3 className="text-2xl font-serif text-white mb-8">{activeQuestions[currentStep].question}</h3>
              <div className="space-y-4">
                {activeQuestions[currentStep].options.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrectAnswer = index === activeQuestions[currentStep].correctAnswer;
                  const btnStyle = isSelected ? (isCorrect ? 'bg-green-500/40 border-green-400' : 'bg-red-500/40 border-red-400') : 'bg-white/5 border-[#ffd700]/30 hover:border-[#ffd700]';
                  return (
                    <button key={index} onClick={() => handleAnswer(index)} disabled={selectedOption !== null} className={`w-full p-4 rounded-full border transition-all ${btnStyle}`}>
                      {option}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {phase === 'finished' && (
            <motion.div key="finished" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center relative z-10">
              <div className="w-32 h-32 rounded-full border-4 border-[#ffd700] flex flex-col items-center justify-center mx-auto mb-6 shadow-[0_0_20px_#ffd700]">
                <span className="text-5xl font-bold">{score}</span>
              </div>
              <h3 className="text-3xl font-serif mb-6 text-[#ffd700]">¡Trivia Finalizada!</h3>
              <button onClick={() => { setPhase('selection'); setSelectedTwin(null); setScore(0); }} className="w-full py-4 rounded-full font-bold bg-[#ffd700] text-[#0a0514]">Reiniciar</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}