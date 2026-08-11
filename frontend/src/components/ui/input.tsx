import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  endAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, endAdornment, ...props }, ref) => {
  return (
    <div className={cn(
      "flex items-center w-full h-[56px] px-16 rounded-4 bg-white border border-scooty-gray-200 focus-within:ring-1 focus-within:ring-turquoise-500 transition-colors",
      className
    )}>
      <input
        type={type}
        className="flex-1 w-full h-full bg-transparent text-16 placeholder:text-content-text-additional focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        ref={ref}
        {...props}
      />
      {endAdornment && (
        <div className="flex flex-shrink-0 items-center justify-center text-content-text-additional">
          {endAdornment}
        </div>
      )}
    </div>
  );
})
Input.displayName = "Input"

export { Input }
