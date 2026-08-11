import { Pill } from "./ui/Pill";

interface CategoryFilterOverlayProps {
    selectedCategory: string | null
    onSelect: (value: string | null) => void
}

const categoryOptions = [
    { label: "Vegetarisch", value: "vegetarian" },
    { label: "High Protein", value: "high-protein" },
];

const CategoryFilterOverlay = ({ selectedCategory, onSelect }: CategoryFilterOverlayProps) => {
    return (
        <div className="flex flex-col gap-6">
            <button
                onClick={() => onSelect(null)}
                className="text-brand-teal font-semibold text-sm self-start hover:underline"
            >
                Filter zurücksetzen
            </button>
            <div className="flex flex-wrap gap-3">
                {categoryOptions.map((option) => (
                    <Pill
                        key={option.value}
                        variant="rounded"
                        icon={false}
                        active={selectedCategory === option.value}
                        onClick={() => onSelect(option.value === selectedCategory ? null : option.value)}
                    >
                        {option.label}
                    </Pill>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilterOverlay;
