import { IconButton } from "@/components/ui/IconButton";
import { Minus, Plus } from "@phosphor-icons/react";

interface PortionStepperProps {
  servings: number
  onUpdate: (value: number) => void
}

export function PortionStepper({ servings, onUpdate }: PortionStepperProps) {
  return (
    <div className="flex items-center justify-between bg-scooty-gray-100 pl-16 pr-8 py-8 rounded-8">
      <span className="flex">
        Für <span className="font-semibold w-[36px] flex justify-center">{servings}</span> Portionen
      </span>

      <div className="flex items-center">
        <IconButton
          variant="standalone"
          onClick={() => onUpdate(Math.max(1, servings - 1))}
          disabled={servings <= 1}
        >
          <Minus size={20} weight="bold" />
        </IconButton>

        <IconButton
          variant="standalone"
          onClick={() => onUpdate(servings + 1)}
        >
          <Plus size={20} weight="bold" />
        </IconButton>
      </div>
    </div>
  );
}
