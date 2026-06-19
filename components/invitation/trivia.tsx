'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trophy, User, ArrowRight, CheckCircle2, HelpCircle, Gamepad2, Sparkles, RefreshCw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface TriviaProps {
  invitationId: string;
  guestName?: string;
  accentColor?: string;
}

interface RankingItem {
  id: string;
  guest_name: string;
  score: number;
  total_questions: number;
  created_at: string;
  twin_selected: string;
}

const QUESTIONS_JESUS: Question[] = [
  { id: 1, question: "¿Cuál es el deporte favorito de Jesús?", options: ["Fútbol", "Béisbol", "Básquet", "Tenis"], correctAnswer: 0 },
  { id: 2, question: "¿Cual es la comida favorita de Jesús?", options: ["Pizza", "Tacos", "Hamburguesas", "Sushi"], correctAnswer: 2 },
  { id: 3, question: "¿Cuál es su superhéroe favorito?", options: ["Batman", "Spider-Man", "Iron Man", "Superman"], correctAnswer: 1 },
];

const QUESTIONS_JESSENIA: Question[] = [
  { id: 1, question: "¿Cuál es el equipo favorito de Jessenia?", options: ["Real Madrid", "Barca", "Roma", "City"], correctAnswer: 0 },
  { id: 2, question: "¿Cuál fue el primer deporte que practicó Jessenia?", options: ["Ballet", "Natación", "Gimnasia", "Patinaje"], correctAnswer: 0 },
  { id: 3, question: "¿A qué le dedica más tiempo Jessenia?", options: ["A dormir", "A estudiar", "A entrenar", "A trabajar"], correctAnswer: 2 }
];

