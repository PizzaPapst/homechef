import React from 'react';

export interface BadgeProps {
  label: string;
  className?: string;
}

export const Badge = ({ label, className = '' }: BadgeProps) => {
  return <span className={className}>{label}</span>;
};
