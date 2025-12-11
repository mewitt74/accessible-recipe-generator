/**
 * Ingredient Substitutions Service
 * Alternatives for common ingredients
 */

export interface Substitution {
  original: string;
  alternatives: {
    name: string;
    ratio: string; // e.g., "1:1", "1 cup = 3/4 cup"
    notes?: string;
    dietaryInfo?: string[];
  }[];
}

/**
 * Common ingredient substitutions database
 */
export const SUBSTITUTIONS: Substitution[] = [
  // Dairy
  {
    original: 'milk',
    alternatives: [
      { name: 'Oat milk', ratio: '1:1', dietaryInfo: ['dairy-free', 'vegan'] },
      { name: 'Almond milk', ratio: '1:1', dietaryInfo: ['dairy-free', 'vegan'], notes: 'May be thinner' },
      { name: 'Coconut milk', ratio: '1:1', dietaryInfo: ['dairy-free', 'vegan'], notes: 'Adds coconut flavor' },
      { name: 'Soy milk', ratio: '1:1', dietaryInfo: ['dairy-free', 'vegan'] },
      { name: 'Water + butter', ratio: '1 cup milk = 1 cup water + 1 tbsp butter', notes: 'For baking' },
    ],
  },
  {
    original: 'butter',
    alternatives: [
      { name: 'Coconut oil', ratio: '1:1', dietaryInfo: ['dairy-free', 'vegan'] },
      { name: 'Olive oil', ratio: '1 cup butter = 3/4 cup oil', notes: 'Best for savory dishes' },
      { name: 'Applesauce', ratio: '1:1', dietaryInfo: ['fat-free'], notes: 'For baking, adds moisture' },
      { name: 'Greek yogurt', ratio: '1:1', notes: 'For baking, keeps things moist' },
      { name: 'Avocado', ratio: '1:1', dietaryInfo: ['dairy-free', 'vegan'], notes: 'For baking' },
    ],
  },
  {
    original: 'eggs',
    alternatives: [
      { name: 'Flax egg', ratio: '1 egg = 1 tbsp flax + 3 tbsp water', dietaryInfo: ['vegan'], notes: 'Let sit 5 min' },
      { name: 'Chia egg', ratio: '1 egg = 1 tbsp chia + 3 tbsp water', dietaryInfo: ['vegan'], notes: 'Let sit 5 min' },
      { name: 'Mashed banana', ratio: '1 egg = 1/4 cup', dietaryInfo: ['vegan'], notes: 'Adds sweetness' },
      { name: 'Applesauce', ratio: '1 egg = 1/4 cup', dietaryInfo: ['vegan'], notes: 'For baking' },
      { name: 'Silken tofu', ratio: '1 egg = 1/4 cup blended', dietaryInfo: ['vegan'] },
    ],
  },
  {
    original: 'cream',
    alternatives: [
      { name: 'Coconut cream', ratio: '1:1', dietaryInfo: ['dairy-free', 'vegan'] },
      { name: 'Cashew cream', ratio: '1:1', dietaryInfo: ['dairy-free', 'vegan'], notes: 'Blend soaked cashews' },
      { name: 'Evaporated milk', ratio: '1:1', notes: 'Lower fat option' },
      { name: 'Greek yogurt', ratio: '1:1', notes: 'Tangy flavor' },
    ],
  },
  {
    original: 'cheese',
    alternatives: [
      { name: 'Nutritional yeast', ratio: '1/4 cup cheese = 2 tbsp', dietaryInfo: ['vegan'], notes: 'Cheesy flavor' },
      { name: 'Cashew cheese', ratio: '1:1', dietaryInfo: ['vegan'] },
      { name: 'Tofu (firm)', ratio: '1:1', dietaryInfo: ['vegan'], notes: 'For ricotta-style' },
    ],
  },
  
  // Flour & Grains
  {
    original: 'all-purpose flour',
    alternatives: [
      { name: 'Whole wheat flour', ratio: '1:1', notes: 'Denser result' },
      { name: 'Almond flour', ratio: '1 cup = 1 cup + 2 tbsp', dietaryInfo: ['gluten-free', 'low-carb'] },
      { name: 'Oat flour', ratio: '1:1', dietaryInfo: ['gluten-free*'], notes: '*Use certified GF oats' },
      { name: 'Coconut flour', ratio: '1 cup = 1/4 cup', dietaryInfo: ['gluten-free'], notes: 'Very absorbent' },
      { name: 'Rice flour', ratio: '1:1', dietaryInfo: ['gluten-free'] },
    ],
  },
  {
    original: 'breadcrumbs',
    alternatives: [
      { name: 'Crushed crackers', ratio: '1:1' },
      { name: 'Oats', ratio: '1:1', notes: 'Pulse in blender' },
      { name: 'Crushed cornflakes', ratio: '1:1' },
      { name: 'Almond meal', ratio: '1:1', dietaryInfo: ['gluten-free', 'low-carb'] },
    ],
  },
  {
    original: 'pasta',
    alternatives: [
      { name: 'Zucchini noodles', ratio: '1:1', dietaryInfo: ['gluten-free', 'low-carb'], notes: 'Spiralize zucchini' },
      { name: 'Spaghetti squash', ratio: '1:1', dietaryInfo: ['gluten-free', 'low-carb'] },
      { name: 'Rice noodles', ratio: '1:1', dietaryInfo: ['gluten-free'] },
      { name: 'Cauliflower rice', ratio: '1:1', dietaryInfo: ['gluten-free', 'low-carb'] },
    ],
  },
  
  // Sweeteners
  {
    original: 'sugar',
    alternatives: [
      { name: 'Honey', ratio: '1 cup = 3/4 cup', notes: 'Reduce liquid by 1/4 cup' },
      { name: 'Maple syrup', ratio: '1 cup = 3/4 cup', dietaryInfo: ['vegan'], notes: 'Reduce liquid slightly' },
      { name: 'Coconut sugar', ratio: '1:1', notes: 'Lower glycemic index' },
      { name: 'Stevia', ratio: '1 cup = 1 tsp', dietaryInfo: ['sugar-free'], notes: 'Very concentrated' },
      { name: 'Mashed banana', ratio: '1 cup = 1 cup', notes: 'Adds banana flavor' },
    ],
  },
  {
    original: 'brown sugar',
    alternatives: [
      { name: 'White sugar + molasses', ratio: '1 cup = 1 cup sugar + 1 tbsp molasses' },
      { name: 'Coconut sugar', ratio: '1:1' },
      { name: 'Maple syrup', ratio: '1 cup = 3/4 cup' },
    ],
  },
  
  // Proteins
  {
    original: 'chicken',
    alternatives: [
      { name: 'Tofu (extra firm)', ratio: '1:1', dietaryInfo: ['vegan'], notes: 'Press and marinate' },
      { name: 'Tempeh', ratio: '1:1', dietaryInfo: ['vegan'] },
      { name: 'Chickpeas', ratio: '1 lb chicken = 2 cans', dietaryInfo: ['vegan'] },
      { name: 'Turkey', ratio: '1:1', notes: 'Leaner option' },
    ],
  },
  {
    original: 'ground beef',
    alternatives: [
      { name: 'Ground turkey', ratio: '1:1', notes: 'Leaner option' },
      { name: 'Lentils', ratio: '1 lb = 2 cups cooked', dietaryInfo: ['vegan'] },
      { name: 'Mushrooms (chopped)', ratio: '1:1', dietaryInfo: ['vegan'], notes: 'Meaty texture' },
      { name: 'Black beans', ratio: '1 lb = 2 cans', dietaryInfo: ['vegan'] },
    ],
  },
  
  // Condiments & Sauces
  {
    original: 'soy sauce',
    alternatives: [
      { name: 'Coconut aminos', ratio: '1:1', dietaryInfo: ['soy-free'], notes: 'Slightly sweeter' },
      { name: 'Tamari', ratio: '1:1', dietaryInfo: ['gluten-free'], notes: 'Check label for GF' },
      { name: 'Worcestershire sauce', ratio: '1:1', notes: 'Different flavor profile' },
    ],
  },
  {
    original: 'mayonnaise',
    alternatives: [
      { name: 'Greek yogurt', ratio: '1:1', notes: 'Tangy, less fat' },
      { name: 'Avocado', ratio: '1:1', dietaryInfo: ['vegan'], notes: 'Mash until smooth' },
      { name: 'Hummus', ratio: '1:1', dietaryInfo: ['vegan'] },
    ],
  },
  
  // Baking
  {
    original: 'baking powder',
    alternatives: [
      { name: 'Baking soda + cream of tartar', ratio: '1 tsp = 1/4 tsp soda + 1/2 tsp cream of tartar' },
      { name: 'Baking soda + lemon juice', ratio: '1 tsp = 1/4 tsp soda + 1/2 tsp lemon juice' },
    ],
  },
  {
    original: 'vanilla extract',
    alternatives: [
      { name: 'Maple syrup', ratio: '1:1', notes: 'Adds sweetness' },
      { name: 'Almond extract', ratio: '1 tsp = 1/2 tsp', notes: 'Strong flavor' },
      { name: 'Vanilla bean', ratio: '1 tsp = seeds from 1 inch of bean' },
    ],
  },
  
  // Vegetables
  {
    original: 'onion',
    alternatives: [
      { name: 'Shallots', ratio: '1 medium = 3 shallots', notes: 'Milder flavor' },
      { name: 'Leeks', ratio: '1:1', notes: 'Use white and light green parts' },
      { name: 'Scallions', ratio: '1 medium = 1 bunch' },
      { name: 'Onion powder', ratio: '1 medium = 1 tbsp' },
    ],
  },
  {
    original: 'garlic',
    alternatives: [
      { name: 'Garlic powder', ratio: '1 clove = 1/8 tsp' },
      { name: 'Garlic salt', ratio: '1 clove = 1/2 tsp', notes: 'Reduce other salt' },
      { name: 'Shallots', ratio: '1 clove = 1 small shallot' },
    ],
  },
];

