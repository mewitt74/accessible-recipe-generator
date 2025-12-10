/**
 * Nutrition Information Service
 * Estimate calories, protein, carbs, and fat for recipes
 */

export interface NutritionInfo {
  calories: number;
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
  fiber: number;    // grams
  sodium: number;   // mg
}

export interface NutritionEstimate {
  perServing: NutritionInfo;
  total: NutritionInfo;
  servings: number;
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
}

// Nutrition data per common unit (approximate values)
const NUTRITION_DATABASE: { [key: string]: Partial<NutritionInfo> & { unit: string } } = {
  // Proteins
  'chicken': { unit: 'oz', calories: 45, protein: 8, carbs: 0, fat: 1 },
  'chicken breast': { unit: 'oz', calories: 45, protein: 9, carbs: 0, fat: 1 },
  'beef': { unit: 'oz', calories: 70, protein: 7, carbs: 0, fat: 4 },
  'ground beef': { unit: 'oz', calories: 75, protein: 7, carbs: 0, fat: 5 },
  'pork': { unit: 'oz', calories: 60, protein: 7, carbs: 0, fat: 3 },
  'bacon': { unit: 'slice', calories: 45, protein: 3, carbs: 0, fat: 3.5 },
  'fish': { unit: 'oz', calories: 35, protein: 7, carbs: 0, fat: 0.5 },
  'salmon': { unit: 'oz', calories: 55, protein: 7, carbs: 0, fat: 3 },
  'tuna': { unit: 'oz', calories: 35, protein: 8, carbs: 0, fat: 0.3 },
  'shrimp': { unit: 'oz', calories: 30, protein: 6, carbs: 0, fat: 0.5 },
  'egg': { unit: 'large', calories: 70, protein: 6, carbs: 0, fat: 5 },
  'eggs': { unit: 'large', calories: 70, protein: 6, carbs: 0, fat: 5 },
  'tofu': { unit: 'oz', calories: 20, protein: 2, carbs: 0.5, fat: 1 },
  
  // Dairy
  'milk': { unit: 'cup', calories: 150, protein: 8, carbs: 12, fat: 8 },
  'skim milk': { unit: 'cup', calories: 80, protein: 8, carbs: 12, fat: 0 },
  'cream': { unit: 'tbsp', calories: 50, protein: 0.5, carbs: 0.5, fat: 5 },
  'heavy cream': { unit: 'tbsp', calories: 50, protein: 0.5, carbs: 0.5, fat: 5 },
  'butter': { unit: 'tbsp', calories: 100, protein: 0, carbs: 0, fat: 11 },
  'cheese': { unit: 'oz', calories: 110, protein: 7, carbs: 0.5, fat: 9 },
  'cheddar': { unit: 'oz', calories: 115, protein: 7, carbs: 0.5, fat: 9 },
  'mozzarella': { unit: 'oz', calories: 85, protein: 6, carbs: 1, fat: 6 },
  'parmesan': { unit: 'tbsp', calories: 20, protein: 2, carbs: 0, fat: 1.5 },
  'cream cheese': { unit: 'oz', calories: 100, protein: 2, carbs: 1, fat: 10 },
  'sour cream': { unit: 'tbsp', calories: 25, protein: 0.5, carbs: 0.5, fat: 2.5 },
  'yogurt': { unit: 'cup', calories: 150, protein: 8, carbs: 17, fat: 8 },
  'greek yogurt': { unit: 'cup', calories: 130, protein: 17, carbs: 8, fat: 0 },
  
  // Grains & Starches
  'flour': { unit: 'cup', calories: 455, protein: 13, carbs: 95, fat: 1 },
  'bread': { unit: 'slice', calories: 80, protein: 3, carbs: 15, fat: 1 },
  'rice': { unit: 'cup cooked', calories: 200, protein: 4, carbs: 45, fat: 0.5 },
  'pasta': { unit: 'cup cooked', calories: 200, protein: 7, carbs: 40, fat: 1 },
  'spaghetti': { unit: 'cup cooked', calories: 220, protein: 8, carbs: 43, fat: 1 },
  'noodles': { unit: 'cup cooked', calories: 220, protein: 8, carbs: 40, fat: 2.5 },
  'oats': { unit: 'cup', calories: 300, protein: 10, carbs: 54, fat: 5 },
  'cereal': { unit: 'cup', calories: 120, protein: 2, carbs: 25, fat: 1 },
  'tortilla': { unit: 'medium', calories: 90, protein: 2, carbs: 15, fat: 2.5 },
  'potato': { unit: 'medium', calories: 160, protein: 4, carbs: 37, fat: 0 },
  'potatoes': { unit: 'medium', calories: 160, protein: 4, carbs: 37, fat: 0 },
  'sweet potato': { unit: 'medium', calories: 100, protein: 2, carbs: 24, fat: 0 },
  
  // Vegetables
  'onion': { unit: 'medium', calories: 45, protein: 1, carbs: 11, fat: 0, fiber: 2 },
  'garlic': { unit: 'clove', calories: 5, protein: 0, carbs: 1, fat: 0 },
  'tomato': { unit: 'medium', calories: 20, protein: 1, carbs: 5, fat: 0 },
  'tomatoes': { unit: 'medium', calories: 20, protein: 1, carbs: 5, fat: 0 },
  'carrot': { unit: 'medium', calories: 25, protein: 0.5, carbs: 6, fat: 0, fiber: 2 },
  'carrots': { unit: 'medium', calories: 25, protein: 0.5, carbs: 6, fat: 0, fiber: 2 },
  'celery': { unit: 'stalk', calories: 6, protein: 0.3, carbs: 1, fat: 0, fiber: 0.5 },
  'broccoli': { unit: 'cup', calories: 55, protein: 4, carbs: 11, fat: 0.5, fiber: 5 },
  'spinach': { unit: 'cup', calories: 7, protein: 1, carbs: 1, fat: 0, fiber: 1 },
  'lettuce': { unit: 'cup', calories: 5, protein: 0.5, carbs: 1, fat: 0 },
  'bell pepper': { unit: 'medium', calories: 25, protein: 1, carbs: 6, fat: 0 },
  'pepper': { unit: 'medium', calories: 25, protein: 1, carbs: 6, fat: 0 },
  'mushroom': { unit: 'cup', calories: 15, protein: 2, carbs: 2, fat: 0 },
  'mushrooms': { unit: 'cup', calories: 15, protein: 2, carbs: 2, fat: 0 },
  'zucchini': { unit: 'medium', calories: 30, protein: 2, carbs: 6, fat: 0, fiber: 2 },
  'cucumber': { unit: 'medium', calories: 15, protein: 1, carbs: 4, fat: 0 },
  'corn': { unit: 'cup', calories: 125, protein: 4, carbs: 27, fat: 2, fiber: 3 },
  'peas': { unit: 'cup', calories: 115, protein: 8, carbs: 21, fat: 0.5, fiber: 8 },
  'green beans': { unit: 'cup', calories: 30, protein: 2, carbs: 7, fat: 0, fiber: 3 },
  'cabbage': { unit: 'cup', calories: 20, protein: 1, carbs: 5, fat: 0, fiber: 2 },
  'cauliflower': { unit: 'cup', calories: 25, protein: 2, carbs: 5, fat: 0, fiber: 2 },
  
  // Fruits
  'apple': { unit: 'medium', calories: 95, protein: 0.5, carbs: 25, fat: 0, fiber: 4 },
  'banana': { unit: 'medium', calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3 },
  'orange': { unit: 'medium', calories: 60, protein: 1, carbs: 15, fat: 0, fiber: 3 },
  'lemon': { unit: 'medium', calories: 20, protein: 0.5, carbs: 6, fat: 0 },
  'lime': { unit: 'medium', calories: 20, protein: 0.5, carbs: 7, fat: 0 },
  'strawberry': { unit: 'cup', calories: 50, protein: 1, carbs: 12, fat: 0, fiber: 3 },
  'strawberries': { unit: 'cup', calories: 50, protein: 1, carbs: 12, fat: 0, fiber: 3 },
  'blueberries': { unit: 'cup', calories: 85, protein: 1, carbs: 21, fat: 0.5, fiber: 4 },
  'avocado': { unit: 'medium', calories: 240, protein: 3, carbs: 12, fat: 22, fiber: 10 },
  
  // Fats & Oils
  'oil': { unit: 'tbsp', calories: 120, protein: 0, carbs: 0, fat: 14 },
  'olive oil': { unit: 'tbsp', calories: 120, protein: 0, carbs: 0, fat: 14 },
  'vegetable oil': { unit: 'tbsp', calories: 120, protein: 0, carbs: 0, fat: 14 },
  'coconut oil': { unit: 'tbsp', calories: 120, protein: 0, carbs: 0, fat: 14 },
  'mayonnaise': { unit: 'tbsp', calories: 95, protein: 0, carbs: 0, fat: 10 },
  
  // Sweeteners
  'sugar': { unit: 'tbsp', calories: 50, protein: 0, carbs: 13, fat: 0 },
  'brown sugar': { unit: 'tbsp', calories: 50, protein: 0, carbs: 13, fat: 0 },
  'honey': { unit: 'tbsp', calories: 65, protein: 0, carbs: 17, fat: 0 },
  'maple syrup': { unit: 'tbsp', calories: 50, protein: 0, carbs: 13, fat: 0 },
  
  // Condiments & Sauces
  'ketchup': { unit: 'tbsp', calories: 20, protein: 0, carbs: 5, fat: 0 },
  'mustard': { unit: 'tbsp', calories: 5, protein: 0.5, carbs: 0.5, fat: 0 },
  'soy sauce': { unit: 'tbsp', calories: 10, protein: 1, carbs: 1, fat: 0, sodium: 900 },
  'vinegar': { unit: 'tbsp', calories: 3, protein: 0, carbs: 0, fat: 0 },
  'hot sauce': { unit: 'tbsp', calories: 5, protein: 0, carbs: 1, fat: 0 },
  'salsa': { unit: 'tbsp', calories: 5, protein: 0, carbs: 1, fat: 0 },
  'tomato sauce': { unit: 'cup', calories: 75, protein: 3, carbs: 16, fat: 0.5 },
  'marinara': { unit: 'cup', calories: 70, protein: 2, carbs: 14, fat: 1 },
  
  // Nuts & Seeds
  'peanut butter': { unit: 'tbsp', calories: 95, protein: 4, carbs: 3, fat: 8 },
  'almond butter': { unit: 'tbsp', calories: 100, protein: 3, carbs: 3, fat: 9 },
  'almonds': { unit: 'oz', calories: 165, protein: 6, carbs: 6, fat: 14, fiber: 3 },
  'walnuts': { unit: 'oz', calories: 185, protein: 4, carbs: 4, fat: 18 },
  'peanuts': { unit: 'oz', calories: 165, protein: 7, carbs: 5, fat: 14 },
  
  // Beans & Legumes
  'beans': { unit: 'cup', calories: 220, protein: 15, carbs: 40, fat: 1, fiber: 15 },
  'black beans': { unit: 'cup', calories: 225, protein: 15, carbs: 40, fat: 1, fiber: 15 },
  'kidney beans': { unit: 'cup', calories: 215, protein: 15, carbs: 40, fat: 0.5, fiber: 13 },
  'chickpeas': { unit: 'cup', calories: 270, protein: 15, carbs: 45, fat: 4, fiber: 12 },
  'lentils': { unit: 'cup', calories: 230, protein: 18, carbs: 40, fat: 0.5, fiber: 16 },
  
  // Seasonings (minimal calories)
  'salt': { unit: 'tsp', calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 2300 },
  'black_pepper': { unit: 'tsp', calories: 5, protein: 0, carbs: 1, fat: 0 },
  'cinnamon': { unit: 'tsp', calories: 5, protein: 0, carbs: 2, fat: 0 },
  'paprika': { unit: 'tsp', calories: 5, protein: 0, carbs: 1, fat: 0 },
  'cumin': { unit: 'tsp', calories: 8, protein: 0.5, carbs: 1, fat: 0.5 },
  'oregano': { unit: 'tsp', calories: 5, protein: 0, carbs: 1, fat: 0 },
  'basil': { unit: 'tsp', calories: 1, protein: 0, carbs: 0, fat: 0 },
  'thyme': { unit: 'tsp', calories: 3, protein: 0, carbs: 1, fat: 0 },
  'rosemary': { unit: 'tsp', calories: 2, protein: 0, carbs: 0, fat: 0 },
  'parsley': { unit: 'tbsp', calories: 1, protein: 0, carbs: 0, fat: 0 },
  'cilantro': { unit: 'tbsp', calories: 1, protein: 0, carbs: 0, fat: 0 },
};

