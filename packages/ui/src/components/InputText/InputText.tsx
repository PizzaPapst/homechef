import type React from 'react';

export interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const InputText = ({ label, className = '', ...props }: InputTextProps) => {
  return (
    <div className={className}>
      {label && <label>{label}</label>}
      <input {...props} />
    </div>
  );
};
