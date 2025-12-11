/**
 * Meal Suggestions Service
 * Provides category-specific recipe suggestions with rotation
 * Ensures users get fresh options and avoids showing recently used recipes
 */

import { Recipe } from '../types';
import { basicRecipes, searchBasicRecipes } from './basicRecipes';

// Storage key for tracking recently shown recipes
const RECENT_SUGGESTIONS_KEY = 'recipe_recent_suggestions';
const MAX_RECENT_HISTORY = 10;

// Category definitions with basic recipes and expanded options
export interface CategoryConfig {
  id: string;
  name: string;
  emoji: string;
  description: string;
  basicRecipes: string[]; // Recipe IDs from basicRecipes
  expandedOptions: Array<{
    emoji: string;
    title: string;
    search: string;
  }>;
}

export const MEAL_CATEGORIES: CategoryConfig[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    emoji: '🍳',
    description: 'Morning meals',
    basicRecipes: ['basic-fried-egg', 'basic-scrambled-eggs', 'basic-toast', 'basic-oatmeal'],
    expandedOptions: [
      { emoji: '🍳', title: 'Fried Egg', search: 'fried egg' },
      { emoji: '🥚', title: 'Scrambled Eggs', search: 'scrambled eggs' },
      { emoji: '🍞', title: 'Toast', search: 'toast' },
      { emoji: '🥣', title: 'Oatmeal', search: 'oatmeal' },
      { emoji: '🥣', title: 'Cereal', search: 'cereal' },
      { emoji: '🥞', title: 'Pancakes', search: 'pancakes' },
      { emoji: '🧇', title: 'Waffles', search: 'waffles' },
      { emoji: '🥓', title: 'Bacon', search: 'bacon' },
      { emoji: '🍩', title: 'French Toast', search: 'french toast' },
      { emoji: '🥯', title: 'Bagel', search: 'bagel' },
    ]
  },
  {
    id: 'lunch',
    name: 'Lunch',
    emoji: '🥪',
    description: 'Midday meals',
    basicRecipes: ['basic-grilled-cheese', 'basic-instant-noodles'],
    expandedOptions: [
      { emoji: '🥪', title: 'Sandwich', search: 'sandwich' },
      { emoji: '🧀', title: 'Grilled Cheese', search: 'grilled cheese' },
      { emoji: '🍲', title: 'Soup', search: 'soup' },
      { emoji: '🥗', title: 'Salad', search: 'salad' },
      { emoji: '🌯', title: 'Wrap', search: 'wrap' },
      { emoji: '🍜', title: 'Noodles', search: 'noodles' },
      { emoji: '🥙', title: 'Pita Pocket', search: 'pita' },
      { emoji: '🍕', title: 'Pizza Slice', search: 'pizza' },
      { emoji: '🌮', title: 'Quesadilla', search: 'quesadilla' },
      { emoji: '🥡', title: 'Leftovers', search: 'easy lunch' },
    ]
  },
  {
    id: 'dinner',
    name: 'Dinner',
    emoji: '🍝',
    description: 'Evening meals',
    basicRecipes: ['basic-pasta', 'basic-rice', 'basic-grilled-cheese'],
    expandedOptions: [
      { emoji: '🍝', title: 'Pasta', search: 'pasta' },
      { emoji: '🍗', title: 'Chicken', search: 'chicken' },
      { emoji: '🥘', title: 'Stir Fry', search: 'stir fry' },
      { emoji: '🌮', title: 'Tacos', search: 'tacos' },
      { emoji: '🍕', title: 'Pizza', search: 'pizza' },
      { emoji: '🍖', title: 'Pork Chop', search: 'pork chop' },
      { emoji: '🐟', title: 'Fish', search: 'fish' },
      { emoji: '🍛', title: 'Curry', search: 'curry' },
      { emoji: '🥩', title: 'Steak', search: 'steak' },
      { emoji: '🍲', title: 'Stew', search: 'stew' },
    ]
  },
  {
    id: 'snacks',
    name: 'Snacks',
    emoji: '🍪',
    description: 'Quick bites',
    basicRecipes: ['basic-toast', 'basic-instant-noodles'],
    expandedOptions: [
      { emoji: '🍞', title: 'Toast', search: 'toast' },
      { emoji: '🧀', title: 'Cheese & Crackers', search: 'cheese' },
      { emoji: '🍿', title: 'Popcorn', search: 'popcorn' },
      { emoji: '🥜', title: 'Nuts', search: 'nuts snack' },
      { emoji: '🍎', title: 'Fruit', search: 'fruit' },
      { emoji: '🥕', title: 'Veggies & Dip', search: 'vegetables' },
      { emoji: '🥨', title: 'Pretzels', search: 'pretzels' },
      { emoji: '🍌', title: 'Banana', search: 'banana' },
      { emoji: '🥤', title: 'Smoothie', search: 'smoothie' },
      { emoji: '🧁', title: 'Muffin', search: 'muffin' },
    ]
  },
  {
    id: 'drinks',
    name: 'Drinks',
    emoji: '🍵',
    description: 'Hot & cold beverages',
    basicRecipes: ['basic-tea', 'basic-instant-coffee'],
    expandedOptions: [
      { emoji: '🍵', title: 'Tea', search: 'tea' },
      { emoji: '☕', title: 'Coffee', search: 'coffee' },
      { emoji: '🥛', title: 'Milk', search: 'milk' },
      { emoji: '🧃', title: 'Juice', search: 'juice' },
      { emoji: '🍫', title: 'Hot Cocoa', search: 'hot chocolate' },
      { emoji: '🥤', title: 'Smoothie', search: 'smoothie' },
      { emoji: '🍋', title: 'Lemonade', search: 'lemonade' },
      { emoji: '🧊', title: 'Iced Tea', search: 'iced tea' },
    ]
  }
];

