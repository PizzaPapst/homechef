import type React from 'react';

export interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optionales Label über dem Eingabefeld */
  label?: string;
  /** Fehlermeldung oder Boolean für Fehlerzustand */
  error?: string | boolean;
  /** Zusätzliche CSS-Klassen für den äußeren Container */
  containerClassName?: string;
}

export const InputText: React.FC<InputTextProps> = ({
  label,
  error,
  className = '',
  containerClassName = '',
  disabled,
  readOnly,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const hasError = Boolean(error);

  const baseInputClasses = `w-full px-16 py-16 rounded-8 typography-body-medium text-input-content-default placeholder:text-input-content-placeholder transition-colors outline-none ${
    readOnly
      ? 'bg-input-read-only-background-default border border-input-border-default'
      : disabled
      ? 'bg-input-background-disabled text-input-content-disabled border border-input-border-disabled cursor-not-allowed'
      : hasError
      ? 'bg-input-background-default border-2 border-input-border-error text-input-content-error focus:border-input-border-error'
      : 'bg-input-background-default hover:bg-input-background-hover border border-input-border-default hover:border-scooty-gray-400 focus:border-2 focus:border-input-border-focused'
  } ${className}`;

  return (
    <div className={`flex flex-col gap-8 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="typography-body-small text-content-text-label"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        disabled={disabled}
        readOnly={readOnly}
        className={baseInputClasses}
        {...props}
      />
      {typeof error === 'string' && error.length > 0 && (
        <span className="typography-body-small text-input-content-error">
          {error}
        </span>
      )}
    </div>
  );
};

