/**
 * Recipe Scaling Service
 * Adjust recipe servings and recalculate ingredient amounts
 */

import type { Recipe, Ingredient } from '../types';

/**
 * Scale a recipe to a different number of servings
 */
export function scaleRecipe(recipe: Recipe, newServings: number): Recipe {
  if (newServings <= 0 || recipe.servings <= 0) {
    return recipe;
  }

  const scaleFactor = newServings / recipe.servings;

  return {
    ...recipe,
    servings: newServings,
    ingredients: recipe.ingredients.map(ing => scaleIngredient(ing, scaleFactor)),
    // Optionally scale calories
    calories: recipe.calories ? Math.round(recipe.calories * scaleFactor) : undefined,
  };
}

/**
 * Scale a single ingredient amount
 */
function scaleIngredient(ingredient: Ingredient, factor: number): Ingredient {
  const scaledAmount = scaleAmount(ingredient.amount, factor);
  return {
    ...ingredient,
    amount: scaledAmount,
  };
}

/**
 * Parse and scale an amount string
 * Handles formats like: "2 cups", "1/2 tsp", "1 1/2 tablespoons", "3-4 cloves"
 */
function scaleAmount(amount: string, factor: number): string {
  // Handle "to taste", "pinch", etc.
  const noScaleTerms = ['to taste', 'pinch', 'dash', 'as needed', 'optional'];
  if (noScaleTerms.some(term => amount.toLowerCase().includes(term))) {
    return amount;
  }

  // Try to parse the amount
  const parsed = parseAmount(amount);
  if (!parsed) {
    return amount; // Can't parse, return original
  }

  const { number, unit, suffix } = parsed;
  const scaledNumber = number * factor;

  // Format the scaled number nicely
  const formattedNumber = formatNumber(scaledNumber);

  return unit ? `${formattedNumber} ${unit}${suffix}` : `${formattedNumber}${suffix}`;
}

interface ParsedAmount {
  number: number;
  unit: string;
  suffix: string;
}

/**
 * Parse an amount string into number and unit
 */
function parseAmount(amount: string): ParsedAmount | null {
  const trimmed = amount.trim();

  // Match patterns like: "2 cups", "1/2 tsp", "1 1/2 tablespoons"
  // Also handles: "2-3 cups" (takes first number)
  const regex = /^(\d+(?:\s*[\/]\s*\d+)?(?:\s+\d+(?:\s*[\/]\s*\d+)?)?|\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?)\s*(.*)$/;
  const match = trimmed.match(regex);

  if (!match) {
    return null;
  }

  let numberStr = match[1];
  const rest = match[2];

  // Handle ranges like "2-3" - take the first number
  if (numberStr.includes('-')) {
    numberStr = numberStr.split('-')[0].trim();
  }

  // Parse the number (handles fractions and mixed numbers)
  const number = parseNumber(numberStr);
  if (isNaN(number)) {
    return null;
  }

  // Split rest into unit and suffix
  const unitMatch = rest.match(/^(\w+)(.*)$/);
  const unit = unitMatch ? unitMatch[1] : '';
  const suffix = unitMatch ? unitMatch[2] : rest;

  return { number, unit, suffix };
}

/**
 * Parse a number string that may contain fractions
 * Handles: "2", "1/2", "1 1/2", "0.5"
 */
function parseNumber(str: string): number {
  const trimmed = str.trim();

  // Handle decimals
  if (/^\d+\.\d+$/.test(trimmed)) {
    return parseFloat(trimmed);
  }

  // Handle simple integers
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }

  // Handle fractions like "1/2"
  if (/^\d+\s*\/\s*\d+$/.test(trimmed)) {
    const [num, denom] = trimmed.split('/').map(n => parseInt(n.trim(), 10));
    return num / denom;
  }

  // Handle mixed numbers like "1 1/2"
  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const num = parseInt(mixedMatch[2], 10);
    const denom = parseInt(mixedMatch[3], 10);
    return whole + (num / denom);
  }

  return NaN;
}

/**
 * Format a number nicely for display
 * Converts decimals to fractions where appropriate
 */
function formatNumber(num: number): string {
  // Handle very small numbers
  if (num < 0.125) {
    return 'a pinch';
  }

  // Common fractions lookup
  const fractions: { [key: string]: string } = {
    '0.125': '1/8',
    '0.25': '1/4',
    '0.333': '1/3',
    '0.375': '3/8',
    '0.5': '1/2',
    '0.625': '5/8',
    '0.667': '2/3',
    '0.75': '3/4',
    '0.875': '7/8',
  };

  const whole = Math.floor(num);
  const decimal = num - whole;

  // Find closest fraction
  let fractionStr = '';
  if (decimal > 0.0625) { // Only show fraction if > 1/16
    const rounded = Math.round(decimal * 8) / 8; // Round to nearest 1/8
    const key = rounded.toFixed(3);
    fractionStr = fractions[key] || decimal.toFixed(1);
  }

  if (whole === 0 && fractionStr) {
    return fractionStr;
  } else if (whole > 0 && fractionStr && !fractionStr.includes('.')) {
    return `${whole} ${fractionStr}`;
  } else if (whole > 0) {
    return decimal > 0.0625 ? num.toFixed(1) : whole.toString();
  }

  return num.toFixed(1);
}

/**
 * Preset scaling options
 */
export const SCALE_OPTIONS = [
  { label: '½x', factor: 0.5, servingsMultiplier: 0.5 },
  { label: '1x', factor: 1, servingsMultiplier: 1 },
  { label: '2x', factor: 2, servingsMultiplier: 2 },
  { label: '3x', factor: 3, servingsMultiplier: 3 },
];

/**
 * Calculate new servings based on scale factor
 */
export function calculateNewServings(originalServings: number, factor: number): number {
  return Math.round(originalServings * factor);
}