// Unit conversions to standard
const UNIT_CONVERSIONS: { [key: string]: { standard: string; multiplier: number } } = {
  'tsp': { standard: 'tsp', multiplier: 1 },
  'teaspoon': { standard: 'tsp', multiplier: 1 },
  'teaspoons': { standard: 'tsp', multiplier: 1 },
  'tbsp': { standard: 'tbsp', multiplier: 1 },
  'tablespoon': { standard: 'tbsp', multiplier: 1 },
  'tablespoons': { standard: 'tbsp', multiplier: 1 },
  'cup': { standard: 'cup', multiplier: 1 },
  'cups': { standard: 'cup', multiplier: 1 },
  'oz': { standard: 'oz', multiplier: 1 },
  'ounce': { standard: 'oz', multiplier: 1 },
  'ounces': { standard: 'oz', multiplier: 1 },
  'lb': { standard: 'oz', multiplier: 16 },
  'lbs': { standard: 'oz', multiplier: 16 },
  'pound': { standard: 'oz', multiplier: 16 },
  'pounds': { standard: 'oz', multiplier: 16 },
  'clove': { standard: 'clove', multiplier: 1 },
  'cloves': { standard: 'clove', multiplier: 1 },
  'slice': { standard: 'slice', multiplier: 1 },
  'slices': { standard: 'slice', multiplier: 1 },
  'large': { standard: 'large', multiplier: 1 },
  'medium': { standard: 'medium', multiplier: 1 },
  'small': { standard: 'medium', multiplier: 0.75 },
  'stalk': { standard: 'stalk', multiplier: 1 },
  'stalks': { standard: 'stalk', multiplier: 1 },
};

