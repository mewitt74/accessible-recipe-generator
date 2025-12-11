/**
 * Meal Planning Service
 * Weekly meal schedules for cognitive accessibility
 */

import type { Recipe } from '../types';

export interface PlannedMeal {
  id: string;
  recipeId?: string;
  recipeName: string;
  recipeEmoji?: string;
  date: string; // ISO date string YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
  completed: boolean;
}

export interface WeekPlan {
  weekStart: string; // ISO date of Monday
  meals: PlannedMeal[];
}

const STORAGE_KEY = 'mealPlans';

/**
 * Get all meal plans
 */
export function getMealPlans(): WeekPlan[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save meal plans
 */
function saveMealPlans(plans: WeekPlan[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

/**
 * Get Monday of the week for a given date
 */
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

/**
 * Get meals for a specific week
 */
export function getWeekMeals(weekStart?: string): PlannedMeal[] {
  const plans = getMealPlans();
  const targetWeek = weekStart || getWeekStart();
  const weekPlan = plans.find(p => p.weekStart === targetWeek);
  return weekPlan?.meals || [];
}

/**
 * Get meals for a specific day
 */
export function getDayMeals(date: string): PlannedMeal[] {
  const plans = getMealPlans();
  for (const plan of plans) {
    const meals = plan.meals.filter(m => m.date === date);
    if (meals.length > 0) return meals;
  }
  return [];
}

/**
 * Add a meal to the plan
 */
export function addMealToPlan(meal: Omit<PlannedMeal, 'id'>): PlannedMeal {
  const plans = getMealPlans();
  const weekStart = getWeekStart(new Date(meal.date));
  
  const newMeal: PlannedMeal = {
    ...meal,
    id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };

  let weekPlan = plans.find(p => p.weekStart === weekStart);
  if (!weekPlan) {
    weekPlan = { weekStart, meals: [] };
    plans.push(weekPlan);
  }
  
  weekPlan.meals.push(newMeal);
  saveMealPlans(plans);
  
  return newMeal;
}

/**
 * Add a recipe to the meal plan
 */
export function addRecipeToPlan(
  recipe: Recipe,
  date: string,
  mealType: PlannedMeal['mealType']
): PlannedMeal {
  return addMealToPlan({
    recipeId: recipe.id,
    recipeName: recipe.title,
    recipeEmoji: '🍽️',
    date,
    mealType,
    completed: false,
  });
}

/**
 * Remove a meal from the plan
 */
export function removeMealFromPlan(mealId: string): void {
  const plans = getMealPlans();
  
  for (const plan of plans) {
    const index = plan.meals.findIndex(m => m.id === mealId);
    if (index !== -1) {
      plan.meals.splice(index, 1);
      break;
    }
  }
  
  saveMealPlans(plans);
}

/**
 * Mark a meal as completed
 */
export function toggleMealCompleted(mealId: string): void {
  const plans = getMealPlans();
  
  for (const plan of plans) {
    const meal = plan.meals.find(m => m.id === mealId);
    if (meal) {
      meal.completed = !meal.completed;
      break;
    }
  }
  
  saveMealPlans(plans);
}

/**
 * Update meal notes
 */
export function updateMealNotes(mealId: string, notes: string): void {
  const plans = getMealPlans();
  
  for (const plan of plans) {
    const meal = plan.meals.find(m => m.id === mealId);
    if (meal) {
      meal.notes = notes;
      break;
    }
  }
  
  saveMealPlans(plans);
}

/**
 * Get week dates array (Mon-Sun)
 */
export function getWeekDates(weekStart?: string): { date: string; dayName: string; isToday: boolean }[] {
  const start = weekStart ? new Date(weekStart) : new Date(getWeekStart());
  const today = new Date().toISOString().split('T')[0];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return days.map((dayName, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const date = d.toISOString().split('T')[0];
    return {
      date,
      dayName,
      isToday: date === today,
    };
  });
}

/**
 * Get meal type emoji
 */
export function getMealTypeEmoji(mealType: PlannedMeal['mealType']): string {
  const emojis: Record<PlannedMeal['mealType'], string> = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎',
  };
  return emojis[mealType];
}

/**
 * Get meal type label
 */
export function getMealTypeLabel(mealType: PlannedMeal['mealType']): string {
  const labels: Record<PlannedMeal['mealType'], string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
  };
  return labels[mealType];
}

/**
 * Generate shopping list from meal plan
 */
export function generateShoppingListFromPlan(weekStart?: string): string[] {
  const meals = getWeekMeals(weekStart);
  // This would integrate with recipes to get ingredients
  // For now, return meal names as reference
  return meals
    .filter(m => !m.completed)
    .map(m => `${m.recipeName} (${getMealTypeLabel(m.mealType)})`);
}

/**
 * Clear old meal plans (older than 4 weeks)
 */
export function cleanupOldPlans(): void {
  const plans = getMealPlans();
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const cutoff = fourWeeksAgo.toISOString().split('T')[0];
  
  const filtered = plans.filter(p => p.weekStart >= cutoff);
  saveMealPlans(filtered);
}

/**
 * Copy last week's plan to current week
 */
export function copyWeekPlan(fromWeek: string, toWeek: string): void {
  const plans = getMealPlans();
  const sourcePlan = plans.find(p => p.weekStart === fromWeek);
  
  if (!sourcePlan) return;
  
  // Calculate day offset
  const fromDate = new Date(fromWeek);
  const toDate = new Date(toWeek);
  const dayOffset = Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Copy meals with new dates
  const newMeals: PlannedMeal[] = sourcePlan.meals.map(meal => {
    const mealDate = new Date(meal.date);
    mealDate.setDate(mealDate.getDate() + dayOffset);
    
    return {
      ...meal,
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: mealDate.toISOString().split('T')[0],
      completed: false,
    };
  });
  
  let targetPlan = plans.find(p => p.weekStart === toWeek);
  if (!targetPlan) {
    targetPlan = { weekStart: toWeek, meals: [] };
    plans.push(targetPlan);
  }
  
  targetPlan.meals.push(...newMeals);
  saveMealPlans(plans);
}
