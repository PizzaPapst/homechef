import * as React from "react"
import { MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from '../../lib/utils'
import { useNavigate } from 'react-router-dom'

interface SearchbarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  filterCount?: number
  icon?: React.ComponentType<{ size: number; weight?: string; className?: string }>
  variant?: 'default' | 'button' | 'minimal'
}

const Searchbar = React.forwardRef<HTMLInputElement, SearchbarProps>(({
    placeholder,
    className,
    value,
    filterCount = 0,
    icon: Icon = MagnifyingGlass,
    variant = 'default',
    ...props
}, ref) => {

    const navigate = useNavigate();

    if (variant === "button") {
        return (
            <button
                className={cn(
                    "flex gap-8 w-full min-h-48 items-center px-24 bg-white border border-scooty-gray-200 rounded-full",
                    className
                )}
                onClick={(props.onClick as React.MouseEventHandler<HTMLButtonElement>) || (() => navigate("/search"))}
            >

                <MagnifyingGlass size={20} weight="bold" className="text-content-text-additional shrink-0" />

                <span className={cn(
                    "text-16 font-normal truncate flex-1 text-left",
                    (value && String(value).trim() !== "") ? "text-content-text-default" : "text-content-text-additional"
                )}>
                    {value || placeholder || "Leere Suche"}
                </span>

                {filterCount > 0 && (
                    <span className="text-content-text-additional text-14 font-medium shrink-0">+{filterCount}</span>
                )}
            </button>
        )
    }

    return (
        <div className={cn(
            "flex items-center w-full min-h-48 px-24 bg-white border border-scooty-gray-200 rounded-full",
            className
        )}>
            <Icon size={20} weight="bold" className="text-content-text-additional shrink-0 mr-8" />
            <input
                ref={ref}
                type="text"
                value={value}
                placeholder={placeholder}
                className="flex-1 bg-transparent border-none outline-none text-content-text-default placeholder:text-content-text-additional/60 text-16 py-12"
                {...props}
            />
        </div>
    )
})

export default Searchbar
