import type React from 'react';

export interface ActionTileProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variables Icon (z. B. beliebiges Lucide-Icon oder ReactNode) */
  icon?: React.ReactNode;
  /** Beschriftung unter dem Icon */
  label: string;
  /** Optionaler Link-Renderer für Router-Navigation (z. B. react-router-dom Link) */
  renderLink?: (props: { children: React.ReactNode; className?: string }) => React.ReactNode;
}

export const ActionTile: React.FC<ActionTileProps> = ({
  icon,
  label,
  className = '',
  disabled,
  renderLink,
  type = 'button',
  ...props
}) => {
  const baseClasses = `group inline-flex flex-col items-center justify-center p-16 gap-4 rounded-8 border border-transparent bg-action-tile-background-default hover:bg-action-tile-background-hover active:bg-action-tile-background-pressed focus-visible:outline-none focus-visible:border-2 focus-visible:border-turquoise-600 disabled:bg-action-tile-background-disabled disabled:cursor-not-allowed transition-colors text-center ${className}`;

  const content = (
    <>
      {icon && (
        <span className="text-action-tile-icon-default group-disabled:text-action-tile-icon-disabled flex items-center justify-center">
          {icon}
        </span>
      )}
      <span className="typography-body-small text-action-tile-text-default group-disabled:text-action-tile-text-disabled">
        {label}
      </span>
    </>
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

