import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-8 whitespace-nowrap rounded-full text-14 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-turquoise-500 disabled:pointer-events-none disabled:opacity-50 h-48 px-24",
  {
    variants: {
      variant: {
        primary:
          "bg-background-action-primary-default text-content-text-inverted shadow-sm hover:bg-background-action-primary-hover border-none",
        default:
          "bg-white text-content-text-default border border-scooty-gray-200 shadow-sm hover:bg-scooty-gray-50",
        ghost:
          "bg-transparent text-content-text-default hover:bg-scooty-gray-50 border-none",
        destructive:
          "bg-transparent text-bold-red-500 hover:bg-bold-red-50 border-none font-semibold",
        fab: "",
      },
      size: {
        default: "h-48 px-24",
        sm: "h-40 px-16",
        icon: "h-48 w-48 px-0",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "default" | "ghost" | "destructive" | "fab"
  size?: "default" | "sm" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
