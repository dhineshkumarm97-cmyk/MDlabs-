import { useEffect } from 'react';
import { motion } from 'motion/react';

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 12000); // Exact 12 seconds as requested

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[75vh] flex flex-col justify-center items-center py-12 px-6">
      <div className="flex flex-col items-center justify-center text-center max-w-lg p-10 bg-white border border-slate-100 rounded-3xl shadow-xl w-full py-20 relative overflow-hidden">
        {/* Dynamic centered layout for the branding animation */}
        <div className="flex items-center justify-center font-black tracking-tight text-5xl sm:text-6xl select-none font-sans">
          {/* MD falls down and stops in the center */}
          <motion.span
            initial={{ y: -450, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 90, 
              damping: 14,
              duration: 1.2,
              delay: 0.2
            }}
            className="text-indigo-600 font-extrabold drop-shadow-sm"
          >
            MD
          </motion.span>
          
          {/* labs comes from the right and stops next to MD */}
          <motion.span
            initial={{ x: 450, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 70, 
              damping: 15,
              duration: 1.5,
              delay: 0.8
            }}
            className="text-amber-500 font-bold ml-2 drop-shadow-sm"
          >
            labs
          </motion.span>
        </div>
      </div>
    </div>
  );
}
