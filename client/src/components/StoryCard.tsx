import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StoryCardProps {
  children: ReactNode;
  gradient: string;
}

export function StoryCard({ children, gradient }: StoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative w-full h-full max-w-md aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 text-center ${gradient}`}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
      
      {/* Decorative noise/texture overlay could go here */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
    </motion.div>
  );
}
