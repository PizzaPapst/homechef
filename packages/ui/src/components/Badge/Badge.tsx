export type BadgeVariant = 'default' | 'brand' | 'glass' | 'secondary';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = ({ label, variant = 'default', className = '' }: BadgeProps) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-white/30 backdrop-blur-md text-white',
    brand: 'bg-turquoise-600 text-white',
    glass: 'bg-white/30 backdrop-blur-md text-white',
    secondary: 'bg-scooty-gray-100 text-content-text-default',
  };

  return (
    <span
      className={`px-8 py-2 text-12 font-medium rounded-full inline-flex items-center justify-center ${variantStyles[variant]} ${className}`}
    >
      {label}
    </span>
  );
};
