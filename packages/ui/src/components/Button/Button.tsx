import type React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  label: string;
}

export const Button = ({ variant = 'primary', label, className = '', ...props }: ButtonProps) => {
  // 1. Layout & Typografie (nutzt deine spacing, borderRadius, fontSize und fontWeight Tokens)
  const baseStyles = 'p-16 rounded-8 bg-gradient-to-b';
  
  // 2. Das Semantic- & Component-Color Mapping
  const variants = {
    // Nutzt deine extrem spezifischen Component-Tokens für den primären Button
    primary: 'from-button-primary-background-default-start to-button-primary-background-default-end text-button-primary-content-default hover:from-button-primary-background-hover-start hover:to-button-primary-background-hover-end',
    
    // Nutzt deine globalen Action-Tokens als Fallback für den sekundären Button
    secondary: 'bg-background-action-secondary-default text-content-text-default hover:bg-background-action-secondary-hover'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};