export default function Trivia({ invitationId, guestName = 'Explorador' }: TriviaProps) {
  const [step, setStep] = useState<'name' | 'twin' | 'quiz' | 'result'>('name');
  const [playerName, setPlayerName] = useState(guestName !== 'Explorador' ? guestName : '');
  const [twinSelected, setTwinSelected] = useState<'jesus' | 'jessenia' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [rankingJesus, setRankingJesus] = useState<RankingItem[]>([]);
  const [rankingJessenia, setRankingJessenia] = useState<RankingItem[]>([]);
  const [loadingRankings, setLoadingRankings] = useState(false);

  useEffect(() => {
    if (guestName !== 'Explorador' && guestName.trim() !== '') {
      setPlayerName(guestName);
    }
  }, [guestName]);

  const currentQuestions = twinSelected === 'jesus' ? QUESTIONS_JESUS : QUESTIONS_JESSENIA;

  const handleNextStep = () => {
    if (!playerName.trim()) return;
    setStep('twin');
  };

  const startTrivia = (twin: 'jesus' | 'jessenia') => {
    setTwinSelected(twin);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setStep('quiz');
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    
    const correct = optionIdx === currentQuestions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        saveResultsAndLoadRankings(score + (correct ? 1 : 0));
      }
    }, 1500);
  };

  const saveResultsAndLoadRankings = async (finalScore: number) => {
    setStep('result');
    setIsSaving(true);
    setLoadingRankings(true);

    try {
      await addDoc(collection(db, 'trivia_results'), {
        invitation_id: invitationId,
        guest_name: playerName.trim(),
        twin_selected: twinSelected,
        score: finalScore,
        total_questions: currentQuestions.length,
        created_at: new Date().toISOString()
      });
      await fetchRankings();
    } catch (error) {
      console.error("Error interactuando con la base de datos:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchRankings = async () => {
    try {
      const q = query(collection(db, 'trivia_results'), where('invitation_id', '==', invitationId));
      const querySnapshot = await getDocs(q);
      const allResults: RankingItem[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allResults.push({
          id: doc.id,
          guest_name: data.guest_name,
          score: data.score,
          total_questions: data.total_questions,
          created_at: data.created_at,
          twin_selected: data.twin_selected
        });
      });

      const sortLogic = (a: RankingItem, b: RankingItem) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      };

      // Aquí aplicamos el .slice(0, 5) para quedarnos solo con el Top 5
      const jesusSorted = allResults.filter(r => r.twin_selected === 'jesus').sort(sortLogic).slice(0, 5);
      const jesseniaSorted = allResults.filter(r => r.twin_selected === 'jessenia').sort(sortLogic).slice(0, 5);

      setRankingJesus(jesusSorted);
      setRankingJessenia(jesseniaSorted);
    } catch (error) {
      console.error("Error obteniendo rankings:", error);
    } finally {
      setLoadingRankings(false);
    }
  };

  const resetGame = () => {
    setTwinSelected(null);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setStep('name');
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 font-sans text-[#fcfcf0]">
      <AnimatePresence mode="wait">
        
        {step === 'name' && (
          <motion.div key="name-step" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-md mx-auto bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-[#ffd700]/10 border border-[#b8860b]/40 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <Gamepad2 className="w-8 h-8 text-[#ffd700]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-[#ffd700]">¿Quién va a jugar?</h3>
              <p className="text-xs text-[#a0b0a0]/70">Ingresa tu nombre para registrar tu lugar en el ranking de honor.</p>
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b8860b]" />
              <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Tu Nombre o Familia" className="w-full pl-12 pr-5 py-4 bg-black/40 border border-white/10 rounded-full text-white placeholder:text-[#a0b0a0]/30 focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/30 text-sm font-medium transition-all" />
            </div>
            <button onClick={handleNextStep} disabled={!playerName.trim()} className="w-full bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#b8860b] text-[#090d09] font-extrabold py-4 rounded-full uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 transition-all active:scale-[0.98]">
              Continuar <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 'twin' && (
          <motion.div key="twin-step" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#b8860b] font-semibold block">Desafío de Trivia</span>
              <h2 className="text-4xl font-serif text-white">¿A quién conoces mejor?</h2>
              <p className="text-sm text-[#a0b0a0]/70 max-w-md mx-auto">Selecciona el juego del mellizo que deseas poner a prueba.</p>
              
              <button 
                onClick={() => setStep('name')}
                className="text-xs text-[#ffd700] hover:text-white transition-colors underline underline-offset-4 mt-2"
              >
                Jugar como otra persona (Actual: {playerName})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { id: 'jesus', name: 'JESÚS', desc: 'Pon a prueba tus conocimientos sobre los gustos e historias de Jesús.' },
                { id: 'jessenia', name: 'JESSENIA', desc: 'Demuestra qué tanto sabes sobre los pasatiempos y secretos de Jessenia.' }
              ].map((twin) => (
                <button key={twin.id} onClick={() => startTrivia(twin.id as 'jesus' | 'jessenia')} className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:from-white/[0.07] border border-white/10 hover:border-[#ffd700]/40 p-8 rounded-[2.5rem] text-left transition-all duration-300 group shadow-xl relative overflow-hidden backdrop-blur-md active:scale-[0.99]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffd700]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-2xl font-serif text-[#ffd700] tracking-wide mb-2 flex items-center justify-between">
                    {twin.name} <Sparkles className="w-4 h-4 text-[#b8860b] opacity-40 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-[#a0b0a0]/80 leading-relaxed">{twin.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'quiz' && (
          <motion.div key="quiz-step" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-xl mx-auto bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/5 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#b8860b] font-bold">
                <HelpCircle className="w-4 h-4" /> Trivia de {twinSelected}
              </div>
              <span className="font-mono text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {currentQuestionIndex + 1} / {currentQuestions.length}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-serif text-white tracking-wide leading-relaxed">
              {currentQuestions[currentQuestionIndex].question}
            </h3>

            <div className="space-y-3">
              {currentQuestions[currentQuestionIndex].options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                let btnStyle = "border-white/10 bg-black/20 hover:bg-white/[0.03] hover:border-white/20";
                
                if (isSelected) {
                  btnStyle = isCorrect ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-red-500 bg-red-500/10 text-red-400";
                }

                return (
                  <button key={idx} disabled={selectedOption !== null} onClick={() => handleOptionSelect(idx)} className={`w-full p-4.5 rounded-2xl border text-left text-sm font-medium transition-all duration-200 flex items-center justify-between ${btnStyle}`}>
                    <span>{option}</span>
                    {isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div key="result-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="max-w-md mx-auto bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffd700]/20 to-transparent" />
              <div className="w-24 h-24 rounded-full border border-[#b8860b]/40 flex flex-col items-center justify-center mx-auto shadow-[0_0_40px_rgba(255,215,0,0.15)] bg-[#ffd700]/5">
                <span className="text-4xl font-serif font-bold text-[#ffd700]">{score}</span>
                <span className="text-[9px] uppercase tracking-widest text-[#a0b0a0] mt-0.5">Puntos</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif text-white">¡Trivia Finalizada!</h3>
                <p className="text-xs text-[#a0b0a0]/70">Gracias por jugar, <span className="text-white font-semibold">{playerName}</span>.</p>
              </div>

              {isSaving ? (
                <div className="flex items-center justify-center gap-2 text-xs text-[#a0b0a0]/60 py-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#b8860b]" /> Guardando registro en tiempo real...
                </div>
              ) : (
                <p className="text-xs text-emerald-400 font-medium bg-emerald-500/5 border border-emerald-500/10 py-2.5 rounded-full">
                  Tu puntuación se ha congelado en la tabla de clasificación.
                </p>
              )}

              <button onClick={resetGame} className="w-full py-4 rounded-full font-extrabold bg-[#ffd700] text-[#090d09] uppercase tracking-widest text-xs transition-all hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] active:scale-[0.98]">
                Jugar de Nuevo
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <Trophy className="w-6 h-6 text-[#ffd700] mx-auto mb-2" />
                <h3 className="text-2xl font-serif text-[#ffd700] uppercase tracking-wider">Tablas de Honor Oficiales</h3>
                <p className="text-xs text-[#a0b0a0]/60">Las posiciones empatadas priorizan al jugador más reciente.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-[2rem] p-6 space-y-4 backdrop-blur-sm">
                  <h4 className="text-center font-serif text-md uppercase tracking-widest text-[#b8860b] border-b border-white/5 pb-3 font-bold">
                    Top 5 Jesús
                  </h4>
                  {loadingRankings ? (
                    <div className="text-center py-10 text-xs text-[#a0b0a0]/40">Cargando posiciones...</div>
                  ) : rankingJesus.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[#a0b0a0]/30 italic">Nadie ha participado aún.</div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {rankingJesus.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 text-sm">
                          <div className="flex items-center gap-3">
                            <span className={`font-mono text-xs font-bold w-5 text-center ${index === 0 ? 'text-[#ffd700]' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-[#a0b0a0]/40'}`}>
                              #{index + 1}
                            </span>
                            <span className="font-medium text-white/90 truncate max-w-[140px]">{item.guest_name}</span>
                          </div>
                          <span className="font-mono font-bold text-[#ffd700] bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5 text-xs">
                            {item.score} / {item.total_questions}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-[2rem] p-6 space-y-4 backdrop-blur-sm">
                  <h4 className="text-center font-serif text-md uppercase tracking-widest text-[#b8860b] border-b border-white/5 pb-3 font-bold">
                    Top 5 Jessenia
                  </h4>
                  {loadingRankings ? (
                    <div className="text-center py-10 text-xs text-[#a0b0a0]/40">Cargando posiciones...</div>
                  ) : rankingJessenia.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[#a0b0a0]/30 italic">Nadie ha participado aún.</div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {rankingJessenia.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 text-sm">
                          <div className="flex items-center gap-3">
                            <span className={`font-mono text-xs font-bold w-5 text-center ${index === 0 ? 'text-[#ffd700]' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-[#a0b0a0]/40'}`}>
                              #{index + 1}
                            </span>
                            <span className="font-medium text-white/90 truncate max-w-[140px]">{item.guest_name}</span>
                          </div>
                          <span className="font-mono font-bold text-[#ffd700] bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5 text-xs">
                            {item.score} / {item.total_questions}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}