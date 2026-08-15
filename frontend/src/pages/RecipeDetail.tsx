import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, type UIEvent } from "react";
import { Header, IconButton, Button } from "@homechef/ui";
import { ArrowLeft, Clock, Flame, MoreVertical, Minus, Plus } from "lucide-react";
import { createRecipe, fetchRecipeById } from "@/services/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecipeAny = Record<string, any>;

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const previewData = location.state?.previewData;
  const isPreview = Boolean(previewData || id === "preview");

  const [recipe, setRecipe] = useState<RecipeAny | null>(previewData || null);
  const [loading, setLoading] = useState(!previewData);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTitleInHeader, setShowTitleInHeader] = useState(false);
  const [currentServings, setCurrentServings] = useState(previewData?.servings || 0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (previewData) {
      setRecipe(previewData);
      setCurrentServings(previewData.servings || 4);
      setLoading(false);
      return;
    }

    if (!id || id === "preview") return;

    setLoading(true);
    fetchRecipeById(id)
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
  }, [id, previewData]);

  const handleScroll = (e: UIEvent<HTMLElement>) => {
    const scrollTop = (e.target as HTMLElement).scrollTop;
    setIsScrolled(scrollTop > 20);
    setShowTitleInHeader(scrollTop > 320);
  };

  const handleSave = async () => {
    if (!recipe) return;
    setIsSaving(true);
    try {
      const saved = await createRecipe(recipe);
      navigate(`/recipe/${saved.id}`, { replace: true, state: {} });
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Fehler beim Speichern des Rezepts.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-32 text-center text-content-text-additional">Lädt...</div>;
  if (error) return (
    <div className="p-32 flex flex-col items-center gap-16">
      <p className="text-center text-bold-red-500 font-medium">{error}</p>
      <Button label="Zurück zum Kochbuch" onClick={() => navigate("/")} />
    </div>
  );
  if (!recipe) return null;

  const image = recipe.imageUrl || "https://images.unsplash.com/photo-1543353071-087092ec393a?q=80&w=1000&auto=format&fit=crop";

  const handlePortionChange = (newAmount: number) => {
    if (newAmount >= 1) {
      setCurrentServings(newAmount);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* Header with Actions */}
      <Header
        className={`absolute top-0 left-0 right-0 z-50 justify-between transition-all duration-300 pt-safe px-16 ${
          isScrolled ? "bg-white shadow-header-shadow" : "bg-transparent shadow-none"
        }`}
      >
        <IconButton
          variant="tertiary"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
          aria-label="Zurück"
          className="bg-white/80 backdrop-blur-sm shadow-sm"
        />

        <div className={`flex-1 px-16 text-center transition-all duration-300 ${
          showTitleInHeader ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        }`}>
          <h2 className="typography-heading-medium text-content-text-default truncate max-w-[200px] mx-auto">
            {recipe.title}
          </h2>
        </div>

        {/* More Button: Disabled */}
        <IconButton
          variant="tertiary"
          icon={<MoreVertical size={16} />}
          disabled={true}
          aria-label="Weitere Optionen (deaktiviert)"
          className="bg-white/80 backdrop-blur-sm shadow-sm"
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
              <h1 className="typography-heading-large text-content-text-default">{recipe.title}</h1>

              <div className="flex gap-16">
                <div className="flex items-center gap-4 text-content-text-additional">
                  <Clock size={18} />
                  <p className="typography-body-small">{recipe.prepTime} Min.</p>
                </div>

                {recipe.calories > 0 && (
                  <div className="flex items-center gap-4 text-content-text-additional">
                    <Flame size={18} />
                    <p className="typography-body-small">{recipe.calories} kcal</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Portionen & Zutaten */}
          <div className="flex flex-col gap-16 px-16">
            <h2 className="typography-heading-medium text-content-text-default">Zutaten</h2>
            
            {/* Portion Stepper */}
            <div className="flex items-center justify-between bg-scooty-gray-100 pl-16 pr-8 py-8 rounded-8">
              <span className="typography-body-medium text-content-text-default">
                Für <span className="font-semibold">{currentServings}</span> Portionen
              </span>

              <div className="flex items-center gap-4">
                <IconButton
                  variant="tertiary"
                  icon={<Minus size={16} />}
                  onClick={() => handlePortionChange(Math.max(1, currentServings - 1))}
                  disabled={currentServings <= 1}
                  aria-label="Portion verringern"
                />
                <IconButton
                  variant="tertiary"
                  icon={<Plus size={16} />}
                  onClick={() => handlePortionChange(currentServings + 1)}
                  aria-label="Portion erhöhen"
                />
              </div>
            </div>

            {/* Zutaten-Liste */}
            <div className="flex flex-col divide-y divide-scooty-gray-100">
              {recipe.ingredients && recipe.ingredients.map((ingredient: any, index: number) => {
                const multiplicator = (recipe.servings && recipe.servings > 0) ? currentServings / recipe.servings : 1;
                const num = ingredient.amount ? multiplicator * ingredient.amount : null;
                const rounded = num ? Math.round(num * 1000) / 1000 : null;
                const amountStr = rounded !== null && ingredient.unit !== "Etwas" ? `${rounded}` : "";
                const unitStr = ingredient.unit || "";
                const displayQuantity = `${amountStr} ${unitStr}`.trim();

                return (
                  <div key={index} className="flex py-8 typography-body-medium">
                    <span className="w-1/3 text-content-text-additional font-medium">
                      {displayQuantity}
                    </span>
                    <span className="flex-1 text-content-text-default">
                      {ingredient.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Zubereitung */}
          <div className="flex flex-col gap-16 px-16 pb-48">
            <h2 className="typography-heading-medium text-content-text-default">Zubereitung</h2>
            <div className="flex flex-col gap-16">
              {recipe.instructions && recipe.instructions.map((item: any, index: number) => (
                <div key={index} className="flex gap-16">
                  <span className="flex-shrink-0 w-24 h-24 flex items-center justify-center bg-scooty-gray-200 text-content-text-default font-bold rounded-full typography-body-small">
                    {index + 1}
                  </span>
                  <p className="typography-body-medium text-content-text-default leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar im Preview-Modus */}
      {isPreview && (
        <div className="p-16 pb-safe bg-white border-t border-scooty-gray-200 flex gap-12 z-40 shadow-card-default">
          <Button
            variant="secondary"
            label="Bearbeiten"
            disabled={true}
            className="flex-1"
          />
          <Button
            variant="primary"
            label={isSaving ? "Wird gespeichert..." : "Speichern"}
            isLoading={isSaving}
            onClick={handleSave}
            className="flex-1"
          />
        </div>
      )}
    </div>
  );
}


