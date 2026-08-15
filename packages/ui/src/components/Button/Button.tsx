import type React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  label: string;
  /** Zeigt einen Lade-Spinner und deaktiviert den Button */
  isLoading?: boolean;
  /** Optionales Icon neben dem Text */
  icon?: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  label,
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center gap-8 p-16 rounded-8 font-medium transition-all focus-visible:outline-none disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-b from-button-primary-background-default-start to-button-primary-background-default-end text-button-primary-content-default hover:from-button-primary-background-hover-start hover:to-button-primary-background-hover-end active:from-button-primary-background-pressed-start active:to-button-primary-background-pressed-end disabled:from-button-primary-background-disabled disabled:to-button-primary-background-disabled disabled:text-button-primary-content-disabled',
    secondary: 'bg-background-action-secondary-default text-content-text-default hover:bg-background-action-secondary-hover active:bg-background-action-secondary-pressed disabled:bg-scooty-gray-100 disabled:text-content-text-disabled border border-border-action-secondary-default disabled:border-border-action-secondary-disabled'
  };

  return (
    <button 
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>{label}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};