import { useState } from "react";
import { Recipe } from "./types";
import RecipeForm from "./components/RecipeForm";
import RecipeImporter from "./components/RecipeImporter";
import RecipeCardFrontNew from "./components/RecipeCardFrontNew";
import RecipeCardBackNew from "./components/RecipeCardBackNew";
import CognitiveAccessibleRecipe from "./components/CognitiveAccessibleRecipe";
import EnhancedCognitiveRecipe from "./components/EnhancedCognitiveRecipe";

function App() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [mode, setMode] = useState<"edit" | "import" | "preview" | "cook" | "cook-enhanced">("import");

  const handleSave = (r: Recipe) => {
    setRecipe(r);
    setMode("preview");
  };

  const handleImport = (r: Recipe) => {
    setRecipe(r);
    setMode("cook-enhanced"); // Go directly to enhanced cooking mode
  };

  return (
    <div className="app">
      {(mode === "import" || mode === "edit") && (
        <div className="form-container">
          <div className="mode-tabs">
            <button
              className={mode === "import" ? "tab-active" : "tab"}
              onClick={() => setMode("import")}
            >
              Import from URL
            </button>
            <button
              className={mode === "edit" ? "tab-active" : "tab"}
              onClick={() => setMode("edit")}
            >
              Manual Entry
            </button>
          </div>

          {mode === "import" && <RecipeImporter onImport={handleImport} />}
          {mode === "edit" && (
            <RecipeForm initialRecipe={recipe ?? undefined} onSave={handleSave} />
          )}
        </div>
      )}

      {mode === "preview" && recipe && (
        <div className="preview-container">
          <div className="preview-controls no-print">
            <button onClick={() => setMode("import")} className="btn-secondary">
              🔍 Start New Search
            </button>
            <button onClick={() => setMode("cook-enhanced")} className="btn-primary" title="Cooking mode with step photos, timers, and safety tips">
              👉 Start Cooking (Enhanced)
            </button>
            <button onClick={() => setMode("cook")} className="btn-secondary" title="Simple cooking mode with voice guidance only">
              👉 Start Cooking (Simple)
            </button>
          </div>
          <div className="cards-wrapper">
            <RecipeCardFrontNew recipe={recipe} />
            <RecipeCardBackNew recipe={recipe} />
          </div>
        </div>
      )}

      {mode === "cook" && recipe && (
        <CognitiveAccessibleRecipe
          recipe={recipe}
          onBack={() => setMode("preview")}
        />
      )}

      {mode === "cook-enhanced" && recipe && (
        <EnhancedCognitiveRecipe
          recipe={recipe}
          onBack={() => setMode("preview")}
        />
      )}
    </div>
  );
}

export default App;
