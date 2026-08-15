import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, IconButton, ActionTile, InputText, Button } from "@homechef/ui";
import { ArrowLeft, Link2 } from "lucide-react";
import { analyzeRecipe } from "@/services/api";

export default function ImportWebsite() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeImport = async (importUrl: string) => {
    const trimmed = importUrl.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const recipeData = await analyzeRecipe(trimmed);
      // Navigiert direkt zur Vorschau auf der RezeptDetail-Seite
      navigate("/recipe/preview", { state: { previewData: recipeData } });
    } catch (err: any) {
      console.error("Fehler beim Importieren:", err);
      setError(err?.message || "Fehler beim Importieren des Rezepts. Bitte überprüfe die URL.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setUrl(text.trim());
          setError(null);
          await executeImport(text.trim());
        }
      }
    } catch (err) {
      console.warn("Clipboard access denied or not available", err);
    }
  };

  const handleImport = async () => {
    await executeImport(url);
  };

  return (
    <div className="flex flex-col h-full bg-scooty-gray-50 overflow-hidden">
      {/* Header */}
      <Header variant="quiet" className="pt-safe">
        <div className="flex items-center gap-12 w-full">
          <IconButton
            variant="tertiary"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            aria-label="Zurück"
          />
          <h1 className="typography-heading-medium text-content-text-default">
            Rezept importieren
          </h1>
        </div>
      </Header>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto p-16 flex flex-col justify-between gap-16">
        {/* Upper Action Tile: Aus Zwischenablage einfügen */}
        <div className="flex-1 flex flex-col pt-8">
          <ActionTile
            icon={<Link2 size={32} className="rotate-[-45deg] mb-8" />}
            label={loading ? "Wird analysiert..." : "Aus Zwischenablage einfügen"}
            disabled={loading}
            onClick={handlePasteFromClipboard}
            className="w-full flex-1 min-h-[220px] max-h-[380px] rounded-16 shadow-none"
          />
        </div>

        {/* Middle: oder */}
        <div className="text-center">
          <span className="typography-body-small text-content-text-default font-medium">
            oder
          </span>
        </div>

        {/* Lower Area: InputText + Primary Button mit Spinner */}
        <div className="flex flex-col gap-16 pb-8">
          <InputText
            placeholder="Url eintippen"
            value={url}
            disabled={loading}
            error={error || undefined}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && url.trim() && !loading) {
                handleImport();
              }
            }}
          />

          <Button
            label={loading ? "Wird importiert..." : "Importieren"}
            isLoading={loading}
            disabled={!url.trim()}
            onClick={handleImport}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

