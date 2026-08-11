import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, type UIEvent } from "react";
import { Clock, Fire, ArrowLeft, DotsThreeVertical } from "@phosphor-icons/react";
import { PortionStepper } from "@/components/PortionStepper";
import IngredientEntry from "../components/IngredientEntry";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/IconButton";
import { FlyoutMenu } from "@/components/FlyoutMenu";
import { deleteRecipe, fetchRecipeById } from "@/services/api";
import Header from "../components/ui/Header";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecipeAny = Record<string, any>;

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<RecipeAny | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTitleInHeader, setShowTitleInHeader] = useState(false);
  const [currentServings, setCurrentServings] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchRecipeById(id!)
      .then(data => {
        if (data) {
          setRecipe(data as RecipeAny);
          setCurrentServings((data as RecipeAny).servings);
        } else {
          setError("Rezept wurde nicht gefunden.");
        }
      })
      .catch(err => {
        console.error("Fehler beim Laden:", err);
        setError("Ein Fehler ist beim Laden des Rezepts aufgetreten.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleScroll = (e: UIEvent<HTMLElement>) => {
    const scrollTop = (e.target as HTMLElement).scrollTop;
    setIsScrolled(scrollTop > 20);
    setShowTitleInHeader(scrollTop > 320);
  };

  if (loading) return <div className="p-32 text-center text-content-text-additional">Lädt...</div>;
  if (error) return (
    <div className="p-32 flex flex-col items-center gap-16">
      <p className="text-center text-bold-red-500 font-medium">{error}</p>
      <Button onClick={() => navigate("/")}>Zurück zum Kochbuch</Button>
    </div>
  );
  if (!recipe) return null;

  const image = recipe.imageUrl || "https://images.unsplash.com/photo-1543353071-087092ec393a?q=80&w=1000&auto=format&fit=crop";

  const handlePortionChange = (newAmount: number) => {
    if (newAmount >= 1) {
      setCurrentServings(newAmount);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Möchtest du dieses Rezept wirklich löschen?")) {
      try {
        await deleteRecipe(id!);
        navigate("/");
      } catch (error) {
        console.error("Fehler beim Löschen:", error);
        alert("Fehler beim Löschen des Rezepts.");
      }
    }
  };

  const menuItems = [
    {
      label: "Bearbeiten",
      onClick: () => navigate(`/recipes/${id}/edit`),
    },
    {
      label: "Löschen",
      onClick: handleDelete,
      className: "text-bold-red-500 hover:bg-bold-red-50",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden pb-80 relative">
      {/* Header with Actions */}
      <Header
        className={cn(
          "absolute top-0 left-0 right-0 z-50 justify-between transition-all duration-300",
          isScrolled ? "bg-white shadow-header-shadow" : "bg-transparent shadow-none"
        )}
      >
        <IconButton
          variant={isScrolled ? "ghost" : "floating"}
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={20} weight="bold" />
        </IconButton>

        <div className={cn(
          "flex-1 px-16 text-center transition-all duration-300",
          showTitleInHeader ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        )}>
          <h2 className="text-18 font-bold truncate max-w-[200px] mx-auto">
            {recipe.title}
          </h2>
        </div>

        <FlyoutMenu
          trigger={
            <IconButton variant={isScrolled ? "ghost" : "floating"}>
              <DotsThreeVertical size={24} weight="bold" />
            </IconButton>
          }
          items={menuItems}
        />
      </Header>

      <div
        className="flex-1 overflow-y-auto no-scrollbar overscroll-contain"
        onScroll={handleScroll}
      >
        {/* Hero Section */}
        <div className="flex flex-col gap-32">
          <div className="flex flex-col gap-16 w-full relative">
            <img
              src={image}
              alt={recipe.title}
              className="object-cover w-full aspect-[4/3]"
            />

            <div className="flex flex-col gap-16 w-full px-16">
              <h1 className="text-27 font-bold">{recipe.title}</h1>

              <div className="flex gap-16">
                <div className="flex items-center gap-4 text-content-text-additional">
                  <Clock size={20} />
                  <p className="text-14">{recipe.prepTime} Min.</p>
                </div>

                {recipe.calories > 0 && (
                  <div className="flex items-center gap-4 text-content-text-additional">
                    <Fire size={20} />
                    <p className="text-14">{recipe.calories} kcal</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-16 px-16">
            <h2 className="font-semibold text-18">Zutaten</h2>
            <PortionStepper
              servings={currentServings}
              onUpdate={handlePortionChange}
            />
            <div className='flex flex-col'>
              {recipe.ingredients && recipe.ingredients.map((ingredient: any, index: number) => (
                <IngredientEntry
                  key={index}
                  name={ingredient.name}
                  unit={ingredient.unit}
                  amount={ingredient.amount}
                  multiplicator={currentServings / recipe.servings}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-16 px-16 pb-48">
            <h2 className="font-semibold text-18">Zubereitung</h2>
            <div className="flex flex-col gap-16">
              {recipe.instructions && recipe.instructions.map((item: any, index: number) => (
                <div key={index} className="flex gap-16">
                  <span className="flex-shrink-0 w-24 h-24 flex items-center justify-center bg-turquoise-100 text-turquoise-600 font-bold rounded-full text-12">
                    {index + 1}
                  </span>
                  <p className="text-content-text-default leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
