import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { RecipeCard } from "@homechef/ui";
import Header from "../components/ui/Header";
import { IconButton } from "../components/ui/IconButton";
import { fetchAllRecipes } from "@/services/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecipeAny = Record<string, any>;

const CATEGORY_CONFIG: Record<string, { title: string; filterFunc: (recipe: RecipeAny) => boolean }> = {
    "schnelle-rezepte": {
        title: "Schnelle Rezepte",
        filterFunc: (recipe) => recipe.prepTime && recipe.prepTime <= 30
    },
    "kalorienarm": {
        title: "Kalorienarm",
        filterFunc: (recipe) => recipe.calories && recipe.calories <= 600
    },
    "all": {
        title: "Alle Rezepte",
        filterFunc: () => true
    }
};

export default function CategoryPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<RecipeAny[]>([]);
    const [loading, setLoading] = useState(true);

    const config = CATEGORY_CONFIG[id || ""] || {
        title: "Kategorie",
        filterFunc: () => true
    };

    useEffect(() => {
        setLoading(true);
        fetchAllRecipes().then(data => {
            setRecipes(data as RecipeAny[]);
            setLoading(false);
        }).catch(err => {
            console.error('Error loading recipes:', err);
            setLoading(false);
        });
    }, [id]);

    const filteredRecipes = useMemo(() => {
        return recipes.filter(config.filterFunc);
    }, [recipes, config]);

    return (
        <div className="flex flex-col h-screen bg-scooty-gray-50">
            {/* Header */}
            <Header className="px-0">
                <div className="flex items-center">
                    <IconButton variant="ghost" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} weight="bold" />
                    </IconButton>
                    <h1 className="text-22 text-turquoise-600">{config.title}</h1>
                </div>
            </Header>

            {/* Results */}
            <div className="flex-1 p-16 overflow-y-auto no-scrollbar overscroll-contain">
                <div className="flex flex-col gap-16">
                    {!loading && filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                size="small"
                            />
                        ))
                    ) : !loading && (
                        <div className="flex flex-col items-center justify-center py-80 text-center">
                            <p className="text-content-text-additional italic">Keine Rezepte in dieser Kategorie gefunden.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
