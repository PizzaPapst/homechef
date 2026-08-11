import React from 'react';

export interface ActionTileProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
}

export const ActionTile = ({ icon, label, className = '', ...props }: ActionTileProps) => {
  return (
    <button className={className} {...props}>
      {icon}
      <span>{label}</span>
    </button>
  );
};
