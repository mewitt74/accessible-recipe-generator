/**
 * AI Recipe Suggestions Service
 * Smart suggestions based on ingredients, preferences, and history
 */

import type { Recipe } from '../types';
import { getCookingStats } from './cookingHistory';

export interface SuggestionReason {
  type: 'ingredient' | 'history' | 'popular' | 'easy' | 'quick' | 'healthy';
  text: string;
}

export interface RecipeSuggestion {
  recipe: Recipe;
  score: number;
  reasons: SuggestionReason[];
}

// Simple recipe database for suggestions
const SUGGESTION_RECIPES: Recipe[] = [
  {
    id: 'scrambled-eggs',
    title: 'Simple Scrambled Eggs',
    servings: 2,
    prepTimeMinutes: 2,
    cookTimeMinutes: 5,
    difficulty: 'Easy',
    calories: 180,
    ingredients: [
      { amount: '4', name: 'eggs' },
      { amount: '2 tbsp', name: 'butter' },
      { amount: 'pinch', name: 'salt' },
      { amount: 'pinch', name: 'pepper' },
    ],
    equipment: ['Non-stick pan', 'Spatula', 'Bowl', 'Fork'],
    steps: [
      { stepNumber: 1, section: 'Prep', instruction: 'Crack eggs into a bowl and beat with a fork until mixed.' },
      { stepNumber: 2, section: 'Cook Main', instruction: 'Melt butter in a non-stick pan over medium-low heat.' },
      { stepNumber: 3, section: 'Cook Main', instruction: 'Pour in eggs. Let them sit for 20 seconds.' },
      { stepNumber: 4, section: 'Cook Main', instruction: 'Gently push eggs from edges to center with spatula.' },
      { stepNumber: 5, section: 'Finish & Serve', instruction: 'When eggs are soft but not runny, add salt and pepper. Serve!' },
    ],
    tips: ['Don\'t overcook - eggs continue cooking after you remove from heat', 'Add cheese for extra flavor'],
    categories: ['breakfast', 'quick', 'easy'],
  },
  {
    id: 'grilled-cheese',
    title: 'Classic Grilled Cheese',
    servings: 1,
    prepTimeMinutes: 2,
    cookTimeMinutes: 6,
    difficulty: 'Easy',
    calories: 350,
    ingredients: [
      { amount: '2 slices', name: 'bread' },
      { amount: '2 slices', name: 'cheese' },
      { amount: '1 tbsp', name: 'butter' },
    ],
    equipment: ['Frying pan', 'Spatula'],
    steps: [
      { stepNumber: 1, section: 'Prep', instruction: 'Butter one side of each bread slice.' },
      { stepNumber: 2, section: 'Cook Main', instruction: 'Place one bread slice butter-side down in cold pan.' },
      { stepNumber: 3, section: 'Cook Main', instruction: 'Add cheese slices on top of the bread.' },
      { stepNumber: 4, section: 'Cook Main', instruction: 'Put second bread slice on top, butter-side up.' },
      { stepNumber: 5, section: 'Cook Main', instruction: 'Turn heat to medium. Cook 3 minutes until golden.' },
      { stepNumber: 6, section: 'Finish & Serve', instruction: 'Flip carefully. Cook 2-3 more minutes. Serve hot!' },
    ],
    tips: ['Low and slow = better melting', 'Try adding tomato or ham'],
    categories: ['lunch', 'quick', 'easy', 'comfort'],
  },
  {
    id: 'pasta-butter',
    title: 'Buttered Pasta',
    servings: 2,
    prepTimeMinutes: 2,
    cookTimeMinutes: 12,
    difficulty: 'Easy',
    calories: 380,
    ingredients: [
      { amount: '8 oz', name: 'pasta' },
      { amount: '3 tbsp', name: 'butter' },
      { amount: '1/4 cup', name: 'parmesan cheese' },
      { amount: 'to taste', name: 'salt' },
      { amount: 'to taste', name: 'pepper' },
    ],
    equipment: ['Large pot', 'Colander', 'Spoon'],
    steps: [
      { stepNumber: 1, section: 'Prep', instruction: 'Fill a large pot with water. Add a pinch of salt. Bring to boil.' },
      { stepNumber: 2, section: 'Cook Main', instruction: 'Add pasta to boiling water. Stir once.' },
      { stepNumber: 3, section: 'Cook Main', instruction: 'Cook for 10-12 minutes until pasta is soft.' },
      { stepNumber: 4, section: 'Cook Main', instruction: 'Drain pasta in colander. Save 1/4 cup pasta water.' },
      { stepNumber: 5, section: 'Finish & Serve', instruction: 'Put pasta back in pot. Add butter and cheese. Stir until melted.' },
      { stepNumber: 6, section: 'Finish & Serve', instruction: 'Add pasta water if too dry. Season with salt and pepper.' },
    ],
    tips: ['Save pasta water - it helps sauce stick to pasta', 'Try adding garlic or herbs'],
    categories: ['dinner', 'quick', 'easy', 'comfort'],
  },
  {
    id: 'pb-sandwich',
    title: 'Peanut Butter Sandwich',
    servings: 1,
    prepTimeMinutes: 2,
    cookTimeMinutes: 0,
    difficulty: 'Very Easy',
    calories: 350,
    ingredients: [
      { amount: '2 slices', name: 'bread' },
      { amount: '2 tbsp', name: 'peanut butter' },
      { amount: '1 tbsp', name: 'jelly or honey', note: 'optional' },
    ],
    equipment: ['Knife', 'Plate'],
    steps: [
      { stepNumber: 1, section: 'Prep', instruction: 'Place two slices of bread on a plate.' },
      { stepNumber: 2, section: 'Prep', instruction: 'Spread peanut butter on one slice.' },
      { stepNumber: 3, section: 'Prep', instruction: 'If using jelly, spread it on the other slice.' },
      { stepNumber: 4, section: 'Finish & Serve', instruction: 'Put the two slices together. Cut in half if you want.' },
    ],
    tips: ['Add banana slices for extra nutrition', 'Toast the bread first for crunch'],
    categories: ['lunch', 'snack', 'quick', 'easy', 'no-cook'],
  },
  {
    id: 'oatmeal',
    title: 'Simple Oatmeal',
    servings: 1,
    prepTimeMinutes: 1,
    cookTimeMinutes: 5,
    difficulty: 'Easy',
    calories: 300,
    ingredients: [
      { amount: '1/2 cup', name: 'oats' },
      { amount: '1 cup', name: 'water or milk' },
      { amount: 'pinch', name: 'salt' },
      { amount: '1 tbsp', name: 'honey or sugar' },
    ],
    equipment: ['Saucepan', 'Spoon', 'Bowl'],
    steps: [
      { stepNumber: 1, section: 'Cook Main', instruction: 'Pour water or milk into a saucepan. Add a pinch of salt.' },
      { stepNumber: 2, section: 'Cook Main', instruction: 'Bring to a boil over medium heat.' },
      { stepNumber: 3, section: 'Cook Main', instruction: 'Add oats. Stir well.' },
      { stepNumber: 4, section: 'Cook Main', instruction: 'Reduce heat to low. Cook 5 minutes, stirring occasionally.' },
      { stepNumber: 5, section: 'Finish & Serve', instruction: 'Pour into a bowl. Add honey or sugar. Enjoy!' },
    ],
    tips: ['Add fruit, nuts, or cinnamon for variety', 'Use milk instead of water for creamier oatmeal'],
    categories: ['breakfast', 'quick', 'easy', 'healthy'],
  },
  {
    id: 'quesadilla',
    title: 'Cheese Quesadilla',
    servings: 1,
    prepTimeMinutes: 2,
    cookTimeMinutes: 5,
    difficulty: 'Easy',
    calories: 300,
    ingredients: [
      { amount: '1', name: 'flour tortilla' },
      { amount: '1/2 cup', name: 'shredded cheese' },
      { amount: '1 tsp', name: 'butter' },
    ],
    equipment: ['Frying pan', 'Spatula'],
    steps: [
      { stepNumber: 1, section: 'Prep', instruction: 'Spread butter lightly on one side of the tortilla.' },
      { stepNumber: 2, section: 'Cook Main', instruction: 'Place tortilla butter-side down in a pan over medium heat.' },
      { stepNumber: 3, section: 'Cook Main', instruction: 'Sprinkle cheese on half of the tortilla.' },
      { stepNumber: 4, section: 'Cook Main', instruction: 'Fold tortilla in half. Press down gently.' },
      { stepNumber: 5, section: 'Cook Main', instruction: 'Cook 2 minutes. Flip and cook 2 more minutes.' },
      { stepNumber: 6, section: 'Finish & Serve', instruction: 'When cheese is melted and tortilla is golden, serve!' },
    ],
    tips: ['Add beans or chicken for protein', 'Serve with salsa or sour cream'],
    categories: ['lunch', 'dinner', 'snack', 'quick', 'easy'],
  },
];

