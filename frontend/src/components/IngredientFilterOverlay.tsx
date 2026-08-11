import { useMemo } from 'react';
import { Pill } from "./ui/Pill";

interface IngredientFilterOverlayProps {
    ingredients: string[]
    selectedIngredients: string[]
    onToggle: (ingredient: string) => void
    searchQuery: string
    onReset: () => void
}

const IngredientFilterOverlay = ({ ingredients, selectedIngredients, onToggle, searchQuery, onReset }: IngredientFilterOverlayProps) => {
    const filteredAndSortedIngredients = useMemo(() => {
        if (!ingredients) return [];
        let list = ingredients.filter((ing: string) =>
            ing.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const active = list.filter((ing: string) => selectedIngredients.includes(ing)).sort();
        const inactive = list.filter((ing: string) => !selectedIngredients.includes(ing)).sort();

        return [...active, ...inactive];
    }, [ingredients, selectedIngredients, searchQuery]);

    return (
        <div className="flex flex-col gap-24">
            {selectedIngredients.length > 0 && (
                <button
                    onClick={onReset}
                    className="text-turquoise-600 font-semibold text-14 self-start hover:underline"
                >
                    Auswahl zurücksetzen ({selectedIngredients.length})
                </button>
            )}
            <div className="flex flex-wrap gap-12">
                {filteredAndSortedIngredients.map((ingredient) => (
                    <Pill
                        key={ingredient}
                        variant="rounded"
                        icon={false}
                        active={selectedIngredients.includes(ingredient)}
                        onClick={() => onToggle(ingredient)}
                    >
                        {ingredient}
                    </Pill>
                ))}
                {filteredAndSortedIngredients.length === 0 && (
                    <p className="text-content-text-additional italic py-40 w-full text-center">Keine Zutaten gefunden.</p>
                )}
            </div>
        </div>
    );
};

export default IngredientFilterOverlay;
