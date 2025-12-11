import { useState, useEffect } from "react";
import { Recipe } from "./types";
import RecipeForm from "./components/RecipeForm";
import RecipeImporter from "./components/RecipeImporter";
import RecipeCardFrontNew from "./components/RecipeCardFrontNew";
import RecipeCardBackNew from "./components/RecipeCardBackNew";
import CognitiveAccessibleRecipe from "./components/CognitiveAccessibleRecipe";
import EnhancedCognitiveRecipe from "./components/EnhancedCognitiveRecipe";
import Onboarding from "./components/Onboarding";
import SettingsPanel from "./components/SettingsPanel";
import MealPlanner from "./components/MealPlanner";
import FeedbackModal from "./components/FeedbackModal";
import KeyboardShortcutsHelp from "./components/KeyboardShortcutsHelp";
import SubstitutionsPanel from "./components/SubstitutionsPanel";
import { getFavoriteRecipes, saveToFavorites, removeFromFavorites, isFavorite, markAsCooked, type SavedRecipe } from "./services/favoriteRecipes";
import { generateShoppingList, groupByCategory, type ShoppingItem } from "./services/shoppingList";
import { initializeTheme, applyTheme, saveTheme, type ThemeMode } from "./services/themeService";
import { hasCompletedOnboarding } from "./services/onboardingService";
import { getSavedLanguage, saveLanguage, type SupportedLanguage } from "./services/languageService";
import { printRecipe } from "./services/printService";
import { initKeyboardShortcuts, cleanupKeyboardShortcuts, registerShortcutHandler, type ShortcutAction } from "./services/keyboardShortcuts";

function App() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [mode, setMode] = useState<"edit" | "import" | "preview" | "cook" | "cook-enhanced" | "favorites" | "shopping">("import");
  const [favorites, setFavorites] = useState<SavedRecipe[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [isRecipeFavorite, setIsRecipeFavorite] = useState(false);
  
  // New state for features 11-15
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // New state for features 16-20
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState<'rating' | 'feedback'>('rating');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSubstitutions, setShowSubstitutions] = useState(false);

  // Initialize theme and check onboarding on mount
  useEffect(() => {
    const savedTheme = initializeTheme();
    setTheme(savedTheme);
    
    const savedLang = getSavedLanguage();
    setLanguage(savedLang);
    
    // Show onboarding for first-time users
    if (!hasCompletedOnboarding()) {
      setShowOnboarding(true);
    }
    
    // Initialize keyboard shortcuts
    initKeyboardShortcuts();
    
    return () => {
      cleanupKeyboardShortcuts();
    };
  }, []);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const unsubscribe = registerShortcutHandler((action: ShortcutAction) => {
      switch (action) {
        case 'go-home':
          setMode('import');
          break;
        case 'go-favorites':
          setMode('favorites');
          break;
        case 'open-settings':
          setShowSettings(true);
          break;
        case 'close-modal':
          setShowSettings(false);
          setShowMealPlanner(false);
          setShowFeedback(false);
          setShowShortcuts(false);
          setShowSubstitutions(false);
          break;
        case 'toggle-theme':
          handleThemeChange(theme === 'light' ? 'dark' : theme === 'dark' ? 'high-contrast' : 'light');
          break;
        case 'print':
          if (recipe) printRecipe(recipe);
          break;
      }
    });
    
    return unsubscribe;
  }, [theme, recipe]);

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

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    saveTheme(newTheme);
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    saveLanguage(newLang);
  };

  const handlePrint = () => {
    if (recipe) {
      printRecipe(recipe, { fontSize: 'large', highContrast: theme === 'high-contrast' });
    }
  };

  const handleShowRating = () => {
    setFeedbackMode('rating');
    setShowFeedback(true);
  };

  const handleShowFeedback = () => {
    setFeedbackMode('feedback');
    setShowFeedback(true);
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
      {/* Onboarding for first-time users */}
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
        language={language}
        onLanguageChange={handleLanguageChange}
        onShowOnboarding={() => setShowOnboarding(true)}
      />

      {/* Meal Planner */}
      <MealPlanner
        isOpen={showMealPlanner}
        onClose={() => setShowMealPlanner(false)}
        currentRecipe={recipe}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        recipeId={recipe?.title}
        recipeName={recipe?.title}
        mode={feedbackMode}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Substitutions Panel */}
      <SubstitutionsPanel
        isOpen={showSubstitutions}
        onClose={() => setShowSubstitutions(false)}
        ingredients={recipe?.ingredients}
      />

      {/* Top Bar - Always visible except in cooking mode */}
      {mode !== "cook" && mode !== "cook-enhanced" && (
        <div className="favorites-bar no-print">
          <button 
            onClick={() => setMode("favorites")} 
            className={`btn-favorites ${mode === "favorites" ? "active" : ""}`}
          >
            ❤️ My Recipes ({favorites.length})
          </button>
          <button onClick={() => setShowMealPlanner(true)} className="btn-meal-planner" title="Meal Planner">
            📅
          </button>
          <button onClick={() => setShowShortcuts(true)} className="btn-shortcuts" title="Keyboard Shortcuts">
            ⌨️
          </button>
          <button onClick={handleShowFeedback} className="btn-feedback" title="Send Feedback">
            💬
          </button>
          <button onClick={() => setShowSettings(true)} className="btn-settings">
            ⚙️
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
            <button onClick={() => setShowSubstitutions(true)} className="btn-secondary" title="Ingredient Substitutions">
              🔄 Substitutes
            </button>
            <button onClick={handlePrint} className="btn-secondary" title="Print Recipe">
              🖨️ Print
            </button>
            <button onClick={() => setShowMealPlanner(true)} className="btn-secondary" title="Add to Meal Plan">
              📅 Plan
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
          onComplete={() => {
            handleCookingComplete();
            handleShowRating();
          }}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isRecipeFavorite}
        />
      )}
    </div>
  );
}

export default App;
