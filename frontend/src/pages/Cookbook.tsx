import { RecipeCard, Header } from "@homechef/ui";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Searchbar from "../components/ui/Searchbar";
import { fetchAllRecipes } from "@/services/api";

type RecipeAny = Record<string, any>;

export default function Cookbook() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeAny[]>([]);

  useEffect(() => {
    fetchAllRecipes().then((data) => setRecipes(data as RecipeAny[]));
  }, []);

  return (
    <div className="flex flex-col h-full bg-scooty-gray-50 pb-80 overflow-hidden">
      {/* Header */}
      <Header variant="quiet">
        <h1 className="typography-heading-medium text-content-text-default">Rezepte</h1>
      </Header>

      {/* Scrollable Content */}
      <div className="flex flex-col gap-16 flex-1 overflow-y-auto no-scrollbar p-16 overscroll-contain">
        <Searchbar variant="button" placeholder="Rezept suchen" />

        {/* 2er Grid mit RecipeCard (small) */}
        <div className="grid grid-cols-2 gap-16">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              size="small"
              renderLink={({ children, className }) => (
                <Link to={`/recipe/${recipe.id}`} className={className}>
                  {children}
                </Link>
              )}
            />
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        variant="fab"
        size="icon"
        className="fixed bottom-80 right-16 h-64 w-64 rounded-full z-50 text-content-text-inverted bg-turquoise-600 border-none shadow-fab-shadow"
        onClick={() => navigate("/recipe/create")}
      >
        <Plus size={24} />
      </Button>
    </div>
  );
}
