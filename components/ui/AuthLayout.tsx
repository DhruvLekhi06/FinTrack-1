import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  headline: React.ReactNode;
  subheadline: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, headline, subheadline }) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center h-screen text-center px-4 sm:px-6 lg:px-8 z-10">
      
      {/* Container for background elements like floating cards */}
      <div className="absolute inset-0 z-0">
        {/* Mockups/stat cards will be rendered here by the parent */}
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-4xl" // Increased max-width for bigger headline
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-[var(--text-primary)] tracking-tighter leading-tight mb-6">
            {headline}
        </h1>
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto font-light" style={{fontWeight: 400}}>
            {subheadline}
        </p>
        
        <div className="text-center">
           {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;