/**
 * Estimate nutrition for a recipe
 */
export function estimateNutrition(
  ingredients: { amount: string; name: string }[],
  servings: number
): NutritionEstimate {
  const total: NutritionInfo = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
  };

  const warnings: string[] = [];
  let matchedCount = 0;
  let totalIngredients = ingredients.length;

  for (const ing of ingredients) {
    const nutrition = lookupIngredientNutrition(ing.amount, ing.name);
    if (nutrition) {
      total.calories += nutrition.calories || 0;
      total.protein += nutrition.protein || 0;
      total.carbs += nutrition.carbs || 0;
      total.fat += nutrition.fat || 0;
      total.fiber += nutrition.fiber || 0;
      total.sodium += nutrition.sodium || 0;
      matchedCount++;
    }
  }

  // Calculate confidence
  const matchRatio = matchedCount / totalIngredients;
  let confidence: 'high' | 'medium' | 'low';
  if (matchRatio >= 0.8) {
    confidence = 'high';
  } else if (matchRatio >= 0.5) {
    confidence = 'medium';
    warnings.push(`${totalIngredients - matchedCount} ingredients could not be estimated`);
  } else {
    confidence = 'low';
    warnings.push('Many ingredients not in database - estimate may be inaccurate');
  }

  // Calculate per serving
  const perServing: NutritionInfo = {
    calories: Math.round(total.calories / servings),
    protein: Math.round(total.protein / servings),
    carbs: Math.round(total.carbs / servings),
    fat: Math.round(total.fat / servings),
    fiber: Math.round(total.fiber / servings),
    sodium: Math.round(total.sodium / servings),
  };

  // Round totals
  total.calories = Math.round(total.calories);
  total.protein = Math.round(total.protein);
  total.carbs = Math.round(total.carbs);
  total.fat = Math.round(total.fat);
  total.fiber = Math.round(total.fiber);
  total.sodium = Math.round(total.sodium);

  return { perServing, total, servings, confidence, warnings };
}

