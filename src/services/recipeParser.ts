/**
 * Recipe Parser Service
 * Parses OCR-extracted text from recipe photos into structured recipe data
 * Handles various formats: cookbook pages, printed recipes, handwritten recipes
 */

import { Recipe, Ingredient } from '../types';

interface ParsedRecipe {
  title: string;
  ingredients: Ingredient[];
  instructions: string[];
  confidence: number; // 0-100, how confident we are in the parsing
  rawText: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
}

/**
 * Common ingredient units and their variations
 */
const UNIT_PATTERNS: { [key: string]: string[] } = {
  'cup': ['cup', 'cups', 'c', 'c.'],
  'tablespoon': ['tablespoon', 'tablespoons', 'tbsp', 'tbsp.', 'tbs', 'tbs.', 'tb', 't.'],
  'teaspoon': ['teaspoon', 'teaspoons', 'tsp', 'tsp.', 'ts', 't'],
  'ounce': ['ounce', 'ounces', 'oz', 'oz.'],
  'pound': ['pound', 'pounds', 'lb', 'lbs', 'lb.', 'lbs.'],
  'gram': ['gram', 'grams', 'g', 'g.'],
  'kilogram': ['kilogram', 'kilograms', 'kg', 'kg.'],
  'milliliter': ['milliliter', 'milliliters', 'ml', 'ml.'],
  'liter': ['liter', 'liters', 'l', 'l.'],
  'pinch': ['pinch', 'pinches'],
  'dash': ['dash', 'dashes'],
  'piece': ['piece', 'pieces', 'pc', 'pcs'],
  'slice': ['slice', 'slices'],
  'can': ['can', 'cans'],
  'package': ['package', 'packages', 'pkg', 'pkgs'],
  'clove': ['clove', 'cloves'],
  'head': ['head', 'heads'],
  'bunch': ['bunch', 'bunches'],
  'stalk': ['stalk', 'stalks'],
  'sprig': ['sprig', 'sprigs'],
  'whole': ['whole'],
  'large': ['large', 'lg'],
  'medium': ['medium', 'med'],
  'small': ['small', 'sm'],
};

/**
 * Fraction patterns to convert to decimals
 */
const FRACTIONS: { [key: string]: number } = {
  '½': 0.5,
  '⅓': 0.333,
  '⅔': 0.667,
  '¼': 0.25,
  '¾': 0.75,
  '⅛': 0.125,
  '⅜': 0.375,
  '⅝': 0.625,
  '⅞': 0.875,
  '1/2': 0.5,
  '1/3': 0.333,
  '2/3': 0.667,
  '1/4': 0.25,
  '3/4': 0.75,
  '1/8': 0.125,
  '3/8': 0.375,
  '5/8': 0.625,
  '7/8': 0.875,
};

/**
 * Keywords that indicate the start of ingredients section
 */
const INGREDIENTS_SECTION_KEYWORDS = [
  'ingredients',
  'you will need',
  'what you need',
  'shopping list',
  'supplies',
  'for the recipe',
  'recipe ingredients',
];

/**
 * Keywords that indicate the start of instructions section
 */
const INSTRUCTIONS_SECTION_KEYWORDS = [
  'instructions',
  'directions',
  'method',
  'steps',
  'how to make',
  'preparation',
  'procedure',
  'cooking instructions',
  'to prepare',
  'to make',
];

/**
 * Keywords that indicate the end of recipe content
 */
const END_SECTION_KEYWORDS = [
  'notes',
  'tips',
  'variations',
  'nutrition',
  'nutritional information',
  'serving suggestion',
  'storage',
  'source',
];

/**
 * Parse a fraction string to a number
 * @internal Used for potential future quantity normalization
 */
export function parseFraction(text: string): number | null {
  // Check Unicode fractions
  for (const [frac, value] of Object.entries(FRACTIONS)) {
    if (text.includes(frac)) {
      const replaced = text.replace(frac, '');
      const whole = replaced.trim() ? parseFloat(replaced.trim()) : 0;
      if (!isNaN(whole)) {
        return whole + value;
      }
      return value;
    }
  }
  
  // Check "X/Y" format
  const slashMatch = text.match(/(\d+)\s*\/\s*(\d+)/);
  if (slashMatch) {
    const num = parseInt(slashMatch[1]);
    const denom = parseInt(slashMatch[2]);
    if (denom !== 0) {
      // Check for whole number before fraction
      const beforeFraction = text.substring(0, text.indexOf(slashMatch[0])).trim();
      const whole = beforeFraction ? parseFloat(beforeFraction) : 0;
      return (isNaN(whole) ? 0 : whole) + (num / denom);
    }
  }
  
  // Regular number
  const num = parseFloat(text);
  return isNaN(num) ? null : num;
}

