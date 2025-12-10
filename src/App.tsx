import { useState, useEffect } from "react";
import { Recipe } from "./types";
import RecipeForm from "./components/RecipeForm";
import RecipeImporter from "./components/RecipeImporter";
import RecipeCardFrontNew from "./components/RecipeCardFrontNew";
import RecipeCardBackNew from "./components/RecipeCardBackNew";
import CognitiveAccessibleRecipe from "./components/CognitiveAccessibleRecipe";
import EnhancedCognitiveRecipe from "./components/EnhancedCognitiveRecipe";
import { getFavoriteRecipes, saveToFavorites, removeFromFavorites, isFavorite, markAsCooked, type SavedRecipe } from "./services/favoriteRecipes";
import { generateShoppingList, groupByCategory, type ShoppingItem } from "./services/shoppingList";

function App() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [mode, setMode] = useState<"edit" | "import" | "preview" | "cook" | "cook-enhanced" | "favorites" | "shopping">("import");
  const [favorites, setFavorites] = useState<SavedRecipe[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [isRecipeFavorite, setIsRecipeFavorite] = useState(false);

  // Load favorites on mount
  useEffect(() => {
    setFavorites(getFavoriteRecipes());
  }, []);

  // Check if current recipe is a favorite
  useEffect(() => {
    if (recipe) {
      setIsRecipeFavorite(isFavorite(recipe.title));
    }
  }, [recipe]);

  const handleSave = (r: Recipe) => {
    setRecipe(r);
    setMode("preview");
  };

  const handleImport = (r: Recipe) => {
    setRecipe(r);
    setMode("cook-enhanced"); // Go directly to enhanced cooking mode
  };

  const handleToggleFavorite = () => {
    if (!recipe) return;
    
    if (isRecipeFavorite) {
      removeFromFavorites(recipe.title);
      setIsRecipeFavorite(false);
    } else {
      saveToFavorites(recipe);
      setIsRecipeFavorite(true);
    }
    setFavorites(getFavoriteRecipes());
  };

  const handleSelectFavorite = (savedRecipe: SavedRecipe) => {
    setRecipe(savedRecipe);
    setMode("cook-enhanced");
  };

  const handleCookingComplete = () => {
    if (recipe) {
      markAsCooked(recipe.title);
      setFavorites(getFavoriteRecipes());
    }
    setMode("import");
  };

  const handleGenerateShoppingList = () => {
    if (recipe) {
      const items = generateShoppingList(recipe);
      setShoppingList(items);
      setMode("shopping");
    }
  };

  const handleToggleShoppingItem = (index: number) => {
    setShoppingList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], checked: !updated[index].checked };
      return updated;
    });
  };

  return (
    <div className="app">
      {/* Favorites Button - Always visible except in cooking mode */}
      {mode !== "cook" && mode !== "cook-enhanced" && (
        <div className="favorites-bar no-print">
          <button 
            onClick={() => setMode("favorites")} 
            className={`btn-favorites ${mode === "favorites" ? "active" : ""}`}
          >
            ❤️ My Recipes ({favorites.length})
          </button>
          {mode !== "import" && mode !== "edit" && (
            <button onClick={() => setMode("import")} className="btn-home">
              🏠 Home
            </button>
          )}
        </div>
      )}

      {/* Favorites View */}
      {mode === "favorites" && (
        <div className="favorites-container">
          <h2>❤️ My Saved Recipes</h2>
          {favorites.length === 0 ? (
            <div className="no-favorites">
              <p className="no-favorites-message">No saved recipes yet!</p>
              <p>When you find a recipe you like, tap the ❤️ button to save it here.</p>
              <button onClick={() => setMode("import")} className="btn-primary">
                🔍 Find a Recipe
              </button>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((fav, index) => (
                <div key={index} className="favorite-card" onClick={() => handleSelectFavorite(fav)}>
                  <div className="favorite-title">{fav.title}</div>
                  <div className="favorite-stats">
                    {fav.timesCooked > 0 && (
                      <span className="times-cooked">Cooked {fav.timesCooked}x</span>
                    )}
                  </div>
                  <button className="btn-cook-favorite">
                    👉 Cook This
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Shopping List View */}
      {mode === "shopping" && (
        <div className="shopping-container">
          <h2>🛒 Shopping List</h2>
          {recipe && <p className="shopping-recipe-name">For: {recipe.title}</p>}
          
          <div className="shopping-list">
            {Array.from(groupByCategory(shoppingList)).map(([category, items]) => (
              <div key={category} className="shopping-category">
                <h3 className="category-header">{category}</h3>
                {items.map((item, idx) => {
                  const globalIndex = shoppingList.findIndex(i => i === item);
                  return (
                    <div 
                      key={idx} 
                      className={`shopping-item ${item.checked ? 'checked' : ''}`}
                      onClick={() => handleToggleShoppingItem(globalIndex)}
                    >
                      <div className={`shopping-checkbox ${item.checked ? 'checked' : ''}`}>
                        {item.checked && '✓'}
                      </div>
                      <span className="shopping-amount">{item.amount}</span>
                      <span className="shopping-name">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          
          <div className="shopping-actions">
            <button onClick={() => window.print()} className="btn-primary">
              🖨️ Print List
            </button>
            <button onClick={() => setMode("cook-enhanced")} className="btn-secondary">
              👉 Start Cooking
            </button>
          </div>
        </div>
      )}

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
            <button onClick={handleToggleFavorite} className={`btn-favorite ${isRecipeFavorite ? 'active' : ''}`}>
              {isRecipeFavorite ? '❤️ Saved' : '🤍 Save Recipe'}
            </button>
            <button onClick={handleGenerateShoppingList} className="btn-secondary">
              🛒 Shopping List
            </button>
            <button onClick={() => setMode("cook-enhanced")} className="btn-primary" title="Cooking mode with step photos, timers, and safety tips">
              👉 Start Cooking
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
          onComplete={handleCookingComplete}
        />
      )}

      {mode === "cook-enhanced" && recipe && (
        <EnhancedCognitiveRecipe
          recipe={recipe}
          onBack={() => setMode("preview")}
          onComplete={handleCookingComplete}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isRecipeFavorite}
        />
      )}
    </div>
  );
}

export default App;
