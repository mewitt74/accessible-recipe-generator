/**
 * Basic Recipes Library
 * Simple, safe cooking instructions for common tasks
 * Designed for cognitive accessibility and TBI patients
 */

import type { Recipe } from '../types';

export const basicRecipes: Recipe[] = [
  {
    id: 'basic-fried-egg',
    title: 'Fried Egg',
    description: 'Simple fried egg - perfect for breakfast',
    prepTimeMinutes: 2,
    cookTimeMinutes: 5,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { name: 'Egg', amount: '1 whole' },
      { name: 'Butter', amount: '1 tsp' },
      { name: 'Salt', amount: 'Pinch' },
      { name: 'Pepper', amount: 'Pinch' }
    ],
    equipment: ['Small Frying Pan', 'Spatula', 'Plate'],
    steps: [
      { stepNumber: 1, instruction: 'Put the frying pan on the stove. Turn heat to MEDIUM.' },
      { stepNumber: 2, instruction: 'Add butter to the pan. Wait until it melts and bubbles.' },
      { stepNumber: 3, instruction: 'Crack the egg into the pan. BE CAREFUL - pan is HOT.' },
      { stepNumber: 4, instruction: 'Cook for 3-4 minutes. The white part should be solid, not clear.' },
      { stepNumber: 5, instruction: 'Use the spatula to slide the egg onto a plate.' },
      { stepNumber: 6, instruction: 'Add a little salt and pepper. Turn off the stove.' }
    ],
    tags: ['breakfast', 'easy', 'quick', 'beginner'],
    categories: ['breakfast', 'basic']
  },
  {
    id: 'basic-scrambled-eggs',
    title: 'Scrambled Eggs',
    description: 'Soft scrambled eggs',
    prepTimeMinutes: 2,
    cookTimeMinutes: 5,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { name: 'Eggs', amount: '2'},
      { name: 'Butter', amount: '1 tsp'},
      { name: 'Milk', amount: '1 tbsp'},
      { name: 'Salt', amount: 'Pinch'}
    ],
    equipment: ['Bowl', 'Fork', 'Small Pan', 'Spatula', 'Plate'],
    steps: [
      { stepNumber: 1, instruction: 'Crack eggs into a bowl. Add milk and a pinch of salt.' },
      { stepNumber: 2, instruction: 'Use a fork to beat the eggs until yellow and mixed.' },
      { stepNumber: 3, instruction: 'Put pan on stove. Turn heat to MEDIUM. Add butter.' },
      { stepNumber: 4, instruction: 'Pour eggs into pan when butter melts.' },
      { stepNumber: 5, instruction: 'Stir slowly with spatula. Keep stirring for 3-4 minutes.' },
      { stepNumber: 6, instruction: 'When eggs look soft and fluffy, put on plate. Turn off stove.' }
    ],
    tags: ['breakfast', 'easy', 'quick', 'beginner'],
    categories: ['breakfast', 'basic']
  },
  {
    id: 'basic-toast',
    title: 'Toast with Butter',
    description: 'Simple buttered toast',
    prepTimeMinutes: 1,
    cookTimeMinutes: 3,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { name: 'Bread', amount: '2 slices'},
      { name: 'Butter', amount: '2 tsp'}
    ],
    equipment: ['Toaster', 'Butter Knife', 'Plate'],
    steps: [
      { stepNumber: 1, instruction: 'Put bread slices in the toaster.' },
      { stepNumber: 2, instruction: 'Push down the lever to start toasting.' },
      { stepNumber: 3, instruction: 'Wait 2-3 minutes. Toast will pop up when ready.' },
      { stepNumber: 4, instruction: 'BE CAREFUL - toast is HOT! Put on plate.' },
      { stepNumber: 5, instruction: 'Spread butter on the warm toast with knife.' },
      { stepNumber: 6, instruction: 'Let it cool for 1 minute before eating.' }
    ],
    tags: ['breakfast', 'easy', 'quick', 'beginner'],
    categories: ['breakfast', 'basic']
  },
  {
    id: 'basic-tea',
    title: 'Cup of Tea',
    description: 'Hot tea with milk and sugar',
    prepTimeMinutes: 2,
    cookTimeMinutes: 5,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { name: 'Water', amount: '1 cup'},
      { name: 'Tea Bag', amount: '1'},
      { name: 'Milk', amount: '2 tbsp'},
      { name: 'Sugar', amount: '1-2 tsp'}
    ],
    equipment: ['Kettle', 'Mug', 'Spoon'],
    steps: [
      { stepNumber: 1, instruction: 'Fill kettle with water. Turn it on to boil.' },
      { stepNumber: 2, instruction: 'Put tea bag in your mug.' },
      { stepNumber: 3, instruction: 'When kettle boils, pour hot water into mug. BE CAREFUL - VERY HOT!' },
      { stepNumber: 4, instruction: 'Let tea steep for 3-4 minutes. Water will turn brown.' },
      { stepNumber: 5, instruction: 'Take out tea bag with spoon. Squeeze it gently.' },
      { stepNumber: 6, instruction: 'Add milk and sugar. Stir well. Wait 2 minutes to cool before drinking.' }
    ],
    tags: ['drink', 'easy', 'quick', 'beginner'],
    categories: ['drinks', 'basic']
  },
  {
    id: 'basic-coffee',
    title: 'Cup of Coffee',
    description: 'Simple instant coffee',
    prepTimeMinutes: 1,
    cookTimeMinutes: 3,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { name: 'Water', amount: '1 cup'},
      { name: 'Instant Coffee', amount: '1-2 tsp'},
      { name: 'Milk', amount: '2 tbsp'},
      { name: 'Sugar', amount: '1-2 tsp'}
    ],
    equipment: ['Kettle', 'Mug', 'Spoon'],
    steps: [
      { stepNumber: 1, instruction: 'Fill kettle with water. Turn it on to boil.' },
      { stepNumber: 2, instruction: 'Put 1-2 teaspoons of instant coffee in your mug.' },
      { stepNumber: 3, instruction: 'When kettle boils, pour hot water into mug. BE CAREFUL - VERY HOT!' },
      { stepNumber: 4, instruction: 'Add milk and sugar if you want them.' },
      { stepNumber: 5, instruction: 'Stir well with spoon for 30 seconds.' },
      { stepNumber: 6, instruction: 'Wait 2 minutes to cool before drinking.' }
    ],
    tags: ['drink', 'easy', 'quick', 'beginner'],
    categories: ['drinks', 'basic']
  },
  {
    id: 'basic-sandwich',
    title: 'Simple Sandwich',
    description: 'Easy cheese and ham sandwich',
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { name: 'Bread', amount: '2 slices'},
      { name: 'Cheese', amount: '2 slices'},
      { name: 'Ham', amount: '2 slices'},
      { name: 'Butter', amount: '1 tsp'},
      { name: 'Lettuce', amount: '1 leaf'}
    ],
    equipment: ['Butter Knife', 'Cutting Board', 'Plate'],
    steps: [
      { stepNumber: 1, instruction: 'Put 2 slices of bread on a plate.' },
      { stepNumber: 2, instruction: 'Spread butter on one side of each slice.' },
      { stepNumber: 3, instruction: 'Put cheese slices on one piece of bread.' },
      { stepNumber: 4, instruction: 'Add ham slices on top of the cheese.' },
      { stepNumber: 5, instruction: 'Add lettuce leaf on top of ham.' },
      { stepNumber: 6, instruction: 'Put the other bread slice on top. Press down gently. Cut in half if you want.' }
    ],
    tags: ['lunch', 'easy', 'quick', 'beginner', 'no-cook'],
    categories: ['lunch', 'basic']
  },
  {
    id: 'basic-cereal',
    title: 'Bowl of Cereal',
    description: 'Simple breakfast cereal with milk',
    prepTimeMinutes: 2,
    cookTimeMinutes: 0,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { name: 'Cereal', amount: '1 cup'},
      { name: 'Milk', amount: '1 cup'}
    ],
    equipment: ['Bowl', 'Spoon'],
    steps: [
      { stepNumber: 1, instruction: 'Get a clean bowl and spoon.' },
      { stepNumber: 2, instruction: 'Pour cereal into the bowl. Fill it halfway.' },
      { stepNumber: 3, instruction: 'Pour milk over the cereal until cereal is covered.' },
      { stepNumber: 4, instruction: 'Eat right away before cereal gets soggy.' }
    ],
    tags: ['breakfast', 'easy', 'quick', 'beginner', 'no-cook'],
    categories: ['breakfast', 'basic']
  },
  {
    id: 'basic-pasta',
    title: 'Simple Pasta',
    description: 'Basic boiled pasta with butter',
    prepTimeMinutes: 2,
    cookTimeMinutes: 12,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { name: 'Pasta', amount: '100g'},
      { name: 'Water', amount: '4 cups'},
      { name: 'Salt', amount: '1 tsp'},
      { name: 'Butter', amount: '1 tbsp'}
    ],
    equipment: ['Large Pot', 'Wooden Spoon', 'Colander', 'Bowl'],
    steps: [
      { stepNumber: 1, instruction: 'Fill a large pot with water. Add salt. Put on stove.' },
      { stepNumber: 2, instruction: 'Turn heat to HIGH. Wait for water to boil (big bubbles).' },
      { stepNumber: 3, instruction: 'When boiling, add pasta. Stir with wooden spoon.' },
      { stepNumber: 4, instruction: 'Set timer for 10 minutes. Stir every 2 minutes.' },
      { stepNumber: 5, instruction: 'When timer rings, turn off stove. Pour pasta into colander in sink. BE CAREFUL - VERY HOT STEAM!' },
      { stepNumber: 6, instruction: 'Put pasta in bowl. Add butter. Stir and eat.' }
    ],
    tags: ['lunch', 'dinner', 'easy', 'beginner'],
    categories: ['lunch', 'dinner', 'basic']
  },
  {
    id: 'basic-grilled-cheese',
    title: 'Grilled Cheese Sandwich',
    description: 'Toasted cheese sandwich',
    prepTimeMinutes: 3,
    cookTimeMinutes: 6,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { name: 'Bread', amount: '2 slices'},
      { name: 'Cheese', amount: '2 slices'},
      { name: 'Butter', amount: '2 tsp'}
    ],
    equipment: ['Frying Pan', 'Spatula', 'Plate'],
    steps: [
      { stepNumber: 1, instruction: 'Butter one side of each bread slice.' },
      { stepNumber: 2, instruction: 'Put cheese between bread slices. Butter sides should be on outside.' },
      { stepNumber: 3, instruction: 'Put pan on stove. Turn heat to MEDIUM.' },
      { stepNumber: 4, instruction: 'Put sandwich in pan when it gets warm.' },
      { stepNumber: 5, instruction: 'Cook for 3 minutes. Bottom should be golden brown. Flip with spatula. BE CAREFUL - HOT!' },
      { stepNumber: 6, instruction: 'Cook other side for 3 minutes. When both sides are brown, put on plate. Turn off stove. Wait 1 minute before eating.' }
    ],
    tags: ['lunch', 'easy', 'quick', 'beginner'],
    categories: ['lunch', 'basic']
  },
  {
    id: 'basic-oatmeal',
    title: 'Bowl of Oatmeal',
    description: 'Warm oatmeal for breakfast',
    prepTimeMinutes: 1,
    cookTimeMinutes: 5,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { name: 'Oats', amount: '1/2 cup'},
      { name: 'Water', amount: '1 cup'},
      { name: 'Salt', amount: 'Pinch'},
      { name: 'Sugar', amount: '1 tsp'},
      { name: 'Milk', amount: '2 tbsp'}
    ],
    equipment: ['Small Pot', 'Wooden Spoon', 'Bowl'],
    steps: [
      { stepNumber: 1, instruction: 'Put water in pot. Add oats and a pinch of salt.' },
      { stepNumber: 2, instruction: 'Put pot on stove. Turn heat to MEDIUM.' },
      { stepNumber: 3, instruction: 'Stir with wooden spoon. Keep stirring every minute.' },
      { stepNumber: 4, instruction: 'Cook for 5 minutes. Oats will get thick and creamy.' },
      { stepNumber: 5, instruction: 'Turn off stove. Pour oatmeal into bowl.' },
      { stepNumber: 6, instruction: 'Add milk and sugar. Stir. Wait 1 minute to cool before eating.' }
    ],
    tags: ['breakfast', 'easy', 'healthy', 'beginner'],
    categories: ['breakfast', 'basic']
  }
];

/**
 * Search basic recipes by keyword
 */
export function searchBasicRecipes(query: string): Recipe[] {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) {
    return basicRecipes;
  }
  
  return basicRecipes.filter(recipe => {
    return (
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.description?.toLowerCase().includes(searchTerm) ||
      recipe.tags?.some(tag => tag.includes(searchTerm)) ||
      recipe.categories?.some(cat => cat.includes(searchTerm))
    );
  });
}

/**
 * Get a basic recipe by ID
 */
export function getBasicRecipe(id: string): Recipe | undefined {
  return basicRecipes.find(r => r.id === id);
}

/**
 * Get all basic recipe titles for autocomplete
 */
export function getBasicRecipeTitles(): string[] {
  return basicRecipes.map(r => r.title);
}
