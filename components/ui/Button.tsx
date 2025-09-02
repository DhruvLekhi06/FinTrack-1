import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed transform-gpu';

  const variantStyles = {
    primary: 'text-white shadow-md shadow-[var(--accent-primary-glow)] hover:shadow-lg hover:shadow-[var(--accent-primary-glow)] hover:-translate-y-0.5 focus-visible:ring-[var(--accent-primary)] bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)]',
    secondary: 'bg-white/10 text-[var(--text-primary)] font-semibold hover:bg-white/20 focus-visible:ring-white/50 border border-white/20',
    danger: 'bg-[var(--accent-negative)]/10 border border-[var(--accent-negative)]/20 text-[var(--accent-negative)] hover:bg-[var(--accent-negative)]/20 hover:text-[var(--accent-negative)] focus-visible:ring-[var(--accent-negative)]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;