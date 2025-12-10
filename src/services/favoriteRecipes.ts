/**
 * Favorite Recipes Service
 * Saves and loads favorite recipes using localStorage
 * No login required - works completely offline
 */

import type { Recipe } from '../types';

const STORAGE_KEY = 'favorite_recipes';
const RECENT_KEY = 'recent_recipes';
const MAX_RECENT = 5;

export interface SavedRecipe extends Recipe {
  savedAt: string;
  lastCooked?: string;
  timesCooked: number;
}

/**
 * Get all saved favorite recipes
 */
export function getFavoriteRecipes(): SavedRecipe[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading favorite recipes:', error);
    return [];
  }
}

/**
 * Save a recipe to favorites
 */
export function saveToFavorites(recipe: Recipe): SavedRecipe {
  const favorites = getFavoriteRecipes();
  
  // Check if already exists (by title)
  const existingIndex = favorites.findIndex(
    f => f.title.toLowerCase() === recipe.title.toLowerCase()
  );
  
  const savedRecipe: SavedRecipe = {
    ...recipe,
    savedAt: new Date().toISOString(),
    timesCooked: existingIndex >= 0 ? favorites[existingIndex].timesCooked : 0,
    lastCooked: existingIndex >= 0 ? favorites[existingIndex].lastCooked : undefined
  };
  
  if (existingIndex >= 0) {
    // Update existing
    favorites[existingIndex] = savedRecipe;
  } else {
    // Add new
    favorites.unshift(savedRecipe);
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorite recipe:', error);
  }
  
  return savedRecipe;
}

/**
 * Remove a recipe from favorites
 */
export function removeFromFavorites(title: string): void {
  const favorites = getFavoriteRecipes();
  const filtered = favorites.filter(
    f => f.title.toLowerCase() !== title.toLowerCase()
  );
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing favorite recipe:', error);
  }
}

/**
 * Check if a recipe is in favorites
 */
export function isFavorite(title: string): boolean {
  const favorites = getFavoriteRecipes();
  return favorites.some(f => f.title.toLowerCase() === title.toLowerCase());
}

/**
 * Mark a recipe as cooked (updates stats)
 */
export function markAsCooked(title: string): void {
  const favorites = getFavoriteRecipes();
  const index = favorites.findIndex(
    f => f.title.toLowerCase() === title.toLowerCase()
  );
  
  if (index >= 0) {
    favorites[index].timesCooked += 1;
    favorites[index].lastCooked = new Date().toISOString();
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error updating recipe stats:', error);
    }
  }
  
  // Also add to recent recipes
  addToRecent(title);
}

/**
 * Get recently cooked recipes
 */
export function getRecentRecipes(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading recent recipes:', error);
    return [];
  }
}

/**
 * Add a recipe to recent list
 */
function addToRecent(title: string): void {
  let recent = getRecentRecipes();
  
  // Remove if already exists
  recent = recent.filter(r => r.toLowerCase() !== title.toLowerCase());
  
  // Add to front
  recent.unshift(title);
  
  // Keep only MAX_RECENT
  recent = recent.slice(0, MAX_RECENT);
  
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  } catch (error) {
    console.error('Error saving recent recipe:', error);
  }
}

/**
 * Clear all favorites (use with caution!)
 */
export function clearAllFavorites(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RECENT_KEY);
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
}