/**
 * Find substitutions for an ingredient
 */
export function findSubstitutions(ingredient: string): Substitution | null {
  const normalized = ingredient.toLowerCase().trim();
  
  // Direct match
  let match = SUBSTITUTIONS.find(s => s.original.toLowerCase() === normalized);
  if (match) return match;
  
  // Partial match
  match = SUBSTITUTIONS.find(s => 
    normalized.includes(s.original.toLowerCase()) ||
    s.original.toLowerCase().includes(normalized)
  );
  
  return match || null;
}

/**
 * Get all available substitution categories
 */
export function getSubstitutionCategories(): string[] {
  return [...new Set(SUBSTITUTIONS.map(s => s.original))];
}

/**
 * Filter substitutions by dietary requirement
 */
export function filterByDiet(diet: string): Substitution[] {
  return SUBSTITUTIONS.map(sub => ({
    ...sub,
    alternatives: sub.alternatives.filter(alt => 
      alt.dietaryInfo?.includes(diet)
    ),
  })).filter(sub => sub.alternatives.length > 0);
}

/**
 * Get substitution suggestion text
 */
export function getSubstitutionText(sub: Substitution): string {
  const alts = sub.alternatives.slice(0, 3);
  return `Instead of ${sub.original}, try: ${alts.map(a => a.name).join(', ')}`;
}

/**
 * Check if any ingredients have known substitutions
 */
export function findSubstitutionsInRecipe(ingredients: string[]): Map<string, Substitution> {
  const found = new Map<string, Substitution>();
  
  for (const ingredient of ingredients) {
    const sub = findSubstitutions(ingredient);
    if (sub) {
      found.set(ingredient, sub);
    }
  }
  
  return found;
}
