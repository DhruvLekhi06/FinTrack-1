import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 
      focus:outline-none focus:border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
      bg-clip-padding 
      focus:[background-image:linear-gradient(theme(colors.dark.surface),theme(colors.dark.surface)),linear-gradient(to_right,var(--gradient-start),var(--gradient-end))]
      [background-origin:border-box]
      transition-all duration-300 shadow-inner ${className}`}
      {...props}
    />
  );
};

export default Input;