import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface LabelValueGroupProps {
  label?: string
  children: React.ReactNode
  className?: string
}

export function LabelValueGroup({ label, children, className }: LabelValueGroupProps) {
  return (
    <div className={cn("flex flex-col gap-[2px]", className)}>
      {label && (
        <Label className="text-14 font-medium text-content-text-label">
          {label}
        </Label>
      )}
      {children}
    </div>
  )
}
