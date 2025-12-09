export interface Ingredient {
  amount: string;
  name: string;
  note?: string;
}

export interface Step {
  section: string;
  shortTitle: string;
  instruction: string;
}

export interface Recipe {
  title: string;
  subtitle?: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  calories?: number;
  ingredients: Ingredient[];
  equipment: string[];
  steps: Step[];
  tips?: string[];
}