/**
 * Get recipe suggestions based on various factors
 */
export function getRecipeSuggestions(options?: {
  ingredients?: string[];
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  maxTime?: number;
  difficulty?: 'easy' | 'medium';
}): RecipeSuggestion[] {
  const stats = getCookingStats();
  const suggestions: RecipeSuggestion[] = [];

  for (const recipe of SUGGESTION_RECIPES) {
    let score = 50; // Base score
    const reasons: SuggestionReason[] = [];

    // Check meal type match
    if (options?.mealType && recipe.categories?.includes(options.mealType)) {
      score += 20;
      reasons.push({ type: 'popular', text: `Great for ${options.mealType}` });
    }

    // Check time constraints
    const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
    if (options?.maxTime && totalTime <= options.maxTime) {
      score += 15;
      reasons.push({ type: 'quick', text: `Ready in ${totalTime} minutes` });
    }

    // Boost easy recipes
    if (recipe.categories?.includes('easy')) {
      score += 10;
      reasons.push({ type: 'easy', text: 'Simple to make' });
    }

    // Check ingredient match
    if (options?.ingredients && options.ingredients.length > 0) {
      const matchedIngredients = recipe.ingredients.filter(ing =>
        options.ingredients!.some(userIng =>
          ing.name.toLowerCase().includes(userIng.toLowerCase()) ||
          userIng.toLowerCase().includes(ing.name.toLowerCase())
        )
      );
      if (matchedIngredients.length > 0) {
        score += matchedIngredients.length * 15;
        reasons.push({
          type: 'ingredient',
          text: `Uses ${matchedIngredients.map(i => i.name).join(', ')}`,
        });
      }
    }

    // Boost recipes user hasn't tried
    if (!stats.recentRecipes.includes(recipe.title)) {
      score += 5;
      reasons.push({ type: 'popular', text: 'Try something new!' });
    }

    // Boost healthy options
    if (recipe.categories?.includes('healthy')) {
      score += 5;
      reasons.push({ type: 'healthy', text: 'Healthy choice' });
    }

    suggestions.push({ recipe, score, reasons });
  }

  // Sort by score descending
  suggestions.sort((a, b) => b.score - a.score);

  return suggestions;
}