/**
 * Get recently shown recipe suggestions from storage
 */
function getRecentSuggestions(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SUGGESTIONS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading recent suggestions:', e);
  }
  return [];
}

/**
 * Add recipes to recent suggestions list
 */
function addToRecentSuggestions(searchTerms: string[]): void {
  try {
    const recent = getRecentSuggestions();
    const updated = [...searchTerms, ...recent].slice(0, MAX_RECENT_HISTORY);
    localStorage.setItem(RECENT_SUGGESTIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving recent suggestions:', e);
  }
}

/**
 * Get category by ID
 */
export function getCategoryById(categoryId: string): CategoryConfig | undefined {
  return MEAL_CATEGORIES.find(c => c.id === categoryId);
}

/**
 * Get basic recipes for a category
 */
export function getBasicRecipesForCategory(categoryId: string): Recipe[] {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  
  // Get basic recipes that match this category
  const categoryRecipes = basicRecipes.filter(recipe => 
    recipe.categories?.includes(categoryId) || 
    category.basicRecipes.includes(recipe.id || '')
  );
  
  // Also search by category name
  const searchResults = searchBasicRecipes(categoryId);
  
  // Combine and deduplicate
  const allRecipes = [...categoryRecipes, ...searchResults];
  const uniqueRecipes = allRecipes.filter((recipe, index, self) => 
    index === self.findIndex(r => r.id === recipe.id)
  );
  
  return uniqueRecipes;
}

/**
 * Get random suggestions for a category, avoiding recently shown
 */
export function getRandomSuggestionsForCategory(
  categoryId: string, 
  count: number = 5
): Array<{ emoji: string; title: string; search: string }> {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  
  const recentSuggestions = getRecentSuggestions();
  
  // Filter out recently shown options
  const availableOptions = category.expandedOptions.filter(
    opt => !recentSuggestions.includes(opt.search)
  );
  
  // If not enough available, use all options
  const optionsToUse = availableOptions.length >= count 
    ? availableOptions 
    : category.expandedOptions;
  
  // Shuffle and take the requested count
  const shuffled = [...optionsToUse].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  
  // Record these as shown
  addToRecentSuggestions(selected.map(s => s.search));
  
  return selected;
}

/**
 * Get all options for a category (for "see all" view)
 */
export function getAllOptionsForCategory(
  categoryId: string
): Array<{ emoji: string; title: string; search: string }> {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  return category.expandedOptions;
}

/**
 * Clear recent suggestions history
 */
export function clearRecentSuggestions(): void {
  localStorage.removeItem(RECENT_SUGGESTIONS_KEY);
}

/**
 * Get time-appropriate category suggestion
 */
export function getTimeBasedCategory(): CategoryConfig {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 11) {
    return MEAL_CATEGORIES.find(c => c.id === 'breakfast')!;
  } else if (hour >= 11 && hour < 14) {
    return MEAL_CATEGORIES.find(c => c.id === 'lunch')!;
  } else if (hour >= 14 && hour < 17) {
    return MEAL_CATEGORIES.find(c => c.id === 'snacks')!;
  } else if (hour >= 17 && hour < 21) {
    return MEAL_CATEGORIES.find(c => c.id === 'dinner')!;
  } else {
    return MEAL_CATEGORIES.find(c => c.id === 'snacks')!;
  }
}

/**
 * Get greeting based on time of day
 */
export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return '☀️ Good Morning!';
  } else if (hour >= 12 && hour < 17) {
    return '🌤️ Good Afternoon!';
  } else if (hour >= 17 && hour < 21) {
    return '🌅 Good Evening!';
  } else {
    return '🌙 Late Night?';
  }
}
