import type React from 'react';

export interface InputTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const InputTextarea = ({ label, className = '', ...props }: InputTextareaProps) => {
  return (
    <div className={className}>
      {label && <label>{label}</label>}
      <textarea {...props} />
    </div>
  );
};
