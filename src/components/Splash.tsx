import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashProps {
  onComplete: () => void;
  key?: string;
}

export default function Splash({ onComplete }: SplashProps) {
  const [progress, setProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [petals, setPetals] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number; color: string; rotate: number; borderRadius: string }>>([]);

  useEffect(() => {
    // Generate petals once
    const colors = ['#e91e63', '#f48fb1', '#ff80ab', '#ff4081', '#f06292', '#ec407a'];
    const generatedPetals = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      size: 12 + Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: Math.random() * 360,
      borderRadius: Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%',
    }));
    setPetals(generatedPetals);

    // Progress bar loader
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    // Complete splash screen after 3.2 seconds
    const timeout = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 bg-[#1a0010] z-50 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated rings */}
      <div className="absolute rounded-full border border-pink-500/10 w-[300px] h-[300px] animate-ping opacity-60 pointer-events-none" style={{ animationDuration: '3s' }} />
      <div className="absolute rounded-full border border-pink-500/10 w-[500px] h-[500px] animate-ping opacity-40 pointer-events-none" style={{ animationDuration: '3.5s', animationDelay: '0.8s' }} />
      <div className="absolute rounded-full border border-pink-500/10 w-[700px] h-[700px] animate-ping opacity-20 pointer-events-none" style={{ animationDuration: '4s', animationDelay: '1.5s' }} />

      {/* Falling petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {petals.map((petal) => (
          <div
            key={petal.id}
            className="absolute animate-petal"
            style={{
              left: `${petal.left}%`,
              backgroundColor: petal.color,
              width: `${petal.size}px`,
              height: `${petal.size * 1.5}px`,
              animationDuration: `${petal.duration}s`,
              animationDelay: `${petal.delay}s`,
              transform: `rotate(${petal.rotate}deg)`,
              borderRadius: petal.borderRadius,
              top: '-30px',
            }}
          />
        ))}
      </div>

      {/* Main content wrap */}
      <div className="text-center z-10 px-4">
        {!imageError ? (
          <img
            src="https://uploads.onecompiler.io/44ctb3zb3/44n6hs2dn/Picsart_26-05-06_18-04-15-668.png"
            className="w-28 h-28 mx-auto rounded-full border-3 border-pink-500 shadow-[0_0_40px_rgba(233,30,99,0.5),0_0_80px_rgba(233,30,99,0.2)] animate-pulse"
            alt="Susbee Logo"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-pink-500 to-rose-900 flex items-center justify-center text-5xl border-3 border-white/30 shadow-[0_0_40px_rgba(233,30,99,0.5)]">
            💄
          </div>
        )}

        <h1 className="font-serif text-4xl sm:text-5xl font-black text-white mt-5 tracking-wider">
          Susbee Beauty
        </h1>
        <p className="font-sans text-xs sm:text-sm text-pink-500 tracking-[0.25em] uppercase mt-2">
          Studio & Training Center
        </p>

        {/* Progress bar */}
        <div className="w-56 h-[3px] bg-white/15 rounded-full mt-8 mx-auto overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="font-sans text-xs text-white/40 tracking-widest mt-4 animate-pulse">
          Loading your beauty experience...
        </p>
      </div>

      {/* Quick skip button for impatient users */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 text-xs text-white/30 hover:text-white/60 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-colors tracking-widest uppercase"
      >
        Skip Intro
      </button>
    </motion.div>
  );
}