/**
 * Extract quantity and unit from text
 */
function extractQuantityUnit(text: string): { quantity: string; unit: string; remaining: string } {
  let remaining = text.trim();
  let quantity = '';
  let unit = '';
  
  // Try to extract quantity (number at the start)
  const quantityMatch = remaining.match(/^([\d\s\/½⅓⅔¼¾⅛⅜⅝⅞.,-]+)/);
  if (quantityMatch) {
    quantity = quantityMatch[1].trim();
    remaining = remaining.substring(quantityMatch[0].length).trim();
  }
  
  // Try to extract unit
  const lowerRemaining = remaining.toLowerCase();
  for (const [standardUnit, variations] of Object.entries(UNIT_PATTERNS)) {
    for (const variation of variations) {
      if (lowerRemaining.startsWith(variation + ' ') || 
          lowerRemaining.startsWith(variation + '.') ||
          lowerRemaining === variation) {
        unit = standardUnit;
        remaining = remaining.substring(variation.length).replace(/^\.?\s*/, '');
        break;
      }
    }
    if (unit) break;
  }
  
  return { quantity, unit, remaining };
}

/**
 * Parse a single ingredient line
 */
function parseIngredientLine(line: string): Ingredient | null {
  const trimmed = line.trim();
  
  // Skip empty lines or section headers
  if (!trimmed || trimmed.length < 2) return null;
  if (INGREDIENTS_SECTION_KEYWORDS.some(k => trimmed.toLowerCase().includes(k))) return null;
  if (INSTRUCTIONS_SECTION_KEYWORDS.some(k => trimmed.toLowerCase().includes(k))) return null;
  
  // Remove bullet points, dashes, numbers at start
  const cleaned = trimmed
    .replace(/^[\-•●○◦▪▸►→\*]\s*/, '')
    .replace(/^\d+[\.\)]\s*/, '')
    .replace(/^\[\s*\]\s*/, '') // checkbox
    .replace(/^☐\s*/, ''); // empty checkbox
  
  if (!cleaned || cleaned.length < 2) return null;
  
  const { quantity, unit, remaining } = extractQuantityUnit(cleaned);
  
  // Parse notes in parentheses
  const notesMatch = remaining.match(/\(([^)]+)\)/);
  const note = notesMatch ? notesMatch[1] : undefined;
  const name = remaining.replace(/\([^)]+\)/, '').replace(/,\s*$/, '').trim();
  
  if (!name || name.length < 2) return null;
  
  // Combine quantity and unit into amount field (e.g., "2 cups")
  const amount = unit ? `${quantity || '1'} ${unit}` : (quantity || '1');
  
  return {
    name: name,
    amount: amount,
    note: note,
  };
}

/**
 * Detect section boundaries in text
 */
function detectSections(lines: string[]): { 
  titleLines: number[];
  ingredientLines: number[];
  instructionLines: number[];
} {
  const titleLines: number[] = [];
  const ingredientLines: number[] = [];
  const instructionLines: number[] = [];
  
  let currentSection: 'title' | 'ingredients' | 'instructions' | 'other' = 'title';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    
    // Check for section headers
    if (INGREDIENTS_SECTION_KEYWORDS.some(k => line.includes(k))) {
      currentSection = 'ingredients';
      continue;
    }
    
    if (INSTRUCTIONS_SECTION_KEYWORDS.some(k => line.includes(k))) {
      currentSection = 'instructions';
      continue;
    }
    
    if (END_SECTION_KEYWORDS.some(k => line.includes(k))) {
      currentSection = 'other';
      continue;
    }
    
    // Assign line to current section
    if (!line) continue; // Skip empty lines
    
    switch (currentSection) {
      case 'title':
        titleLines.push(i);
        break;
      case 'ingredients':
        ingredientLines.push(i);
        break;
      case 'instructions':
        instructionLines.push(i);
        break;
    }
  }
  
  return { titleLines, ingredientLines, instructionLines };
}

/**
 * Smart section detection for recipes without clear headers
 */
