import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[56px] w-full rounded-md border border-scooty-gray-200 bg-transparent px-12 py-8 text-16 shadow-sm placeholder:text-content-text-additional focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-turquoise-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
