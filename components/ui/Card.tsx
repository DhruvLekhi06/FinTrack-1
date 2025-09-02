import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[var(--surface-primary)]
        p-6 rounded-2xl border border-[var(--border-subtle)] 
        shadow-md shadow-[var(--shadow-color)] 
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:border-[var(--accent-primary)]/50 hover:-translate-y-1' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;