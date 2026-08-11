import { Pill } from "./ui/Pill";

interface CalorieFilterOverlayProps {
    selectedCalories: number | null
    onSelect: (value: number | null) => void
}

const calorieOptions = [
    { label: "Alle", value: null },
    { label: "Bis 400 kcal", value: 400 },
    { label: "Bis 600 kcal", value: 600 },
    { label: "Bis 800 kcal", value: 800 },
    { label: "Über 800 kcal", value: 801 },
];

const CalorieFilterOverlay = ({ selectedCalories, onSelect }: CalorieFilterOverlayProps) => {
    return (
        <div className="flex flex-col gap-24">
            <button
                onClick={() => onSelect(null)}
                className="text-turquoise-600 font-semibold text-14 self-start hover:underline"
            >
                Filter zurücksetzen
            </button>
            <div className="flex flex-wrap gap-12">
                {calorieOptions.map((option) => (
                    <Pill
                        key={option.label}
                        icon={false}
                        active={selectedCalories === option.value}
                        onClick={() => onSelect(option.value)}
                    >
                        {option.label}
                    </Pill>
                ))}
            </div>
        </div>
    );
};

export default CalorieFilterOverlay;
