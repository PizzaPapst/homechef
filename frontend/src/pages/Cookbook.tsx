import { RecipeCard, Header, IconButton, BottomSheet, ActionTile } from "@homechef/ui";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Globe, Instagram, Video, FileText } from "lucide-react";
import { fetchAllRecipes } from "@/services/api";

type RecipeAny = Record<string, any>;

export default function Cookbook() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeAny[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  useEffect(() => {
    fetchAllRecipes().then((data) => setRecipes(data as RecipeAny[]));
  }, []);

  return (
    <div className="flex flex-col h-full bg-scooty-gray-50 overflow-hidden relative">
      {/* Header */}
      <Header variant="quiet" className="pt-safe">
        <h1 className="typography-heading-medium text-content-text-default">Rezepte</h1>
      </Header>

      {/* Scrollable Content */}
      <div className="flex flex-col gap-16 flex-1 overflow-y-auto no-scrollbar p-16 overscroll-contain">
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

      {/* Floating Action Button (16px Abstand zur Seite und Navigation) */}
      <div className="absolute right-16 bottom-16 z-30">
        <IconButton
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsBottomSheetOpen(true)}
          aria-label="Rezept hinzufügen"
          className="shadow-floating-header"
        />
      </div>

      {/* Bottom Sheet für Rezept-Import */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      >
        <div className="flex flex-col gap-16">
          <h2 className="typography-heading-medium text-content-text-default">
            Rezept importieren
          </h2>

          <div className="grid grid-cols-2 gap-12">
            <ActionTile
              icon={<Globe size={24} />}
              label="Websites"
              onClick={() => {
                setIsBottomSheetOpen(false);
                navigate("/import/website");
              }}
            />
            <ActionTile
              icon={<Instagram size={24} />}
              label="Instagram"
              disabled
            />
            <ActionTile
              icon={<Video size={24} />}
              label="TikTok"
              disabled
            />
            <ActionTile
              icon={<FileText size={24} />}
              label="Dokument"
              disabled
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

