import { Plus, DotsThreeVertical } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

import { getAllMealPlans } from "@/services/api";
import { RecipeCard } from "../components/RecipeCard";

export default function WeeklyPlan() {

  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllMealPlans();
        setPlans(data || []);
      } catch (e) {
        console.error("Fehler beim Laden:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col h-full bg-scooty-gray-50 pb-80 overflow-hidden">
      {/* Header */}
      {/* <Header>
        <h1 className="text-22 text-turquoise-600">Wochenplan</h1>
      </Header> */}

      {/* Content */}
      <div className="flex flex-col gap-24 p-16 flex-1 overflow-y-auto no-scrollbar overscroll-contain">

        {isLoading && <p className="text-content-text-additional text-14">Lade Pläne...</p>}

        {!isLoading && plans.length === 0 && (
          <p className="text-content-text-additional text-14">Noch nichts geplant.</p>
        )}

        {plans.map((plan) => {
          const date = new Date(plan.date);

          return (
            <div key={plan.id} className="flex flex-col gap-12">

              {/* Header: Tag & Datum */}
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-8">
                  <span className="text-18 font-bold text-turquoise-600 capitalize">
                    {format(date, "EEEE", { locale: de })}
                  </span>
                  <span className="text-content-text-additional font-medium text-14">
                    {format(date, "d MMM", { locale: de })}
                  </span>
                </div>
                {/* 3 Punkte Menü Icon */}
                <button className="text-content-text-additional h-[56px] w-[56px] flex items-center justify-center">
                  <DotsThreeVertical size={24} weight="bold" />
                </button>
              </div>

              {/* Die Karte */}
              <div className="h-full">
                <RecipeCard recipe={plan.recipe} />
              </div>

            </div>
          );
        })}
      </div>

      {/* FAB */}
      <Button
        variant="fab"
        size="icon"
        className="fixed bottom-80 right-16 h-64 w-64 rounded-full z-50 text-content-text-inverted bg-turquoise-600 border-none shadow-fab-shadow"
        onClick={() => navigate("/plan/create")}
      >
        <Plus size={24} weight="bold" />
        <span className="sr-only">Neues Rezept erstellen</span>
      </Button>
    </div>
  )
}
