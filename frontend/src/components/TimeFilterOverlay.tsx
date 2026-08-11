import { Pill } from "./ui/Pill";

interface TimeFilterOverlayProps {
    selectedTime: number | null
    onSelect: (value: number | null) => void
}

const timeOptions = [
    { label: "Alle", value: null },
    { label: "Bis 15 min", value: 15 },
    { label: "Bis 30 min", value: 30 },
    { label: "Bis 45 min", value: 45 },
    { label: "Über 45 min", value: 46 },
];

const TimeFilterOverlay = ({ selectedTime, onSelect }: TimeFilterOverlayProps) => {
    return (
        <div className="flex flex-col gap-24">
            <button
                onClick={() => onSelect(null)}
                className="text-turquoise-600 font-semibold text-14 self-start hover:underline"
            >
                Filter zurücksetzen
            </button>
            <div className="flex flex-wrap gap-12">
                {timeOptions.map((option) => (
                    <Pill
                        key={option.label}
                        icon={false}
                        active={selectedTime === option.value}
                        onClick={() => onSelect(option.value)}
                    >
                        {option.label}
                    </Pill>
                ))}
            </div>
        </div>
    );
};

export default TimeFilterOverlay;