/**
 * Look up nutrition for a specific ingredient amount
 */
function lookupIngredientNutrition(
  amount: string,
  name: string
): Partial<NutritionInfo> | null {
  // Find matching ingredient in database
  const nameLower = name.toLowerCase();
  let dbEntry: (Partial<NutritionInfo> & { unit: string }) | null = null;

  for (const key of Object.keys(NUTRITION_DATABASE)) {
    if (nameLower.includes(key) || key.includes(nameLower.split(' ')[0])) {
      dbEntry = NUTRITION_DATABASE[key];
      break;
    }
  }

  if (!dbEntry) {
    return null;
  }

  // Parse the amount
  const parsed = parseAmountForNutrition(amount);
  if (!parsed) {
    // Return base values if we can't parse amount
    return dbEntry;
  }

  // Calculate multiplier based on units
  const multiplier = calculateUnitMultiplier(parsed.quantity, parsed.unit, dbEntry.unit);

  return {
    calories: (dbEntry.calories || 0) * multiplier,
    protein: (dbEntry.protein || 0) * multiplier,
    carbs: (dbEntry.carbs || 0) * multiplier,
    fat: (dbEntry.fat || 0) * multiplier,
    fiber: (dbEntry.fiber || 0) * multiplier,
    sodium: (dbEntry.sodium || 0) * multiplier,
  };
}

