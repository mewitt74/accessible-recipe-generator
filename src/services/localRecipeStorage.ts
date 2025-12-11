/**
 * Local Recipe Storage Service
 * Stores user-imported and created recipes locally using localStorage
 */

import { Recipe } from '../types';

const STORAGE_KEY = 'accessible_recipes_local';

interface StoredRecipes {
  recipes: Recipe[];
  lastUpdated: string;
}

/**
 * Get all locally stored recipes
 */
export function getLocalRecipes(): Recipe[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const data: StoredRecipes = JSON.parse(stored);
    return data.recipes || [];
  } catch (error) {
    console.error('Error loading local recipes:', error);
    return [];
  }
}

/**
 * Save a recipe to local storage
 */
export function saveLocalRecipe(recipe: Recipe): void {
  try {
    const recipes = getLocalRecipes();
    
    // Check if recipe already exists (by ID)
    const existingIndex = recipes.findIndex(r => r.id === recipe.id);
    
    if (existingIndex >= 0) {
      // Update existing recipe
      recipes[existingIndex] = recipe;
    } else {
      // Add new recipe
      recipes.push(recipe);
    }
    
    const data: StoredRecipes = {
      recipes,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Recipe saved to local storage:', recipe.title);
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw new Error('Failed to save recipe locally');
  }
}

/**
 * Delete a recipe from local storage
 */
export function deleteLocalRecipe(recipeId: string): void {
  try {
    const recipes = getLocalRecipes();
    const filtered = recipes.filter(r => r.id !== recipeId);
    
    const data: StoredRecipes = {
      recipes: filtered,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Recipe deleted from local storage:', recipeId);
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw new Error('Failed to delete recipe');
  }
}

/**
 * Get a single recipe by ID
 */
export function getLocalRecipeById(recipeId: string): Recipe | null {
  const recipes = getLocalRecipes();
  return recipes.find(r => r.id === recipeId) || null;
}

/**
 * Search local recipes by title or ingredients
 */
export function searchLocalRecipes(query: string): Recipe[] {
  if (!query.trim()) return getLocalRecipes();
  
  const lowerQuery = query.toLowerCase().trim();
  const recipes = getLocalRecipes();
  
  return recipes.filter(recipe => {
    // Search in title
    if (recipe.title.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in ingredients
    for (const ing of recipe.ingredients) {
      if (ing.name.toLowerCase().includes(lowerQuery)) return true;
    }
    
    return false;
  });
}

/**
 * Check if a recipe is stored locally
 */
export function isLocalRecipe(recipeId: string): boolean {
  return recipeId.startsWith('imported_') || recipeId.startsWith('local_');
}

/**
 * Export all local recipes as JSON
 */
export function exportLocalRecipes(): string {
  const recipes = getLocalRecipes();
  return JSON.stringify(recipes, null, 2);
}

/**
 * Import recipes from JSON
 */
export function importLocalRecipesFromJson(jsonString: string): number {
  try {
    const imported = JSON.parse(jsonString);
    const recipes = Array.isArray(imported) ? imported : [imported];
    
    let count = 0;
    for (const recipe of recipes) {
      if (recipe.title && recipe.ingredients && recipe.steps) {
        // Generate new ID to avoid conflicts
        const newRecipe = {
          ...recipe,
          id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        saveLocalRecipe(newRecipe);
        count++;
      }
    }
    
    return count;
  } catch (error) {
    console.error('Error importing recipes:', error);
    throw new Error('Failed to import recipes from JSON');
  }
}

/**
 * Get count of local recipes
 */
export function getLocalRecipeCount(): number {
  return getLocalRecipes().length;
}
