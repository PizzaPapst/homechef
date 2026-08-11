import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface FlyoutMenuItem {
    label: string
    onClick?: () => void
    className?: string
}

interface FlyoutMenuProps {
    trigger: React.ReactNode
    items: FlyoutMenuItem[]
    className?: string
}

export function FlyoutMenu({ trigger, items, className }: FlyoutMenuProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent
                align="end"
                sideOffset={8}
                className={cn(
                    "w-48 p-4 bg-white border-0 rounded-8 shadow-lg animate-in fade-in zoom-in-95 duration-100",
                    className
                )}
            >
                <div className="flex flex-col">
                    {items.map((item: FlyoutMenuItem, index: number) => (
                        <button
                            key={index}
                            onClick={item.onClick}
                            className={cn(
                                "flex w-full items-center px-16 h-[56px] text-14 font-medium transition-colors hover:bg-scooty-gray-50 text-left first:rounded-t-8 last:rounded-b-8",
                                item.className
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