function smartSectionDetection(lines: string[]): {
  titleLines: number[];
  ingredientLines: number[];
  instructionLines: number[];
} {
  const titleLines: number[] = [];
  const ingredientLines: number[] = [];
  const instructionLines: number[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check if line looks like an ingredient (has quantity pattern)
    const hasQuantity = /^[\d\s\/½⅓⅔¼¾⅛⅜⅝⅞.,-]+/.test(line) ||
                       /^(a|an|one|two|three|four|five|six)\s+/i.test(line);
    
    // Check if line looks like an instruction (starts with verb or number + period)
    const startsWithNumber = /^\d+[\.\)]\s+/.test(line);
    const startsWithVerb = /^(preheat|mix|add|stir|cook|bake|combine|pour|heat|place|cut|slice|chop|dice|mince|sauté|fry|boil|simmer|roast|grill|blend|whisk|beat|fold|knead|roll|spread|cover|let|allow|remove|serve|garnish|season|taste|adjust|set|prepare|wash|rinse|drain|peel|grate|mash|crush|melt|dissolve|bring)/i.test(line);
    
    // First non-empty lines are likely title (before we find ingredients)
    if (ingredientLines.length === 0 && instructionLines.length === 0 && titleLines.length < 3) {
      if (!hasQuantity && !startsWithNumber && !startsWithVerb && line.length < 60) {
        titleLines.push(i);
        continue;
      }
    }
    
    if (hasQuantity && !startsWithVerb) {
      ingredientLines.push(i);
    } else if (startsWithNumber || startsWithVerb || (instructionLines.length > 0 && line.length > 30)) {
      instructionLines.push(i);
    }
  }
  
  return { titleLines, ingredientLines, instructionLines };
}

/**
 * Extract servings from text
 */
function extractServings(text: string): number | undefined {
  const patterns = [
    /serves?\s*[:\-]?\s*(\d+)/i,
    /servings?\s*[:\-]?\s*(\d+)/i,
    /makes?\s*[:\-]?\s*(\d+)/i,
    /yields?\s*[:\-]?\s*(\d+)/i,
    /(\d+)\s+servings?/i,
    /for\s+(\d+)\s+(people|persons|guests)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  return undefined;
}

/**
 * Extract time from text (in minutes)
 */
function extractTime(text: string, type: 'prep' | 'cook'): number | undefined {
  const keywords = type === 'prep' 
    ? ['prep time', 'preparation time', 'prep'] 
    : ['cook time', 'cooking time', 'bake time', 'baking time', 'cook'];
  
  for (const keyword of keywords) {
    const pattern = new RegExp(`${keyword}\\s*[:\\-]?\\s*(\\d+)\\s*(min|minute|hour|hr)?`, 'i');
    const match = text.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2]?.toLowerCase();
      if (unit && (unit.startsWith('hour') || unit === 'hr')) {
        return value * 60;
      }
      return value;
    }
  }
  
  return undefined;
}

/**
 * Main function to parse recipe text into structured data
 */
export function parseRecipeFromText(rawText: string): ParsedRecipe {
  const lines = rawText.split('\n').map(l => l.trim());
  const lowerText = rawText.toLowerCase();
  
  // Check if text has clear section headers
  const hasIngredientHeader = INGREDIENTS_SECTION_KEYWORDS.some(k => lowerText.includes(k));
  const hasInstructionHeader = INSTRUCTIONS_SECTION_KEYWORDS.some(k => lowerText.includes(k));
  
  // Detect sections
  const sections = (hasIngredientHeader || hasInstructionHeader)
    ? detectSections(lines)
    : smartSectionDetection(lines);
  
  // Extract title
  let title = 'Imported Recipe';
  if (sections.titleLines.length > 0) {
    // Use first non-empty title line, clean it up
    const titleCandidates = sections.titleLines
      .map(i => lines[i])
      .filter(l => l && l.length > 3 && l.length < 80);
    
    if (titleCandidates.length > 0) {
      // Pick the line that looks most like a title (not too short, not too long)
      title = titleCandidates.sort((a, b) => {
        // Prefer medium-length titles
        const aScore = Math.abs(a.length - 30);
        const bScore = Math.abs(b.length - 30);
        return aScore - bScore;
      })[0];
    }
  }
  
  // Parse ingredients
  const ingredients: Ingredient[] = sections.ingredientLines
    .map(i => parseIngredientLine(lines[i]))
    .filter((ing): ing is Ingredient => ing !== null);
  
  // Parse instructions
  const instructions: string[] = sections.instructionLines
    .map(i => lines[i])
    .filter(l => l && l.length > 5)
    .map(l => {
      // Clean up instruction lines
      return l
        .replace(/^\d+[\.\)]\s*/, '') // Remove leading numbers
        .replace(/^[\-•●]\s*/, ''); // Remove bullets
    });
  
  // Extract metadata
  const servings = extractServings(rawText);
  const prepTime = extractTime(rawText, 'prep');
  const cookTime = extractTime(rawText, 'cook');
  
  // Calculate confidence score
  let confidence = 0;
  if (title !== 'Imported Recipe') confidence += 20;
  if (ingredients.length >= 3) confidence += 30;
  if (ingredients.length >= 6) confidence += 10;
  if (instructions.length >= 2) confidence += 30;
  if (instructions.length >= 5) confidence += 10;
  if (servings) confidence += 5;
  if (prepTime || cookTime) confidence += 5;
  
  return {
    title,
    ingredients,
    instructions,
    confidence: Math.min(100, confidence),
    rawText,
    servings,
    prepTime,
    cookTime,
  };
}

