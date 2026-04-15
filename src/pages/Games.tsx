import { useState, useEffect, useRef } from 'react';
import { Gamepad2, Wind, Circle, Sparkles, RefreshCw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BreathingExercise = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [count, setCount] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          if (phase === 'Inhale') { setPhase('Hold'); return 4; }
          if (phase === 'Hold') { setPhase('Exhale'); return 4; }
          if (phase === 'Exhale') { setPhase('Inhale'); return 4; }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8">
      <motion.div
        animate={{
          scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 1 : 1.5,
          opacity: phase === 'Hold' ? 0.8 : 1
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className="w-48 h-48 rounded-full bg-emerald-400/20 border-4 border-emerald-500 flex items-center justify-center relative"
      >
        <div className="text-4xl font-bold text-emerald-600">{count}</div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-emerald-300 rounded-full"
        />
      </motion.div>
      <div className="text-center">
        <h4 className="text-2xl font-bold text-slate-900 mb-2">{phase}</h4>
        <p className="text-slate-500">Focus on your breath. Relax your shoulders.</p>
      </div>
    </div>
  );
};

const BubblePop = () => {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; color: string }[]>([]);
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const addBubble = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newBubble = {
      id: Date.now(),
      x: Math.random() * (rect.width - 60),
      y: Math.random() * (rect.height - 60),
      size: 40 + Math.random() * 40,
      color: ['bg-blue-400', 'bg-emerald-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400'][Math.floor(Math.random() * 5)]
    };
    setBubbles(prev => [...prev, newBubble]);
  };

  useEffect(() => {
    const interval = setInterval(addBubble, 1000);
    return () => clearInterval(interval);
  }, []);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(prev => prev + 1);
  };

  return (
    <div className="relative h-[400px] w-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 cursor-crosshair" ref={containerRef}>
      <div className="absolute top-4 right-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm z-10 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <span className="font-bold text-slate-900">{score}</span>
      </div>
      <AnimatePresence>
        {bubbles.map((b) => (
          <motion.button
            key={b.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            exit={{ scale: 1.5, opacity: 0 }}
            onClick={() => popBubble(b.id)}
            style={{ left: b.x, top: b.y, width: b.size, height: b.size }}
            className={`absolute rounded-full shadow-lg border-2 border-white/50 ${b.color} transition-transform hover:scale-110`}
          />
        ))}
      </AnimatePresence>
      {bubbles.length === 0 && (
        <div className="h-full flex items-center justify-center text-slate-300 italic">
          Wait for bubbles to appear...
        </div>
      )}
    </div>
  );
};

export default function Games() {
  const [activeGame, setActiveGame] = useState<'breathing' | 'bubbles'>('breathing');

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Stress Relief</h2>
        <p className="text-slate-500 mt-1">Take a moment for yourself with these calming activities.</p>
      </header>

      <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveGame('breathing')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
            activeGame === 'breathing' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Wind className="w-5 h-5" />
          Breathing
        </button>
        <button
          onClick={() => setActiveGame('bubbles')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
            activeGame === 'bubbles' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Circle className="w-5 h-5" />
          Bubble Pop
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[500px] flex flex-col items-center justify-center">
          {activeGame === 'breathing' ? <BreathingExercise /> : <BubblePop />}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Why play?
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Short, mindful breaks can significantly reduce cortisol levels and improve your overall mood and productivity throughout the day.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm font-medium">Resets your nervous system</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium">Improves hand-eye coordination</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
            <h4 className="font-bold text-emerald-900 mb-2">Pro Tip</h4>
            <p className="text-sm text-emerald-700">
              Try the breathing exercise for at least 2 minutes when you feel overwhelmed. It's a scientifically proven way to calm down quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
