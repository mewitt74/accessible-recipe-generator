export interface Ingredient {
  amount: string;
  name: string;
  note?: string;
}

export interface Step {
  stepNumber?: number;
  section?: 'Prep' | 'Cook Main' | 'Cook Side' | 'Make Sauce' | 'Finish & Serve';
  shortTitle?: string;
  instruction: string;
}

export interface Recipe {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty?: string;
  calories?: number;
  ingredients: Ingredient[];
  equipment: string[];
  steps: Step[];
  tips?: string[];
  tags?: string[];
  categories?: string[];
}

// Validation constraints from requirements
export const RECIPE_CONSTRAINTS = {
  MAX_TITLE_LENGTH: 60,
  MAX_SUBTITLE_LENGTH: 80,
  MAX_INSTRUCTION_LENGTH: 150,
  MAX_TIP_LENGTH: 100,
  MIN_STEPS: 3,
  MAX_STEPS: 12,
  MAX_INGREDIENTS: 15,
  MAX_EQUIPMENT: 10,
  MAX_TIPS: 3,
  MIN_FONT_SIZE_PX: 18,
} as const;
