import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-blue-600 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-blue-500 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[30%] bg-blue-400 rounded-full blur-3xl opacity-50" />

      {/* Logo/Icon Animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-6 relative"
      >
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-900/20 z-10 relative">
          <Sparkles className="text-blue-600 w-12 h-12" />
        </div>
        
        {/* Simple ripple effect */}
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-white/30 rounded-3xl"
        />
      </motion.div>

      {/* Text Animation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center z-10"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-2">EZwash</h1>
        <p className="text-blue-100 text-sm font-medium tracking-wide">Laundry Made Simple</p>
      </motion.div>
    </div>
  );
};
