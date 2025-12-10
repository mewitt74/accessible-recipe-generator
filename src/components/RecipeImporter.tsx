import { useState, useRef } from "react";
import { Recipe } from "../types";
import { transformToStandardRecipe, expandedSearch } from "../services/recipeApi";
import { getFoodNameFromImage, expandSearchTerms } from "../services/imageRecognition";
import { searchAllAdFreeSources, fetchRecipeFromSource, recipeSources } from "../services/recipeSources";
import type { RecipeSource as RecipeSourceType } from "../services/recipeSources";
import { searchBasicRecipes, getBasicRecipeTitles } from "../services/basicRecipes";

interface Props {
  onImport: (recipe: Recipe) => void;
}

function RecipeImporter({ onImport }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [imageFoodMatches, setImageFoodMatches] = useState<string[]>([]);
  const [adFreeResults, setAdFreeResults] = useState<{ source: string; results: { url: string; title: string }[] }[]>([]);
  const [loadingAdFreeUrl, setLoadingAdFreeUrl] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (jpg, png, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large. Please use an image under 10MB.');
      return;
    }

    setImageProcessing(true);
    setError(null);
    setShowManualInput(false);
    setSearchResults([]);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Try to identify the food using OCR
      console.log('Reading text from food package photo...');
      const result = await getFoodNameFromImage(file);

      if (result.foodNames && result.foodNames.length > 0) {
        // Store the identified food matches
        setImageFoodMatches(result.foodNames);
        setShowManualInput(true);
        setImageProcessing(false);
        
        // Use first match as search query
        const primaryFood = result.foodNames[0];
        setSearchQuery(primaryFood);
        
        console.log(`Found "${primaryFood}" from photo, searching for recipes...`);
        
        // Perform search with expanded terms
        const expanded = expandSearchTerms(primaryFood);
        const allResults = await expandedSearch(primaryFood, expanded);
        
        if (allResults.length === 0) {
          setError(`Found "${primaryFood}" in the photo, but no recipes available. You can try typing something different.`);
        } else {
          setSearchResults(allResults);
        }
      } else {
        // Couldn't identify - show manual input
        console.log('Could not recognize food from photo, user needs to type manually');
        setShowManualInput(true);
        setImageProcessing(false);
        setError('Could not read the food name from the photo. Please type what you see (like "Kraft Mac and Cheese").');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      setShowManualInput(true);
      setImageProcessing(false);
    }
  };

  const handleClearImage = () => {
    setUploadedImage(null);
    setShowManualInput(false);
    setImageFoodMatches([]);
    setSearchResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      // Automatically search after voice input
      setTimeout(() => {
        handleSearch();
      }, 500);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setError('Could not understand. Please try again or type instead.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleCategoryClick = (_category: string, searchTerm: string) => {
    setShowCategories(false);
    setSearchQuery(searchTerm);
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleDontKnow = () => {
    const hour = new Date().getHours();
    let suggestions: Array<{title: string, search: string}> = [];
    
    if (hour >= 5 && hour < 11) {
      // Breakfast time
      suggestions = [
        {title: '🍳 Scrambled Eggs', search: 'scrambled eggs'},
        {title: '🍞 Toast with Butter', search: 'toast'},
        {title: '🥣 Cereal', search: 'cereal'}
      ];
    } else if (hour >= 11 && hour < 16) {
      // Lunch time
      suggestions = [
        {title: '🥪 Grilled Cheese', search: 'grilled cheese'},
        {title: '🍝 Pasta', search: 'pasta'},
        {title: '🍲 Soup', search: 'soup'}
      ];
    } else {
      // Dinner time
      suggestions = [
        {title: '🍗 Chicken', search: 'chicken'},
        {title: '🍝 Spaghetti', search: 'spaghetti'},
        {title: '🥘 Stir Fry', search: 'stir fry'}
      ];
    }

    // Show suggestions
    setShowCategories(false);
    setError(null);
    setSearchResults([]);
    
    // Create a visual selection UI
    const mealTime = hour >= 5 && hour < 11 ? 'Breakfast' : hour >= 11 && hour < 16 ? 'Lunch' : 'Dinner';
    setError(`${mealTime} Time! Pick one: ${suggestions.map(s => s.title).join(' | ')}`);
    
    // Auto-suggest first option
    setSearchQuery(suggestions[0].search);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a food or ingredient to search");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResults([]);
    setAdFreeResults([]);

    try {
      // First, check basic recipes
      const basicResults = searchBasicRecipes(searchQuery);
      
      if (basicResults.length > 0) {
        // Found in basic recipes - use those first
        setSearchResults(basicResults);
        setLoading(false);
        return;
      }
      
      // Get expanded search terms
      const expanded = expandSearchTerms(searchQuery);
      
      // Search with main query first, then expanded terms
      const results = await expandedSearch(searchQuery, expanded);
      
      // Also search ad-free sources in parallel
      const adFreeSearchResults = await searchAllAdFreeSources(searchQuery);
      
      if (results.length === 0 && adFreeSearchResults.length === 0) {
        setError(`No recipes found for "${searchQuery}". Try searching for: egg, toast, tea, sandwich, pasta, chicken, or soup.`);
        return;
      }
      
      setSearchResults(results);
      setAdFreeResults(adFreeSearchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAdFreeRecipe = async (source: RecipeSourceType, url: string) => {
    setLoadingAdFreeUrl(url);
    try {
      const recipe = await fetchRecipeFromSource(source, url);
      if (recipe) {
        onImport(recipe);
      } else {
        setError(`Failed to load recipe from ${source.name}. Please try another recipe.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipe');
    } finally {
      setLoadingAdFreeUrl(null);
    }
  };

  const handleSelectRecipe = (meal: any) => {
    const standardRecipe = transformToStandardRecipe(meal);
    onImport(standardRecipe);
  };

  const basicRecipeTitles = getBasicRecipeTitles();

  const handleBasicRecipeClick = (title: string) => {
    const recipes = searchBasicRecipes(title);
    if (recipes.length > 0) {
      onImport(recipes[0]);
    }
  };

  return (
    <div className="recipe-importer">
      <h2>Search for a Recipe</h2>
      <p className="importer-description">
        ✨ Choose a category, speak what you want, or pick an easy recipe below
      </p>

      {/* I Don't Know What to Make Button */}
      <div className="dont-know-section">
        <button onClick={handleDontKnow} className="btn-dont-know">
          🤔 I Don't Know What to Make
        </button>
      </div>
      
      {showCategories && (
        <div className="category-cards">
          <h3 className="category-title">What Type of Food?</h3>
          <div className="category-grid">
            <button onClick={() => handleCategoryClick('breakfast', 'eggs')} className="category-card">
              <div className="category-icon">🍳</div>
              <div className="category-name">Breakfast</div>
              <div className="category-examples">Eggs • Toast • Cereal</div>
            </button>
            <button onClick={() => handleCategoryClick('lunch', 'sandwich')} className="category-card">
              <div className="category-icon">🥪</div>
              <div className="category-name">Lunch</div>
              <div className="category-examples">Sandwich • Soup</div>
            </button>
            <button onClick={() => handleCategoryClick('dinner', 'chicken')} className="category-card">
              <div className="category-icon">🍝</div>
              <div className="category-name">Dinner</div>
              <div className="category-examples">Pasta • Chicken</div>
            </button>
            <button onClick={() => handleCategoryClick('drinks', 'tea')} className="category-card">
              <div className="category-icon">🍵</div>
              <div className="category-name">Drinks</div>
              <div className="category-examples">Tea • Coffee</div>
            </button>
            <button onClick={() => handleCategoryClick('snacks', 'toast')} className="category-card">
              <div className="category-icon">🍪</div>
              <div className="category-name">Snacks</div>
              <div className="category-examples">Toast • Simple foods</div>
            </button>
            <button onClick={() => setShowCategories(false)} className="category-card category-card-skip">
              <div className="category-icon">🔍</div>
              <div className="category-name">Search Myself</div>
              <div className="category-examples">Type or speak</div>
            </button>
          </div>
        </div>
      )}
      
      {/* Basic Recipes - Quick Access */}
      {!showCategories && (
      <>
        <div className="basic-recipes-quick-access">
          <h3>🍳 Quick Start - Basic Recipes:</h3>
          <div className="basic-recipe-buttons">
            {basicRecipeTitles.map((title) => (
              <button
                key={title}
                onClick={() => handleBasicRecipeClick(title)}
                className="basic-recipe-btn"
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        <div className="or-divider">
          <span>OR</span>
        </div>
      </>
      )}
      
      {/* Image Upload Section */}
      <div className="image-upload-section">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="image-input"
          id="image-upload"
          disabled={imageProcessing}
        />
        <label htmlFor="image-upload" className="image-upload-label">
          <span className="camera-icon">📷</span>
          <span>{uploadedImage ? 'Change Photo' : 'Take Photo of Food Package'}</span>
        </label>
        
        {uploadedImage && (
          <div className="uploaded-image-preview">
            <img src={uploadedImage} alt="Uploaded meal" className="preview-image" />
            <button onClick={handleClearImage} className="clear-image-btn" aria-label="Clear image">
              ✕
            </button>
          </div>
        )}

        {imageFoodMatches.length > 0 && (
          <div className="image-food-matches">
            <p className="match-label">Found in photo:</p>
            <div className="match-pills">
              {imageFoodMatches.map((food) => (
                <button
                  key={food}
                  className="match-pill"
                  onClick={() => setSearchQuery(food)}
                  type="button"
                >
                  {food}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {imageProcessing && (
          <div className="processing-message">
            <span className="spinner">⏳</span>
            Reading text from food package...
          </div>
        )}
      </div>

      {/* Text Search Section */}
      <div className="search-divider">
        <span>OR</span>
      </div>
      
      <div className="importer-input-group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={showManualInput ? "What food do you see?" : "Type food name (chicken, pasta, soup)"}
          className="search-input"
        />
        <button
          onClick={handleVoiceInput}
          disabled={loading || imageProcessing || isListening}
          className="btn-voice"
          title="Speak what you want to make"
        >
          {isListening ? '🎤 Listening...' : '🎤 Speak'}
        </button>
        <button
          onClick={handleSearch}
          disabled={loading || imageProcessing}
          className="btn-primary"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Found {searchResults.length} recipe{searchResults.length > 1 ? 's' : ''}</h3>
          <div className="results-grid">
            {searchResults.map((meal) => (
              <div key={meal.idMeal} className="result-card">
                {meal.strMealThumb && (
                  <img src={meal.strMealThumb} alt={meal.strMeal} className="result-thumb" />
                )}
                <div className="result-content">
                  <h4>{meal.strMeal}</h4>
                  {meal.strCategory && <p className="result-category">{meal.strCategory}</p>}
                  <button
                    onClick={() => handleSelectRecipe(meal)}
                    className="btn-secondary"
                  >
                    Use This Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adFreeResults.length > 0 && (
        <div className="adfree-results">
          <h3>📢 Ad-Free Recipe Sources</h3>
          <p className="adfree-description">These sites have clean, simple recipes without ads:</p>
          
          {adFreeResults.map((sourceResult) => (
            <div key={sourceResult.source} className="adfree-source-group">
              <h4>{sourceResult.source}</h4>
              <div className="adfree-results-list">
                {sourceResult.results.map((result) => (
                  <div key={result.url} className="adfree-result-item">
                    <div className="adfree-result-title">{result.title}</div>
                    <button
                      onClick={() => {
                        const source = recipeSources.find(s => s.name === sourceResult.source);
                        if (source) {
                          handleSelectAdFreeRecipe(source, result.url);
                        }
                      }}
                      disabled={loadingAdFreeUrl === result.url}
                      className="btn-secondary btn-small"
                    >
                      {loadingAdFreeUrl === result.url ? "Loading..." : "Use Recipe"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="search-tips">
        <h4>How to Use:</h4>
        <ul>
          <li><strong>1. Don't know what to make?</strong> Click "I Don't Know What to Make" to get a list of meal ideas</li>
          <li><strong>2. Choose a category:</strong> Pick from Breakfast, Lunch, Dinner, Drinks, or Snacks</li>
          <li><strong>3. Take a photo:</strong> Take a picture of the food box/package and we'll try to find recipes for it</li>
          <li><strong>4. Type or speak:</strong> Search by typing or speaking the food name</li>
        </ul>
      </div>
    </div>
  );
}

export default RecipeImporter;
