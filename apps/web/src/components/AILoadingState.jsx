
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

const AILoadingState = ({ message = "AI is working its magic...", estimatedTime = 15 }) => {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(estimatedTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + (100 / (estimatedTime * 10)); // Update every 100ms
      });
    }, 100);

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [estimatedTime]);

  return (
    <div className="w-full py-16 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center relative overflow-hidden"
      >
        {/* Background animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#8A6CFF]/5 via-[#D6FF3F]/5 to-[#8A6CFF]/5 animate-pulse" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto bg-[#111111] rounded-2xl flex items-center justify-center mb-6 shadow-lg relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-2xl border-2 border-dashed border-[#8A6CFF]/30"
            />
            <Sparkles className="w-10 h-10 text-[#D6FF3F] animate-pulse" />
          </div>
          
          <h3 className="text-xl font-extrabold text-[#111111] mb-2">{message}</h3>
          <p className="text-gray-500 text-sm mb-8">Analyzing market trends and generating optimal results.</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#8A6CFF]">{Math.round(progress)}% Complete</span>
              <span className="text-gray-400">~{timeLeft}s remaining</span>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#8A6CFF] to-[#D6FF3F]"
                style={{ width: `${progress}%` }}
                layout
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skeleton Grid Preview */}
      <div className="w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-40 pointer-events-none">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-64 flex flex-col">
            <div className="flex justify-between mb-4">
              <div className="w-24 h-6 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-16 h-6 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <div className="w-3/4 h-6 bg-gray-200 rounded-lg mb-3 animate-pulse" />
            <div className="w-full h-4 bg-gray-100 rounded-lg mb-2 animate-pulse" />
            <div className="w-5/6 h-4 bg-gray-100 rounded-lg mb-6 animate-pulse" />
            <div className="mt-auto space-y-3">
              <div className="w-full h-2 bg-gray-100 rounded-full animate-pulse" />
              <div className="w-full h-2 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AILoadingState;
