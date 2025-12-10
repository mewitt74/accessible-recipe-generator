import { useState, useRef } from "react";
import { Recipe } from "../types";
import { transformToStandardRecipe, expandedSearch } from "../services/recipeApi";
import { getFoodNameFromImage, expandSearchTerms } from "../services/imageRecognition";
import { searchAllAdFreeSources, fetchRecipeFromSource, recipeSources } from "../services/recipeSources";
import type { RecipeSource as RecipeSourceType } from "../services/recipeSources";

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

      // Try to identify the food
      const result = await getFoodNameFromImage(file);

      if (result.foodNames && result.foodNames.length > 0) {
        // Store the identified food matches
        setImageFoodMatches(result.foodNames);
        setShowManualInput(true);
        setImageProcessing(false);
        
        // Use first match as search query
        const primaryFood = result.foodNames[0];
        setSearchQuery(primaryFood);
        
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
        setShowManualInput(true);
        setImageProcessing(false);
        setError('Could not identify the food from the photo. Please type what you see.');
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
      // Get expanded search terms
      const expanded = expandSearchTerms(searchQuery);
      
      // Search with main query first, then expanded terms
      const results = await expandedSearch(searchQuery, expanded);
      
      // Also search ad-free sources in parallel
      const adFreeSearchResults = await searchAllAdFreeSources(searchQuery);
      
      if (results.length === 0 && adFreeSearchResults.length === 0) {
        setError(`No recipes found for "${searchQuery}". Try searching for: chicken, beef, fish, pasta, soup, or rice.`);
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

  return (
    <div className="recipe-importer">
      <h2>Search for a Recipe</h2>
      <p className="importer-description">
        Type to search OR take a photo of your meal package
      </p>
      
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
          <span>{uploadedImage ? 'Change Photo' : 'Take Photo of Meal'}</span>
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
            Processing image...
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
          <li><strong>Take a Photo:</strong> Use your phone camera to take a picture of the meal package or box</li>
          <li><strong>Or Type:</strong> Search by typing food names like "chicken", "pasta", "soup", "stew"</li>
          <li><strong>Get Easy Instructions:</strong> All recipes are simplified for aphasia/TBI patients</li>
          <li><strong>Ad-Free Options:</strong> Recipes from RecipesWithoutAds.com and Recipe-Free.com are automatically searched</li>
          <li><strong>Print Cards:</strong> Instructions follow one-sentence-per-step format with large text</li>
        </ul>
        
        <h4>About Ad-Free Recipe Sources:</h4>
        <ul>
          <li><strong>RecipesWithoutAds.com:</strong> Clean recipe site specifically designed without advertisements</li>
          <li><strong>Recipe-Free.com:</strong> Simple, ad-free recipe collection focused on ease-of-use</li>
          <li>All recipes are automatically simplified to match our accessibility standards</li>
        </ul>
      </div>
    </div>
  );
}

export default RecipeImporter;