/**
 * Convert parsed recipe to standard Recipe format
 */
export function parsedRecipeToRecipe(parsed: ParsedRecipe): Recipe {
  // Generate a unique ID for imported recipes
  const id = `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    title: parsed.title,
    ingredients: parsed.ingredients,
    equipment: [], // No equipment from OCR
    steps: parsed.instructions.map((instruction, index) => ({
      stepNumber: index + 1,
      instruction,
    })),
    prepTimeMinutes: parsed.prepTime || 0,
    cookTimeMinutes: parsed.cookTime || 0,
    servings: parsed.servings || 4,
    difficulty: 'medium',
  };
}

/**
 * Check if OCR text looks like a recipe
 */
export function isLikelyRecipe(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  // Check for recipe indicators
  const hasIngredientSection = INGREDIENTS_SECTION_KEYWORDS.some(k => lowerText.includes(k));
  const hasInstructionSection = INSTRUCTIONS_SECTION_KEYWORDS.some(k => lowerText.includes(k));
  
  // Check for quantity patterns (common in recipes)
  // Expanded to include more unit variations and formats
  const hasQuantities = /\d+\s*(cup|tablespoon|teaspoon|tbsp|tsp|oz|lb|g|kg|ml|l|pinch|dash|clove|head|can|jar)\b/i.test(text);
  
  // Check for cooking verbs (expanded list)
  const hasCookingVerbs = /(preheat|mix|stir|cook|bake|roast|grill|fry|sauté|combine|heat|add|pour|serve|boil|simmer|steam|broil|whisk|blend|knead|dice|chop|slice|mince|fold|garnish)/i.test(text);
  
  // Check for ingredient patterns (amount + unit + food)
  const hasIngredientPatterns = /\d+\s*(cup|tablespoon|teaspoon|tbsp|tsp|oz|g|ml|can|jar|box|package)s?\s+\w+/i.test(text) ||
                               /\d+\s*\w+\s*(cup|tablespoon|teaspoon|tbsp|tsp|oz|g|ml)/i.test(text);
  
  // Check for multiple ingredient-like lines (lines that start with quantity)
  const ingredientLikeLines = text.split('\n').filter(line => 
    /^\s*\d+[\s\-\.]/.test(line) || /^\s*\d+\/\d+/.test(line)
  ).length;
  const hasMultipleIngredientLines = ingredientLikeLines >= 3;
  
  // Indicators of a recipe
  const indicators = [
    hasIngredientSection,
    hasInstructionSection,
    hasQuantities,
    hasCookingVerbs,
    hasIngredientPatterns,
    hasMultipleIngredientLines
  ];
  const positiveIndicators = indicators.filter(Boolean).length;
  
  // Relaxed threshold: need at least 1 strong indicator
  // If has both quantities AND cooking verbs, that's definitely a recipe
  // If has section headers, that's a recipe
  // If has ingredient patterns and cooking verbs, that's likely a recipe
  if (hasIngredientSection || hasInstructionSection) return true;
  if (hasQuantities && hasCookingVerbs) return true;
  if (hasIngredientPatterns && (hasCookingVerbs || hasInstructionSection)) return true;
  if (hasMultipleIngredientLines && hasCookingVerbs) return true;
  
  // Otherwise need at least 2 general indicators
  return positiveIndicators >= 2;
}

export type { ParsedRecipe };
