import type React from 'react';

export type IconButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'tertiary-inverted'
  | 'tertiary-destructive'
  | 'primary-subtle';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variables Icon (Standardgröße 16px) */
  icon: React.ReactNode;
  /** Stilvariante des IconButtons gemäß Design System */
  variant?: IconButtonVariant;
  /** Optionaler Link-Renderer für Router-Navigation (z. B. react-router-dom Link) */
  renderLink?: (props: { children: React.ReactNode; className?: string }) => React.ReactNode;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-icon-button-primary-background-default-start to-icon-button-primary-background-default-end hover:from-icon-button-primary-background-hover-start hover:to-icon-button-primary-background-hover-end active:from-icon-button-primary-background-pressed-start active:to-icon-button-primary-background-pressed-end focus-visible:from-icon-button-primary-background-focused-start focus-visible:to-icon-button-primary-background-focused-end  text-icon-button-primary-content-default border border-transparent',
  secondary:
    'bg-icon-button-secondary-background-default hover:bg-icon-button-secondary-background-hover active:bg-icon-button-secondary-background-pressed focus-visible:bg-icon-button-secondary-background-focused text-icon-button-secondary-content-default border border-icon-button-secondary-border-default',
  tertiary:
    'bg-icon-button-tertiary-background-default hover:bg-icon-button-tertiary-background-hover active:bg-icon-button-tertiary-background-pressed focus-visible:bg-icon-button-tertiary-background-focused text-icon-button-tertiary-content-default border border-transparent',
  'tertiary-inverted':
    'bg-icon-button-tertiary-inverted-background-default hover:bg-icon-button-tertiary-inverted-background-hover active:bg-icon-button-tertiary-inverted-background-pressed focus-visible:bg-icon-button-tertiary-inverted-background-focused text-icon-button-tertiary-inverted-content-default border border-transparent',
  'tertiary-destructive':
    'bg-icon-button-tertiary-destructive-background-default hover:bg-icon-button-tertiary-destructive-background-hover active:bg-icon-button-tertiary-destructive-background-pressed focus-visible:bg-icon-button-tertiary-destructive-background-focused text-icon-button-tertiary-destructive-content-default border border-transparent',
  'primary-subtle':
    'bg-icon-button-primary-subtle-background-default hover:bg-icon-button-primary-subtle-background-hover active:bg-icon-button-primary-subtle-background-pressed focus-visible:bg-icon-button-primary-subtle-background-focused text-icon-button-primary-subtle-content-default hover:text-icon-button-primary-subtle-content-hover active:text-icon-button-primary-subtle-content-pressed border border-transparent',
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'secondary',
  className = '',
  disabled,
  renderLink,
  type = 'button',
  ...props
}) => {
  const baseClasses = `flex items-center justify-center rounded-full rounded-full p-16 
  
  focus-visible:ring-2 focus-visible:ring-color-border-feedback-information focus-visible:outline-none focus-visible:ring-offset-2 

  disabled:cursor-not-allowed disabled:bg-none disabled:bg-icon-button-background-disabled disabled:text-icon-button-content-disabled disabled:border-none ${variantStyles[variant]} ${className}`;

  const content = (
    <span>
      {icon}
    </span>
  );

  if (renderLink && !disabled) {
    return <>{renderLink({ children: content, className: baseClasses })}</>;
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={baseClasses}
      {...props}
    >
      {content}
    </button>
  );
};

