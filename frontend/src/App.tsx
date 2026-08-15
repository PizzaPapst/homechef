import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/helper/ScrollToTop";
import Cookbook from "./pages/Cookbook";
import RecipeDetail from "./pages/RecipeDetail";
import ImportWebsite from "./pages/ImportWebsite";

function App() {
  return (
    <div className="h-[100dvh] font-sans flex flex-col overflow-hidden max-w-md mx-auto w-full relative bg-scooty-gray-50">
      <ScrollToTop />

      {/* Zentraler Inhaltsbereich mit automatischer Bottom-Safe-Area */}
      <main className="flex-1 flex flex-col overflow-hidden pb-safe">
        <Routes>
          <Route path="/" element={<Cookbook />} />
          <Route path="/recipe/preview" element={<RecipeDetail />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/import/website" element={<ImportWebsite />} />
          <Route path="/importWebsite" element={<ImportWebsite />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;