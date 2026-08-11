import * as React from "react"
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Heart,
  Timer,
  CaretRight,
  Plus
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge.jsx";

interface RecipeCategory {
  id: string | number
  name: string
}

interface Recipe {
  id?: string | number
  title?: string
  imageUrl?: string
  prepTime?: string | number
  calories?: number
  isNew?: boolean
  categories?: RecipeCategory[]
  ingredients?: Array<{ name: string; amount?: number; unit?: string }>
  instructions?: Array<{ text: string }>
  servings?: number
  [key: string]: unknown
}

interface RecipeCardProps {
  recipe: Recipe
  variant?: 'large' | 'small' | 'list' | 'outline'
  isFavorite?: boolean
  onFavoriteClick?: () => void
  onClick?: () => void
  className?: string
}

const RecipeCard = ({
  recipe,
  variant = 'small',
  isFavorite = false,
  onFavoriteClick,
  onClick,
  className
}: RecipeCardProps) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const getRecipeImage = () => {
    if (recipe?.imageUrl && (recipe.imageUrl.startsWith('http') || recipe.imageUrl.startsWith('blob'))) {
      return recipe.imageUrl;
    }

    if (recipe?.id && apiUrl) {
      return `${apiUrl}/recipes/${recipe.id}/image`;
    }

    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";
  };

  const image = getRecipeImage();
  const title = recipe?.title || "Rezept Titel";
  const time = recipe?.prepTime || "25";

  const CardWrapper = ({ children, className: wrapperClass }: { children: React.ReactNode; className?: string }) => {
    if (onClick) {
      return (
        <div
          onClick={onClick}
          className={cn("cursor-pointer active:scale-[0.98] transition-all", wrapperClass)}
        >
          {children}
        </div>
      );
    }
    return (
      <Link
        to={`/recipe/${recipe?.id || 'placeholder'}`}
        className={cn("block", wrapperClass)}
      >
        {children}
      </Link>
    );
  };

  // --- LARGE CARD (Featured) ---
  if (variant === 'large') {
    return (
      <CardWrapper className={cn("relative w-full h-[240px] rounded-16 overflow-hidden group shadow-card-shadow", className)}>
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute inset-0 p-16 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex gap-8">
              {recipe?.isNew && (
                <Badge variant="brand">Neu</Badge>
              )}
              {recipe?.categories?.map((cat) => (
                <Badge key={cat.id} variant="glass">{cat.name}</Badge>
              ))}
            </div>

            <div className="flex gap-8">
              <button
                onClick={(e) => { e.preventDefault(); onFavoriteClick?.(); }}
                className="bg-white/90 p-8 rounded-full transition-colors hover:bg-white active:scale-90"
              >
                <Heart
                  size={20}
                  weight={isFavorite ? "fill" : "regular"}
                  className={isFavorite ? "text-turquoise-600" : "text-content-text-default"}
                />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-white text-22 font-bold leading-tight line-clamp-2 mb-4">
              {title}
            </h3>
            <div className="flex items-center gap-4 text-white/90">
              <Timer size={18} weight="bold" className="text-white" />
              <span className="text-14">{time} Min.</span>
            </div>
          </div>
        </div>
      </CardWrapper>
    );
  }

  // --- SMALL CARD (Horizontal) ---
  if (variant === 'small') {
    return (
      <div className={cn("w-[160px] flex-shrink-0", className)}>
        <CardWrapper className="relative">
          <div className="h-[140px] rounded-12 overflow-hidden relative mb-8">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <button
              onClick={(e) => { e.preventDefault(); onFavoriteClick?.(); }}
              className="absolute top-8 right-8 bg-white/90 p-4 rounded-full transition-colors hover:bg-white"
            >
              <Heart
                size={16}
                weight={isFavorite ? "fill" : "regular"}
                className={isFavorite ? "text-turquoise-600" : "text-content-text-default"}
              />
            </button>

            <div className="absolute bottom-8 left-8 flex items-center gap-4 text-white/90 ">
              <Timer size={18} weight="bold" className="text-white" />
              <span className="text-14">{time} Min.</span>
            </div>
          </div>

          <h3 className="text-14 font-semibold text-content-text-default line-clamp-2 leading-tight">
            {title}
          </h3>
        </CardWrapper>
      </div>
    );
  }

  // --- LIST CARD (Medium) ---
  if (variant === 'list') {
    return (
      <CardWrapper className={cn("w-full h-[82px] rounded-8 bg-white border border-scooty-gray-200 shadow-card-shadow overflow-hidden flex", className)}>
        <div className="w-[110px] h-full flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-12 flex flex-col justify-center gap-4 overflow-hidden">
          <div className="flex justify-between items-start gap-8">
            <h3 className="text-16 font-bold text-content-text-default truncate w-full">
              {title}
            </h3>
            <button
              onClick={(e) => { e.preventDefault(); onFavoriteClick?.(); }}
              className="text-content-text-default"
            >
              <Heart
                size={20}
                weight={isFavorite ? "fill" : "regular"}
                className={isFavorite ? "text-turquoise-600" : "text-content-text-default"}
              />
            </button>
          </div>
          <div className="flex items-center gap-8 mt-auto">
            <div className="flex items-center gap-4 text-content-text-additional">
              <Timer size={14} weight="fill" />
              <span className="text-12">{time} Min.</span>
            </div>
            {recipe?.categories?.slice(0, 1).map((cat) => (
              <Badge key={cat.id} variant="secondary" className="px-8 py-0.5 h-auto text-[10px] rounded-4">
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardWrapper>
    );
  }

  // --- OUTLINE CARD (Placeholder) ---
  if (variant === 'outline') {
    return (
      <div
        onClick={onClick}
        className={cn(
          "w-full aspect-[16/9] md:aspect-auto md:h-[200px] border-2 border-dashed border-scooty-gray-200 rounded-16 flex flex-col items-center justify-center gap-16 cursor-pointer hover:bg-scooty-gray-50 transition-colors",
          className
        )}
      >
        <div className="w-48 h-48 rounded-full border border-scooty-gray-200 flex items-center justify-center bg-white shadow-sm">
          <Plus size={24} className="text-content-text-default" />
        </div>
        <span className="text-content-text-label text-18">Rezept auswählen</span>
      </div>
    );
  }

  return null;
};

// Section Header Helper Component
interface RecipeSectionHeaderProps {
  title: string
  showAll?: boolean
  onShowAll?: () => void
  className?: string
}

export const RecipeSectionHeader = ({ title, showAll = true, onShowAll, className }: RecipeSectionHeaderProps) => {
  return (
    <div className={cn("flex justify-between items-center min-h-48", className)}>
      <h2 className={cn(
        "font-semibold text-content-text-default text-22"
      )}>
        {title}
      </h2>
      {showAll && (
        <button
          onClick={onShowAll}
          className="flex items-center justify-end gap-4 text-14 font-medium text-turquoise-600 min-h-48 min-w-48"
        >
          Alle
          <CaretRight size={16} weight="bold" />
        </button>
      )}
    </div>
  );
};

export { RecipeCard };
