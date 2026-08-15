import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/helper/ScrollToTop";
import Cookbook from "./pages/Cookbook";
import WeeklyPlan from "./pages/WeeklyPlan";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeWizard from "./pages/RecipeWizard";
import { MobileNavigation } from "./components/MobileNavigation";
import SearchPage from "./pages/SearchPage";
import EditRecipePage from "./pages/EditRecipePage";
import WeeklyPlanWizard from "./pages/WeeklyPlanWizard";
import SearchResultsPage from "./pages/SearchResultsPage";
import CategoryPage from "./pages/CategoryPage";

function App() {
  const location = useLocation();

  // Liste der Seiten, auf denen die Navigation sichtbar sein soll
  const showNavRoutes = ["/", "/plan"];
  const shouldShowNav = showNavRoutes.includes(location.pathname);

  return (
    <div className="bg-scooty-gray-50 h-[100dvh] font-sans flex flex-col overflow-hidden max-w-md mx-auto w-full relative">
      <ScrollToTop />

      {/* Zentraler Inhaltsbereich mit automatischer Bottom-Safe-Area */}
      <main
        className={`flex-1 flex flex-col overflow-hidden ${
          shouldShowNav ? "pb-[calc(76px+env(safe-area-inset-bottom))]" : "pb-safe"
        }`}
      >
        <Routes>
          <Route path="/" element={<Cookbook />} />
          <Route path="/plan" element={<WeeklyPlan />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/results" element={<SearchResultsPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/recipe/create" element={<RecipeWizard />} />
          <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
          <Route path="/plan/create" element={<WeeklyPlanWizard />} />
        </Routes>
      </main>

      {/* Mobile Navigation */}
      {shouldShowNav && <MobileNavigation />}
    </div>
  );
}

export default App;