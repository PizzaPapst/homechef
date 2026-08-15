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
    'bg-icon-button-primary-background-default hover:bg-icon-button-primary-background-hover active:bg-icon-button-primary-background-pressed focus-visible:bg-icon-button-primary-background-focused disabled:bg-icon-button-primary-background-disabled text-icon-button-primary-content-default disabled:text-icon-button-primary-content-disabled border border-transparent rounded-full p-16',
  secondary:
    'bg-icon-button-secondary-background-default hover:bg-icon-button-secondary-background-hover active:bg-icon-button-secondary-background-pressed focus-visible:bg-icon-button-secondary-background-focused disabled:bg-icon-button-secondary-background-disabled text-icon-button-secondary-content-default disabled:text-icon-button-secondary-content-disabled border border-icon-button-secondary-border-default disabled:border-icon-button-secondary-border-disabled rounded-full p-16',
  tertiary:
    'bg-icon-button-tertiary-background-default hover:bg-icon-button-tertiary-background-hover active:bg-icon-button-tertiary-background-pressed focus-visible:bg-icon-button-tertiary-background-focused disabled:bg-icon-button-tertiary-background-disabled text-icon-button-tertiary-content-default disabled:text-icon-button-tertiary-content-disabled border border-transparent rounded-full p-16',
  'tertiary-inverted':
    'bg-icon-button-tertiary-inverted-background-default hover:bg-icon-button-tertiary-inverted-background-hover active:bg-icon-button-tertiary-inverted-background-pressed focus-visible:bg-icon-button-tertiary-inverted-background-focused disabled:bg-icon-button-tertiary-inverted-background-disabled text-icon-button-tertiary-inverted-content-default border border-transparent rounded-full p-16',
  'tertiary-destructive':
    'bg-icon-button-tertiary-destructive-background-default hover:bg-icon-button-tertiary-destructive-background-hover active:bg-icon-button-tertiary-destructive-background-pressed focus-visible:bg-icon-button-tertiary-destructive-background-focused disabled:bg-icon-button-tertiary-destructive-background-disabled text-icon-button-tertiary-destructive-content-default disabled:text-icon-button-tertiary-destructive-content-disabled border border-transparent rounded-full p-16',
  'primary-subtle':
    'bg-icon-button-primary-subtle-background-default hover:bg-icon-button-primary-subtle-background-hover active:bg-icon-button-primary-subtle-background-pressed focus-visible:bg-icon-button-primary-subtle-background-focused disabled:bg-icon-button-primary-subtle-background-disabled text-icon-button-primary-subtle-content-default hover:text-icon-button-primary-subtle-content-hover active:text-icon-button-primary-subtle-content-pressed disabled:text-icon-button-primary-subtle-content-disabled border border-transparent rounded-8 px-0 py-4',
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
  const baseClasses = `group inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquoise-600 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`;

  const content = (
    <span className="flex items-center justify-center w-16 h-16 [&>svg]:w-16 [&>svg]:h-16">
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

