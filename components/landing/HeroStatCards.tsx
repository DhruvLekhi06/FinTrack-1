import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { TrendingUp, Wallet } from 'lucide-react';

const StatCard: React.FC<HTMLMotionProps<'div'>> = ({ children, className, style, ...motionProps }) => (
    <motion.div
        className={`absolute rounded-xl glass-card p-4 shadow-2xl shadow-black/50 ${className}`}
        style={style}
        {...motionProps}
    >
        {children}
    </motion.div>
);

const HeroStatCards: React.FC = () => {
  const commonTransition = {
    duration: 15,
    repeat: Infinity,
    repeatType: 'mirror',
    ease: 'easeInOut',
  } as const;

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
      <StatCard
        className="w-48 h-28 top-[20%] left-[10%]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: [0, -15, 0] }}
        transition={{ delay: 0.2, ...commonTransition }}
      >
        <div className="flex items-center text-gray-400 text-sm mb-2 font-sans">
            <Wallet className="h-4 w-4 mr-2" />
            Balance
        </div>
        <p className="text-3xl font-bold text-white">₹1.4L</p>
      </StatCard>
      
      <StatCard
        className="w-56 h-32 top-[40%] right-[8%]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: [0, 20, 0] }}
        transition={{ delay: 0.4, ...commonTransition, duration: 18 }}
      >
         <div className="flex items-center text-gray-400 text-sm mb-2 font-sans">
            <TrendingUp className="h-4 w-4 mr-2" />
            Growth
        </div>
        <p className="text-4xl font-bold text-[var(--accent-positive)]">+12.5%</p>
      </StatCard>

       <StatCard
        className="w-52 h-28 bottom-[15%] left-[25%]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 0.6, ...commonTransition, duration: 20 }}
      >
         <p className="text-gray-400 text-sm mb-2 font-sans">Savings Rate</p>
         <p className="text-4xl font-bold text-white">22%</p>
      </StatCard>
    </div>
  );
};

export default HeroStatCards;