import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CaretDown } from "@phosphor-icons/react";

const pillVariants = cva(
    "flex items-center gap-8 px-24 py-8 text-content-text-default text-14 min-h-48 whitespace-nowrap transition-colors bg-white border border-scooty-gray-200",
    {
        variants: {
            variant: {
                default: "rounded-sm",
                rounded: "rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof pillVariants> {
  icon?: boolean
  active?: boolean
}

const Pill = ({ children, icon = true, className, variant, onClick, active, ...props }: PillProps) => {
    return (
        <button
            className={cn(
                pillVariants({ variant, className }),
                active && "bg-turquoise-600 text-content-text-inverted"
            )}
            onClick={onClick}
            {...props}
        >
            {children}
            {icon && <CaretDown size={16} />}
        </button>
    );
};

export { Pill, pillVariants };
