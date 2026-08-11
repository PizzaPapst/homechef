import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-round px-12 py-4 text-12 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-turquoise-500 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "bg-turquoise-600 text-white",
                brand: "bg-turquoise-600 text-white",
                glass: "bg-white/90 text-content-text-default",
                outline: "border border-scooty-gray-200 text-content-text-label bg-transparent",
                secondary: "bg-scooty-gray-100 text-content-text-label",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({
    className,
    variant,
    ...props
}: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
