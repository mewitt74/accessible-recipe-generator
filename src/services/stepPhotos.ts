/**
 * Cooking Step Photo Service
 * Fetches relevant cooking photos for each recipe step
 * Uses Unsplash API and fallback to line-art SVG icons + text descriptions
 */

import { getIconSvg } from './iconLibrary';

export interface StepPhoto {
  url: string | null;
  alt: string;
  source: 'unsplash' | 'fallback' | 'generated';
}

type StepActionPattern = {
  regex: RegExp;
  iconName: string;
  fallbackEmoji: string;
  description: string;
};

const STEP_ACTION_PATTERNS: StepActionPattern[] = [
  {
    regex: /(chop|cut|slice|dice)/i,
    iconName: 'chop',
    fallbackEmoji: '🔪',
    description: 'Cut the ingredients into pieces',
  },
  {
    regex: /(boil|simmer|heat)/i,
    iconName: 'boil',
    fallbackEmoji: '🫖',
    description: 'Heat liquid until it bubbles',
  },
  {
    regex: /(fry|sauté|saute|stir)/i,
    iconName: 'fry',
    fallbackEmoji: '🍳',
    description: 'Cook in a hot pan with oil',
  },
  {
    regex: /(bake|roast|oven)/i,
    iconName: 'bake',
    fallbackEmoji: '🔥',
    description: 'Cook in the oven at high heat',
  },
  {
    regex: /(mix|combine|whisk|beat)/i,
    iconName: 'mix',
    fallbackEmoji: '🥄',
    description: 'Mix all ingredients together',
  },
  {
    regex: /(season|salt|pepper|spice)/i,
    iconName: 'season',
    fallbackEmoji: '🧂',
    description: 'Add salt, pepper, or spices',
  },
  {
    regex: /(drain|strain|pour off)/i,
    iconName: 'drain',
    fallbackEmoji: '🫗',
    description: 'Pour off extra liquid',
  },
  {
    regex: /(serve|plate|arrange)/i,
    iconName: 'serve',
    fallbackEmoji: '🍽️',
    description: 'Put food on plates to serve',
  },
  {
    regex: /(cool|chill|rest)/i,
    iconName: 'cool',
    fallbackEmoji: '❄️',
    description: 'Let the food cool down',
  },
];

export function getStepActionDetails(instruction: string): { emoji: string; description: string; svg?: string } | null {
  const lowerInstruction = instruction.toLowerCase();

  for (const pattern of STEP_ACTION_PATTERNS) {
    if (pattern.regex.test(lowerInstruction)) {
      return { 
        emoji: pattern.fallbackEmoji, 
        description: pattern.description,
        svg: getIconSvg(pattern.iconName),
      };
    }
  }

  return null;
}

/**
 * Generate search queries for cooking step photos
 * Based on the instruction, find relevant visual references
 */
export function generatePhotoSearchQuery(stepInstruction: string, mealTitle: string): string {
  const instruction = stepInstruction.toLowerCase();
  
  // Keywords that indicate specific cooking actions
  const actionKeywords: Record<string, string[]> = {
    'chop|cut|slice|dice': ['chopped vegetables', 'cutting board knife'],
    'boil|simmer|heat': ['boiling water pot', 'cooking pot stove'],
    'fry|saute|stir': ['frying pan cooking', 'stirring food'],
    'bake|roast|oven': ['oven baking', 'baking tray'],
    'mix|blend|combine': ['mixing bowl ingredients', 'mixing spoon'],
    'season|salt|pepper|spice': ['seasoning food', 'salt pepper'],
    'drain|strain|rinse': ['draining pasta', 'colander'],
    'serve|plate|arrange': ['plated food', 'food presentation'],
    'cool|chill': ['cooling rack', 'refrigerator'],
  };

  // Find matching action
  for (const [pattern, queries] of Object.entries(actionKeywords)) {
    if (new RegExp(pattern).test(instruction)) {
      // Return a query that includes the main ingredient and action
      const mainIngredient = extractMainIngredient(mealTitle);
      const action = queries[0];
      return `${mainIngredient} ${action}`;
    }
  }

  // Fallback: use meal title
  return `${mealTitle} cooking`;
}

/**
 * Extract main ingredient from meal title
 */
function extractMainIngredient(mealTitle: string): string {
  const ingredients = mealTitle.toLowerCase().split(/[\s,-]/);
  // Return first substantial word
  return ingredients.find(w => w.length > 2) || 'food';
}

/**
 * Fetch photo from Unsplash API
 * Free tier: 50 requests per hour (perfect for recipe app)
 */
export async function fetchUnsplashPhoto(query: string): Promise<StepPhoto | null> {
  try {
    // Using free Unsplash API without key (limited but works for this app)
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=1&order_by=relevant`;
    
    // Note: In production, add your Unsplash API key
    // For now, this will work with basic rate limits
    const response = await fetch(url, {
      headers: {
        'Accept-Version': 'v1'
      }
    });

    if (!response.ok) {
      console.warn(`Unsplash API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      return {
        url: photo.urls.regular,
        alt: photo.alt_description || query,
        source: 'unsplash'
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch Unsplash photo:', error);
    return null;
  }
}

/**
 * Get cooking step photo with fallback strategy
 * 1. Try Unsplash
 * 2. Use descriptive emoji + text
 */
export async function getCookingStepPhoto(
  stepInstruction: string,
  mealTitle: string
): Promise<StepPhoto> {
  // Generate search query
  const query = generatePhotoSearchQuery(stepInstruction, mealTitle);

  // Try Unsplash (with timeout)
  const unsplashPromise = fetchUnsplashPhoto(query);
  const timeoutPromise = new Promise<null>(resolve => 
    setTimeout(() => resolve(null), 3000) // 3 second timeout
  );

  const unsplashPhoto = await Promise.race([unsplashPromise, timeoutPromise]);
  
  if (unsplashPhoto) {
    return unsplashPhoto;
  }

  // Fallback: return emoji-based visual
  return createFallbackPhoto(stepInstruction);
}

/**
 * Create a fallback photo using emoji and text description
 */
function createFallbackPhoto(instruction: string): StepPhoto {
  const action = getStepActionDetails(instruction);

  if (action) {
    return {
      url: null,
      alt: `${action.emoji} ${action.description}`,
      source: 'fallback',
    };
  }

  // Default fallback
  return {
    url: null,
    alt: '👉 Do this step',
    source: 'fallback'
  };
}

/**
 * Cache system for photos (localStorage-based)
 */
export class PhotoCache {
  private cache = new Map<string, StepPhoto>();
  private storageKey = 'cooking-photo-cache';

  constructor() {
    this.loadFromStorage();
  }

  async getPhoto(query: string): Promise<StepPhoto> {
    if (this.cache.has(query)) {
      return this.cache.get(query)!;
    }

    const photo = await getCookingStepPhoto(query, query);
    this.cache.set(query, photo);
    this.saveToStorage();
    return photo;
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const entries = JSON.parse(stored);
        entries.forEach((entry: any) => {
          this.cache.set(entry.key, entry.value);
        });
      }
    } catch (error) {
      console.warn('Failed to load photo cache from storage');
    }
  }

  private saveToStorage() {
    try {
      const entries = Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        value
      }));
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    } catch (error) {
      console.warn('Failed to save photo cache to storage');
    }
  }

  clear() {
    this.cache.clear();
    localStorage.removeItem(this.storageKey);
  }
}

export const photoCache = new PhotoCache();