/**
 * Get a random suggestion (for "I don't know what to make")
 */
export function getRandomSuggestion(): RecipeSuggestion {
  const hour = new Date().getHours();
  let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';

  // Determine meal type based on time of day
  if (hour >= 5 && hour < 11) {
    mealType = 'breakfast';
  } else if (hour >= 11 && hour < 15) {
    mealType = 'lunch';
  } else if (hour >= 15 && hour < 18) {
    mealType = 'snack';
  } else {
    mealType = 'dinner';
  }

  const suggestions = getRecipeSuggestions({ mealType, maxTime: 20 });

  // Get top 3 and pick randomly
  const topSuggestions = suggestions.slice(0, 3);
  const randomIndex = Math.floor(Math.random() * topSuggestions.length);

  return topSuggestions[randomIndex] || suggestions[0];
}

/**
 * Search suggestions by ingredient
 */
export function searchByIngredients(ingredients: string[]): RecipeSuggestion[] {
  return getRecipeSuggestions({ ingredients });
}

/**
 * Get suggestions for a specific meal
 */
export function getSuggestionsForMeal(mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'): RecipeSuggestion[] {
  return getRecipeSuggestions({ mealType });
}

/**
 * Get quick meal suggestions (under 15 minutes)
 */
export function getQuickMealSuggestions(): RecipeSuggestion[] {
  return getRecipeSuggestions({ maxTime: 15 });
}

/**
 * Ingredient parser - extract ingredients from user input
 */
export function parseIngredientInput(input: string): string[] {
  // Split by commas, "and", newlines
  const parts = input
    .toLowerCase()
    .split(/[,\n]|\band\b/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return parts;
}

/**
 * Get all available recipes
 */
export function getAllSuggestionRecipes(): Recipe[] {
  return [...SUGGESTION_RECIPES];
}

/**
 * Get recipe by ID
 */
export function getRecipeById(id: string): Recipe | undefined {
  return SUGGESTION_RECIPES.find(r => r.id === id);
}
