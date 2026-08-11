import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

export const IconButton = ({ icon, className = '', ...props }: IconButtonProps) => {
  return (
    <button className={className} {...props}>
      {icon}
    </button>
  );
};