/**
 * Parse amount string for nutrition calculation
 */
function parseAmountForNutrition(amount: string): { quantity: number; unit: string } | null {
  const trimmed = amount.toLowerCase().trim();

  // Match patterns
  const match = trimmed.match(/^([\d\s\/\.]+)\s*(.*)$/);
  if (!match) {
    return null;
  }

  const quantityStr = match[1].trim();
  const unit = match[2].trim();

  // Parse quantity (handle fractions)
  let quantity = 0;
  if (quantityStr.includes('/')) {
    const parts = quantityStr.split('/');
    if (parts.length === 2) {
      quantity = parseFloat(parts[0]) / parseFloat(parts[1]);
    }
  } else if (quantityStr.includes(' ')) {
    // Mixed number like "1 1/2"
    const parts = quantityStr.split(' ');
    quantity = parseFloat(parts[0]);
    if (parts[1] && parts[1].includes('/')) {
      const fracParts = parts[1].split('/');
      quantity += parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
    }
  } else {
    quantity = parseFloat(quantityStr);
  }

  if (isNaN(quantity)) {
    return null;
  }

  return { quantity, unit };
}

/**
 * Calculate multiplier based on unit conversion
 */
function calculateUnitMultiplier(quantity: number, fromUnit: string, toUnit: string): number {
  // Simple conversion - in a full system this would be more comprehensive
  const conversion = UNIT_CONVERSIONS[fromUnit.toLowerCase()];
  
  if (conversion && conversion.standard === toUnit) {
    return quantity * conversion.multiplier;
  }

  // Rough conversions
  if (fromUnit.includes('cup') && toUnit === 'tbsp') {
    return quantity * 16;
  }
  if (fromUnit.includes('tbsp') && toUnit === 'tsp') {
    return quantity * 3;
  }

  // Default: use quantity directly
  return quantity;
}

/**
 * Format nutrition value for display
 */
export function formatNutritionValue(value: number, unit: string): string {
  if (value === 0) return '0' + unit;
  if (value < 1) return '<1' + unit;
  return Math.round(value) + unit;
}

/**
 * Get daily value percentage (based on 2000 calorie diet)
 */
export function getDailyValuePercent(nutrient: keyof NutritionInfo, value: number): number {
  const dailyValues: { [key: string]: number } = {
    calories: 2000,
    protein: 50,
    carbs: 300,
    fat: 65,
    fiber: 25,
    sodium: 2300,
  };

  const dv = dailyValues[nutrient];
  if (!dv) return 0;

  return Math.round((value / dv) * 100);
}
