import * as React from "react"
import { NavLink } from "react-router-dom";
import { Book, CalendarBlank } from "@phosphor-icons/react";

interface NavItemProps {
  to: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>
  label: string
}

function NavItem({ to, icon: Icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-4 transition-all w-full ${isActive ? "text-turquoise-600" : "text-content-text-additional"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`px-16 py-4 rounded-full ${isActive ? "bg-turquoise-100" : "bg-transparent"
              }`}
          >
            <Icon
              size={24}
              weight={isActive ? "fill" : "regular"}
              className={isActive ? "text-turquoise-600" : "text-content-text-additional"}
            />
          </div>
          <span className={`text-12 ${isActive ? "font-semibold" : "font-medium"}`}>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export function MobileNavigation() {
  return (
    <nav className="fixed bottom-0 z-50 w-full bg-white border-t border-scooty-gray-200 px-24 pt-16 pb-[calc(1rem+env(safe-area-inset-bottom))] flex justify-between items-center">

      <NavItem
        to="/"
        icon={Book}
        label="Kochbuch"
      />

      <NavItem
        to="/plan"
        icon={CalendarBlank}
        label="Wochenplan"
      />

    </nav>
  );
}
