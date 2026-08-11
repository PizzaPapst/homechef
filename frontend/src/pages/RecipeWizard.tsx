import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Link as LinkIcon,
  Clock,
  Plus,
  Minus,
  Trash,
  Check,
  Spinner
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LabelValueGroup } from "@/components/ui/LabelValueGroup";
import Header from "../components/ui/Header";

const defaultValues = {
  title: "",
  servings: 4,
  prepTime: 45,
  imageUrl: "",
  ingredients: [
    { amount: "500", unit: "g", name: "Hackfleisch" }
  ],
  instructions: [{ step: 1, text: "" }],
  calories: 0
};

const UNITS = [
  "g", "kg", "ml", "l", "Stk.", "Pck.", "Dose", "Bd.", "Zehe", "EL", "TL", "Prise", "Spritzer", "Etwas", "n. B."
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CreateRecipeWizard({ initialData = null }: { initialData?: Record<string, any> | null }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(initialData ? 2 : 1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculatingCalories, setIsCalculatingCalories] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [openUnitIndex, setOpenUnitIndex] = useState<number | null>(null);

  const { register, control, handleSubmit, reset, trigger, setValue, watch } = useForm({
    defaultValues: initialData || defaultValues,
    mode: "onChange"
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: "ingredients"
  });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: "instructions"
  });

  const currentServings = watch("servings");
  const watchedIngredients = watch("ingredients");

  const handleImport = async () => {
    if (!importUrl) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/recipes/analyze?url=${encodeURIComponent(importUrl)}`);
      const data = await res.json();
      reset(data);
      setStep(2);
    } catch (e) {
      alert("Fehler beim Import.");
    }
    setIsLoading(false);
  };

  const nextStep = async () => {
    let isValid = false;

    if (step === 2) {
      isValid = await trigger(["title", "servings", "prepTime"]);
    } else if (step === 3) {
      isValid = await trigger("ingredients");
      if (isValid) {
        fetchCalories();
      }
    } else if (step === 4) {
      isValid = await trigger("calories");
    } else if (step === 5) {
      isValid = await trigger("instructions");
    } else {
      isValid = true;
    }

    if (isValid) setStep((s) => s + 1);
  };

  const fetchCalories = async () => {
    setIsCalculatingCalories(true);
    const ingredients = watchedIngredients;
    const title = watch("title");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const namesOnly = ingredients.map((ing: any) => {
      return `${ing.amount || ""} ${ing.unit || ""} ${ing.name}`.trim();
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/recipes/analyze-ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          ingredients: namesOnly,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.calories) {
          const servings = watch("servings") || 1;
          const caloriesPerServing = Math.round(data.calories / servings);
          setValue("calories", caloriesPerServing);
        }
      }
    } catch (e) {
      console.error("Fehler bei der Kalorienberechnung via Backend-Proxy:", e);
    } finally {
      setIsCalculatingCalories(false);
    }
  };

  const prevStep = () => {
    if (initialData && step === 2) navigate(-1);
    else if (step > 1) setStep((s) => s - 1);
    else navigate(-1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const isEditMode = !!initialData;

      const url = isEditMode
        ? `${import.meta.env.VITE_API_URL}/recipes/${initialData.id}`
        : `${import.meta.env.VITE_API_URL}/recipes`;

      const method = isEditMode ? "PATCH" : "POST";

      const cleanData = {
        ...data,
        servings: Number(data.servings),
        prepTime: Number(data.prepTime),
        ingredients: data.ingredients.map((ing: any) => ({
          ...ing,
          amount: ing.amount ? Number(ing.amount) : null
        })),
        calories: Number(data.calories)
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Speichern des Rezepts");
      }

      console.log("Erfolgreich gespeichert!");
      navigate("/");

    } catch (error) {
      console.error("Speicher-Fehler:", error);
      alert("Das Rezept konnte leider nicht gespeichert werden. Bitte versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepName = () => {
    switch (step) {
      case 1: return "Import";
      case 2: return "Basisdaten";
      case 3: return "Zutaten";
      case 4: return "Kalorien";
      case 5: return "Zubereitung";
      default: return "";
    }
  };

  const calculateStep = () => {
    const totalSteps = initialData ? 4 : 5;
    if (!initialData) {
      return `Schritt ${step} von ${totalSteps}`;
    }
    else return `Schritt ${step - 1} von ${totalSteps - 1}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  return (
    <div className="flex flex-col h-full bg-scooty-gray-50 overflow-hidden">

      {/* --- HEADER --- */}
      <Header className="flex-col items-stretch py-16 gap-8">
        <div className="flex justify-between items-end">
          <h1 className="text-14 font-medium tracking-tight">{calculateStep()}</h1>
          <span className="text-14 text-content-text-additional font-medium">{getStepName()}</span>
        </div>
        <div className="h-8 w-full bg-scooty-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-turquoise-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: initialData ? `${((step - 1) / 4) * 100}%` : `${(step / 5) * 100}%` }}
          />
        </div>
      </Header>

      {/* --- CONTENT AREA --- */}
      <div className="flex flex-1 flex-col p-16 overflow-y-auto no-scrollbar overscroll-contain">

        {/* SCHRITT 1: IMPORT */}
        {step === 1 && (
          <div className="flex flex-1 flex-col items-center text-center animate-in fade-in slide-in-from-bottom-16 gap-24 justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-24">
                <div className="h-64 w-64 border-4 border-turquoise-100 border-t-turquoise-600 rounded-full animate-spin"></div>
                <div className="flex flex-col gap-8">
                  <h2 className="text-22 font-bold">Magie im Gange...</h2>
                  <p className="text-content-text-additional">
                    Wir extrahieren das Rezept für dich. <br />
                    Bei Videos kann das bis zu 30 Sekunden dauern.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-turquoise-100 h-[80px] w-[80px] rounded-full flex items-center justify-center">
                  <LinkIcon size={36} className="text-turquoise-600" weight="bold" />
                </div>

                <h2 className="text-27 font-bold">Rezept importieren</h2>
                <p className="text-content-text-additional leading-relaxed">
                  Füge einen Link von YouTube, Instagram, TikTok oder Chefkoch ein
                </p>

                <div className="w-full">
                  <Input
                    placeholder="https://..."
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                  />
                </div>

                <p className="text-content-text-additional">oder</p>

                <Button
                  type="button"
                  variant="default"
                  onClick={() => {
                    reset(defaultValues);
                    setStep(2);
                  }}
                  className="w-full max-w-[200px] rounded-full border border-scooty-gray-200 bg-white"
                >
                  Manuell hinzufügen
                </Button>
              </>
            )}
          </div>
        )}

        {/* SCHRITT 2: BASISDATEN */}
        {step === 2 && (
          <div className="flex flex-col flex-1 gap-16 animate-in fade-in slide-in-from-right-8">

            <div className="flex flex-col gap-4">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                {...register("title", { required: true })}
              />
            </div>

            <div className="flex flex-col gap-4">
              <Label htmlFor="prepTime">Zubereitungszeit</Label>
              <div className="relative">
                <Input
                  id="prepTime"
                  type="number"
                  {...register("prepTime", { required: true })}
                />
                <div className="absolute inset-y-0 right-12 left-56 justify-between flex items-center gap-8 pointer-events-none text-turquoise-600">
                  <span className="text-content-text-additional pointer-events-none">Min.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Label>Portionen</Label>
              <div className="flex items-center justify-between w-full h-[56px] px-16 rounded-4 bg-white border border-scooty-gray-200">
                <span className="text-16">{currentServings}</span>
                <div className="flex items-center -mr-8 text-content-text-additional">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setValue("servings", Math.max(1, currentServings - 1))}
                    className="h-40 w-40 p-0 hover:text-turquoise-600"
                  >
                    <Minus size={20} weight="bold" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setValue("servings", currentServings + 1)}
                    className="h-40 w-40 p-0 hover:text-turquoise-600"
                  >
                    <Plus size={20} weight="bold" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-1 gap-4">
              <Label htmlFor="imageUrl">Bild URL</Label>
              <Input id="imageUrl" {...register("imageUrl")} placeholder="https://..." />
            </div>
          </div>
        )}

        {/* SCHRITT 3: ZUTATEN */}
        {step === 3 && (
          <div className="flex flex-col flex-1 gap-32 animate-in fade-in slide-in-from-right-8">
            <div className="flex flex-col gap-16">
              {ingredientFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-8 animate-in fade-in slide-in-from-bottom-8">

                  <div className="flex-1 flex flex-col border border-scooty-gray-200 rounded-8 bg-white shadow-sm">
                    <div className="flex border-b border-scooty-gray-200 h-[56px]">
                      {watchedIngredients?.[index]?.unit !== "Etwas" && watchedIngredients?.[index]?.unit !== "n. B." && (
                        <>
                          <div className="w-[33%] flex items-center px-16">
                            <input
                              placeholder="Menge"
                              {...register(`ingredients.${index}.amount`)}
                              className="w-full text-18 focus:outline-none placeholder:text-content-text-additional"
                            />
                          </div>
                          <div className="w-px bg-scooty-gray-200 h-full"></div>
                        </>
                      )}

                      <div className="flex-1 relative flex items-center">
                        <input
                          placeholder="Einheit"
                          {...register(`ingredients.${index}.unit`)}
                          onFocus={() => setOpenUnitIndex(index)}
                          onBlur={() => setTimeout(() => setOpenUnitIndex(null), 300)}
                          className="w-full h-full px-16 text-18 focus:outline-none placeholder:text-content-text-additional bg-transparent"
                          autoComplete="off"
                        />

                        {openUnitIndex === index && (() => {
                          const currentUnitValue = watchedIngredients?.[index]?.unit || "";
                          const filteredUnits = UNITS.filter(u =>
                            u.toLowerCase().startsWith(currentUnitValue.toLowerCase())
                          );

                          if (filteredUnits.length === 0 && currentUnitValue !== "") return null;

                          return (
                            <div className="absolute top-full left-0 right-0 z-[100] mt-4 bg-white border border-scooty-gray-200 rounded-4 shadow-card-shadow max-h-[192px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                              <div className="py-4">
                                {(filteredUnits.length > 0 ? filteredUnits : UNITS).map(unit => (
                                  <Button
                                    key={unit}
                                    type="button"
                                    variant="ghost"
                                    onMouseDown={() => {
                                      setValue(`ingredients.${index}.unit`, unit);
                                      setOpenUnitIndex(null);
                                    }}
                                    className="w-full justify-start rounded-none h-auto py-12 px-16 text-left font-normal"
                                  >
                                    {unit}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="h-[56px] flex items-center px-16">
                      <input
                        placeholder="Zutat"
                        {...register(`ingredients.${index}.name`, { required: true })}
                        className="w-full text-18 focus:outline-none placeholder:text-content-text-additional"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    className="p-8"
                  >
                    <Trash size={20} />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => appendIngredient({ amount: "", unit: "", name: "" })}
              className="flex items-center gap-8 font-medium"
            >
              <Plus size={20} weight="bold" /> Zutat hinzufügen
            </Button>
          </div>
        )}

        {/* SCHRITT 4: KALORIEN */}
        {step === 4 && (
          <div className="flex flex-col flex-1 gap-32 animate-in fade-in slide-in-from-right-8">
            <div className="flex flex-1 flex-col items-center text-center gap-16 justify-center">
              <div className="bg-turquoise-100 h-[80px] w-[80px] rounded-full flex items-center justify-center">
                <Clock size={36} className="text-turquoise-600" weight="bold" />
              </div>
              <h2 className="text-27 font-bold">Kalorien überprüfen</h2>
              <p className="text-content-text-additional leading-relaxed">
                Basierend auf deinen Zutaten haben wir die Kalorien geschätzt. Du kannst diese hier anpassen.
              </p>
              <LabelValueGroup label="Kalorien (kcal)" className="w-full text-left">
                <Input
                  id="calories"
                  type="number"
                  {...register("calories")}
                  className=""
                  endAdornment={isCalculatingCalories && <Spinner size={20} className="animate-spin text-turquoise-600" />}
                />
              </LabelValueGroup>
            </div>
          </div>
        )}

        {/* SCHRITT 5: ZUBEREITUNG */}
        {step === 5 && (
          <div className="flex flex-col flex-1 gap-32 animate-in fade-in slide-in-from-right-8">
            {instructionFields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-8">

                <div className="flex justify-between items-center">
                  <Label className="">
                    Schritt {index + 1}
                  </Label>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeInstruction(index)}
                    className="flex items-center gap-4 text-12 h-32 px-8"
                  >
                    <Trash size={16} weight="regular" /> Schritt löschen
                  </Button>
                </div>

                <Textarea
                  {...register(`instructions.${index}.text`, { required: true })}
                  className="w-full max-w-full min-h-[140px] max-h-[calc(100dvh-200px)] [field-sizing:content] overflow-y-auto break-all text-16 leading-relaxed border-scooty-gray-200 rounded-12 focus-visible:ring-turquoise-500 bg-white resize-none p-16 shadow-sm"
                  placeholder="Beschreibe, was in diesem Schritt passiert..."
                />
              </div>
            ))}

            <Button
              type="button"
              variant="ghost"
              onClick={() => appendInstruction({ step: instructionFields.length + 1, text: "" })}
              className="flex items-center gap-8 font-medium mt-8"
            >
              <Plus size={20} weight="bold" /> Schritt hinzufügen
            </Button>

            <div className="h-16"></div>
          </div>
        )}

      </div>

      {/* --- FOOTER --- */}
      <div className="flex-none p-16 bg-white border-t border-scooty-gray-200 flex justify-between items-center z-20">
        <Button
          variant="ghost"
          onClick={prevStep}
          className="flex items-center gap-8"
        >
          <ArrowLeft size={16} weight="bold" />
          {step === 1 ? "Abbrechen" : "Zurück"}
        </Button>

        {step < 5 ? (
          <Button
            variant="primary"
            onClick={step === 1 ? handleImport : nextStep}
            disabled={step === 1 && !importUrl}
            className="flex items-center gap-8"
          >
            {step === 1 ? "Import" : "Weiter"} <ArrowRight size={16} weight="bold" />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-8"
          >
            Fertigstellen <Check size={16} weight="bold" />
          </Button>
        )}
      </div>

    </div>
  );
}
