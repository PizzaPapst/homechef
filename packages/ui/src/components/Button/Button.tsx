import type React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
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
  const baseStyles =
    `flex items-center justify-center gap-8 p-16 rounded-8 
    
     focus-visible:ring-2 focus-visible:ring-color-border-feedback-information focus-visible:outline-none focus-visible:ring-offset-2  
    
    disabled:bg-none disabled:text-button-color-content-disabled disabled:bg-button-color-background-disabled`;

  const variants = {
    primary:
      'bg-gradient-to-b from-button-primary-color-background-default-start to-button-primary-color-background-default-end text-button-primary-color-content-default hover:from-button-primary-color-background-hover-start hover:to-button-primary-color-background-hover-end active:from-button-primary-color-background-pressed-start active:to-button-primary-color-background-pressed-end focus-visible:from-button-primary-color-background-focused-start focus-visible:to-button-primary-color-background-focused-end border border-transparent',
    secondary:
      'bg-button-secondary-color-background-default hover:bg-button-secondary-color-background-hover active:bg-button-secondary-color-background-pressed focus-visible:bg-button-secondary-color-background-focused text-button-secondary-color-content-default border border-button-secondary-color-border-default disabled:border-button-secondary-color-border-disabled',
    tertiary:
      'bg-button-tertiary-color-background-default hover:bg-button-tertiary-color-background-hover active:bg-button-tertiary-color-background-pressed focus-visible:bg-button-tertiary-color-background-focused text-button-tertiary-color-content-default border border-transparent',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="shrink-0 animate-spin" size={20} />
          <span className="min-w-0 line-clamp-2">{label}</span>
        </>
      ) : (
        <>
          {icon}
          <span className="min-w-0 line-clamp-2">{label}</span>
        </>
      )}
    </button>
  );
};
