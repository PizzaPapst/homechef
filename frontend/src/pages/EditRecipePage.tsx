import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecipeWizard from "./RecipeWizard";

import { fetchRecipeById } from "@/services/api";

function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchRecipeById(id!)
      .then((data) => {
        if (!data) throw new Error("Rezept nicht gefunden");
        setRecipe(data as Record<string, unknown>);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Konnte Rezeptdaten nicht laden.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-48 w-48 border-b-2 border-turquoise-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-32 text-center">
        <p className="text-bold-red-500 mb-16">{error}</p>
        <button onClick={() => navigate(-1)} className="underline">Zurück</button>
      </div>
    );
  }

  return <RecipeWizard initialData={recipe} />;
}

export default EditRecipePage
