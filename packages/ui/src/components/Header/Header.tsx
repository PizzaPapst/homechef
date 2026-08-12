import React from 'react';

export interface HeaderProps {
  variant?: 'default' | 'quiet';
  children?: React.ReactNode;
  className?: string;
}

export const Header = ({ variant = 'default', children, className = '' }: HeaderProps) => {
  const baseStyles = 'w-full px-16 pb-16 pt-0 flex gap-8';

  const variants = {
    default: 'bg-background-surface-elevated border-b-1 border-header-color-border-default',
    quiet: 'bg-transparent'
  };

  return (
    <header className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </header>
  );
};
