import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  ArrowsClockwise,
  DotsThreeVertical,
  CaretRight,
  Plus
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { addDays, eachDayOfInterval, format } from "date-fns";
import { de } from "date-fns/locale";
import Header from "../components/ui/Header";

import { fetchAllRecipes, saveWeeklyPlan } from "@/services/api";
import { RecipeCard } from "@homechef/ui";

const defaultValues = {
  startDate: "",
  endDate: "",
  days: []
};

export default function WeeklyPlanWizard() {
  const navigate = useNavigate();

  const [date] = useState({
    from: new Date(),
    to: addDays(new Date(), 6),
  });

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 2;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recipes, setRecipes] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plan, setPlan] = useState<Record<string, any>>({});
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const daysToPlan = (date?.from && date?.to)
    ? eachDayOfInterval({ start: date.from, end: date.to })
    : [];

  const { handleSubmit } = useForm({
    defaultValues: defaultValues,
    mode: "onChange"
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getRandomRecipe = (pool: any[]) => {
    if (!pool || pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const rerollDay = (dateKey: string) => {
    setPlan(prev => ({
      ...prev,
      [dateKey]: getRandomRecipe(recipes)
    }));
  };

  const nextStep = async () => {
    if (step === 1) {
      if (!date.from || !date.to) return;

      setIsLoading(true);
      try {
        const loadedRecipes = await fetchAllRecipes();
        const safeRecipes = Array.isArray(loadedRecipes) ? loadedRecipes : [];
        setRecipes(safeRecipes);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newPlan: Record<string, any> = {};
        const days = eachDayOfInterval({ start: date.from, end: date.to });

        days.forEach(day => {
          const key = format(day, "yyyy-MM-dd");
          newPlan[key] = null;
        });

        setPlan(newPlan);
        setStep(2);
      } catch (error) {
        console.error("Fehler beim Laden:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
    else navigate(-1);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
        days: Object.entries(plan).map(([dateKey, recipe]) => ({
          date: new Date(dateKey).toISOString(),
          recipeId: recipe?.id
        })).filter(entry => entry.recipeId)
      };

      console.log("Speichere Wochenplan:", payload);
      await saveWeeklyPlan(payload);
      navigate("/plan");
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openSelection = (dateKey: string) => {
    setSelectedDateKey(dateKey);
    setIsSelectionOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectRecipeForDay = (recipe: any) => {
    if (!selectedDateKey) return;
    setPlan(prev => ({
      ...prev,
      [selectedDateKey]: recipe
    }));
    setIsSelectionOpen(false);
  };

  const getStepName = () => {
    switch (step) {
      case 1: return "Zeitraum wählen";
      case 2: return "Gerichte planen";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">

      {/* --- HEADER --- */}
      <Header className="flex-col items-stretch h-auto py-16 gap-8">
        <div className="flex justify-between items-end">
          <h1 className="text-14 font-medium tracking-tight">Schritt {step} von {totalSteps}</h1>
          <span className="text-14 text-content-text-additional font-medium">{getStepName()}</span>
        </div>
        <div className="h-8 w-full bg-scooty-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-turquoise-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </Header>

      {/* --- CONTENT AREA --- */}
      <div className="flex flex-1 flex-col p-16 overflow-y-auto no-scrollbar">

        {/* SCHRITT 1: ZEITRAUM */}
        {step === 1 && (
          <div className="flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-16 gap-16 items-center justify-center text-center">
            <div className="bg-turquoise-100 h-[80px] w-[80px] rounded-full flex items-center justify-center">
              <Calendar size={36} className="text-turquoise-600" />
            </div>
            <h2 className="text-27 font-bold">Wann möchtest du planen?</h2>
            <p className="text-content-text-additional max-w-xs">
              Wähle den Start- und Endzeitpunkt für deinen neuen Wochenplan.
            </p>
          </div>
        )}

        {/* SCHRITT 2: PLANUNG */}
        {step === 2 && (
          <div className="flex flex-col flex-1 gap-32 animate-in fade-in slide-in-from-right-8 w-full">

            <div className="flex flex-col gap-4">
              <h2 className="text-18 font-bold">Dein Plan</h2>
              <p className="text-14 text-content-text-additional">Hier ist ein Vorschlag für deine Woche.</p>
            </div>

            {/* DIE LISTE DER TAGE */}
            <div className="flex flex-col gap-32">
              {daysToPlan && daysToPlan.map((day, index) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const recipe = plan[dateKey];

                return (
                  <div key={index} className="flex flex-col gap-0">

                    {/* Header: Wochentag + Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-8">
                        <span className="text-18 font-semibold text-turquoise-600 capitalize">
                          {format(day, "EEEE", { locale: de })}
                        </span>
                        <span className="text-14 text-content-text-additional">
                          {format(day, "d. MMM", { locale: de })}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => rerollDay(dateKey)}
                          className="text-content-text-additional hover:text-turquoise-600 h-[56px] w-[56px]"
                          title="Zufälliges Rezept"
                        >
                          <ArrowsClockwise size={20} weight="bold" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-content-text-additional hover:text-turquoise-600 h-[56px] w-[56px]"
                        >
                          <DotsThreeVertical size={24} weight="bold" />
                        </Button>
                      </div>
                    </div>

                    {/* Die Karte */}
                    <div className="group transition-all">
                      {recipe ? (
                        <div onClick={() => openSelection(dateKey)} className="cursor-pointer">
                          <RecipeCard recipe={recipe} />
                        </div>
                      ) : (
                        <div
                          onClick={() => openSelection(dateKey)}
                          className="aspect-[16/9] w-full bg-scooty-gray-50 border-2 border-dashed border-scooty-gray-200 rounded-16 flex flex-col items-center justify-center gap-12 cursor-pointer hover:bg-scooty-gray-50 hover:border-turquoise-200 transition-all active:scale-[0.98]"
                        >
                          <div className="bg-white p-12 rounded-full shadow-sm text-content-text-additional group-hover:text-turquoise-600 transition-colors">
                            <Plus size={24} weight="bold" />
                          </div>
                          <span className="text-14 font-medium text-content-text-additional group-hover:text-turquoise-600 transition-colors">
                            Rezept auswählen
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* --- RECIPE SELECTION MODAL --- */}
      {isSelectionOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom duration-300 flex flex-col">
          <div className="p-16 border-b border-scooty-gray-200 flex items-center justify-between sticky top-0 bg-white">
            <h2 className="text-22 font-bold">Rezept auswählen</h2>
            <Button variant="ghost" onClick={() => setIsSelectionOpen(false)}>Schließen</Button>
          </div>

          <div className="flex-1 overflow-y-auto p-16">
            <div className="flex flex-col gap-16">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => selectRecipeForDay(recipe)}
                  className="flex items-center gap-16 p-8 active:bg-scooty-gray-50 rounded-12 transition-colors border border-transparent active:border-scooty-gray-200"
                >
                  <img
                    src={recipe.imageUrl || "https://images.unsplash.com/photo-1543353071-087092ec393a?q=80&w=1000&auto=format&fit=crop"}
                    alt={recipe.title}
                    className="w-64 h-64 rounded-8 object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-18">{recipe.title}</h3>
                    <p className="text-14 text-content-text-additional">{recipe.prepTime} Min.</p>
                  </div>
                  <CaretRight size={20} className="text-content-text-additional" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <div className="flex-none p-16 bg-white border-t border-scooty-gray-200 flex justify-between items-center z-20">
        <button
          onClick={prevStep}
          className="flex items-center gap-8 text-content-text-default px-16 py-8 hover:opacity-80 text-14"
        >
          <ArrowLeft size={16} weight="bold" />
          {step === 1 ? "Abbrechen" : "Zurück"}
        </button>

        {step < totalSteps ? (
          <Button
            onClick={nextStep}
            disabled={isLoading}
            className="bg-turquoise-600 hover:bg-turquoise-600/90 text-white rounded-l px-16 py-8 text-14 font-medium flex items-center gap-8"
          >
            {isLoading ? "Laden..." : "Plan erstellen"} <ArrowRight size={16} weight="bold" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit(onSubmit)}
            className="bg-turquoise-600 hover:bg-turquoise-600/90 text-white rounded-l px-16 py-8 font-medium text-14 flex items-center gap-8"
          >
            Speichern <Check size={16} weight="bold" />
          </Button>
        )}
      </div>

    </div>
  );
}
