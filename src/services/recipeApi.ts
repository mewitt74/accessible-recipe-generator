import { Recipe, Ingredient, Step } from '../types';
import { convertTemperatureText } from '../utils/temperatureConverter';

interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strInstructions: string;
  strMealThumb?: string;
  [key: string]: string | undefined;
}

interface MealDBResponse {
  meals: MealDBRecipe[] | null;
}

/**
 * Search for recipes with expanded criteria
 * - Searches by main ingredient or dish name
 * - Tries multiple search terms for better results
 * - Uses TheMealDB free API (no key required)
 */
export async function searchRecipes(query: string): Promise<MealDBRecipe[]> {
  try {
    // Primary search
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data: MealDBResponse = await response.json();
    const results = data.meals || [];
    
    // If we found results, return them
    if (results.length > 0) {
      return results;
    }
    
    // If no results, try searching by first ingredient
    const ingredientUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(query)}`;
    const ingredientResponse = await fetch(ingredientUrl);
    
    if (ingredientResponse.ok) {
      const ingredientData = await ingredientResponse.json();
      if (ingredientData.meals && ingredientData.meals.length > 0) {
        // Get full details for each meal (up to 50 results)
        const fullMeals = await Promise.all(
          ingredientData.meals.slice(0, 50).map((meal: any) => 
            getMealDetails(meal.idMeal)
          )
        );
        return fullMeals.filter((meal): meal is MealDBRecipe => meal !== null);
      }
    }
    
    return [];
  } catch (error) {
    console.error('Recipe search error:', error);
    throw new Error('Failed to search for recipes. Please try again.');
  }
}

/**
 * Get full meal details by ID
 */
async function getMealDetails(mealId: string): Promise<MealDBRecipe | null> {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.meals?.[0] || null;
  } catch (error) {
    console.error(`Error getting meal details for ${mealId}:`, error);
    return null;
  }
}

/**
 * Search with multiple related terms
 * Called when initial search returns no results
 */
export async function expandedSearch(_query: string, expandedTerms: string[]): Promise<MealDBRecipe[]> {
  const allResults: MealDBRecipe[] = [];
  const seenIds = new Set<string>();
  
  // Try each expanded search term
  for (const term of expandedTerms) {
    try {
      const results = await searchRecipes(term);
      for (const meal of results) {
        if (!seenIds.has(meal.idMeal)) {
          seenIds.add(meal.idMeal);
          allResults.push(meal);
        }
      }
    } catch (error) {
      // Continue with next term if one fails
      continue;
    }
  }
  
  return allResults;
}

/**
 * Transform MealDB recipe to our standardized aphasia-friendly format
 */
export function transformToStandardRecipe(meal: MealDBRecipe): Recipe {
  // Extract ingredients (MealDB has strIngredient1-20 and strMeasure1-20)
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        amount: measure?.trim() || 'as needed',
        name: ingredient.trim(),
        note: undefined,
      });
    }
  }

  // Split instructions into simple sentences
  const rawInstructions = meal.strInstructions || '';
  const steps = simplifyInstructions(rawInstructions);

  return {
    title: meal.strMeal?.trim() || meal.strCategory || 'Simple Recipe',
    subtitle: meal.strCategory,
    servings: 4, // Default, MealDB doesn't provide
    prepTimeMinutes: 15, // Default estimate
    cookTimeMinutes: 30, // Default estimate
    calories: undefined,
    ingredients: ingredients.slice(0, 15), // Max 15 per requirements
    equipment: [], // MealDB doesn't provide, can be inferred later
    steps,
    tips: undefined,
  };
}

/**
 * Simplify instructions into aphasia-friendly single-sentence steps
 * Enforces: ONE sentence per step, max 150 chars, simple language
 */
function simplifyInstructions(text: string): Step[] {
  // Remove excessive newlines and clean up
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Split by numbered steps first (e.g., "1.", "Step 1:", etc.)
  const numberedSteps = cleaned.match(/(\d+[\.)]\s+[^\n]+)/g);
  
  let sentences: string[] = [];
  
  if (numberedSteps && numberedSteps.length >= 3) {
    // Already numbered - use those
    sentences = numberedSteps.map(s => s.replace(/^\d+[\.)]\s*/, '').trim());
  } else {
    // Split by periods, newlines, or "STEP" markers
    sentences = cleaned
      .split(/\.\s+(?=[A-Z])|STEP \d+:|[\n]{2,}/)
      .map(s => s.trim())
      .filter(s => s.length > 10); // Filter out very short fragments
  }

  // Further split compound sentences (with "then", "and", etc.)
  const simplifiedSentences: string[] = [];
  for (const sentence of sentences) {
    const parts = sentence.split(/\s+(?:then|and then)\s+/i);
    simplifiedSentences.push(...parts.map(p => p.trim()));
  }

  // Limit to 150 characters and create steps
  const steps: Step[] = simplifiedSentences
    .filter(s => s.length > 0)
    .map((instruction, idx) => {
      // Truncate if needed
      let text = instruction;
      if (text.length > 150) {
        text = text.substring(0, 147) + '...';
      }
      
      // Ensure it ends with a period
      if (!text.match(/[.!?]$/)) {
        text += '.';
      }
      
      // Convert Celsius to Fahrenheit
      text = convertTemperatureText(text);

      // Auto-categorize by keywords
      let section: Step['section'] = 'Prep';
      const lower = text.toLowerCase();
      
      if (lower.includes('preheat') || lower.includes('prepare')) {
        section = 'Prep';
      } else if (lower.includes('cook') || lower.includes('bake') || lower.includes('fry') || lower.includes('boil') || lower.includes('heat')) {
        section = 'Cook Main';
      } else if (idx > simplifiedSentences.length * 0.7) {
        section = 'Finish & Serve';
      }

      // Generate short title from first 3-5 words
      const words = text.split(' ').slice(0, 4).join(' ');
      const shortTitle = words.charAt(0).toUpperCase() + words.slice(1);

      return {
        section,
        shortTitle,
        instruction: text,
      };
    })
    .slice(0, 12); // Max 12 steps per requirements

  // Ensure minimum 3 steps
  if (steps.length < 3) {
    // Pad with generic steps if needed
    while (steps.length < 3) {
      steps.push({
        section: 'Finish & Serve',
        shortTitle: 'Serve the dish',
        instruction: 'Serve the dish and enjoy.',
      });
    }
  }

  return steps;
}
