import { RecipeCard } from "@homechef/ui";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Searchbar from "../components/ui/Searchbar";
import { fetchAllRecipes } from "@/services/api";
import { Header } from '@homechef/ui';

type RecipeAny = Record<string, any>;

export default function Cookbook() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeAny[]>([]);
  useEffect(() => {
    fetchAllRecipes().then(data => setRecipes(data as RecipeAny[]));
  }, []);

  return (
    <div className="flex flex-col h-full bg-scooty-gray-50 pb-80 overflow-hidden">
      {/* Header */}
      <Header>
        <h1 className="typography-heading-medium text-content-text-default">Rezepte</h1>
      </Header>

      {/* Scrollable Content */}
      <div className="flex flex-col gap-32 flex-1 overflow-y-auto no-scrollbar p-16 overscroll-contain">
        <Searchbar variant="button" placeholder="Rezept suchen" />
        {/* Featured Section */}
        <section className="flex-shrink-0 flex flex-col gap-8">
          <h2 className="typography-heading-medium text-content-text-default">Vorschlag des Tages</h2>
          {recipes.length > 0 ? (
            <RecipeCard
              size="large"
              recipe={recipes[0]}
            />
          ) : (
            <div className="h-[240px] w-full bg-scooty-gray-100 rounded-16 animate-pulse" />
          )}
        </section>
      </div>

      {/* Floating Action Button */}
      <Button
        variant="fab"
        size="icon"
        className="fixed bottom-80 right-16 h-64 w-64 rounded-full z-50 text-content-text-inverted bg-turquoise-600 border-none shadow-fab-shadow"
        onClick={() => navigate("/recipe/create")}
      >
        <Plus size={24} weight="bold" />
      </Button>
    </div>
  );
}
