/**
 * Ingredient & Equipment Photo Service
 * Fetches photos of ingredients and kitchen tools to help patients visually identify items
 */

export interface IngredientPhoto {
  url: string | null;
  alt: string;
  source: 'unsplash' | 'fallback';
}

// Re-export for equipment photos (same interface)
export type EquipmentPhoto = IngredientPhoto;

// Cache for ingredient photos
class IngredientPhotoCache {
  private cache: Map<string, IngredientPhoto> = new Map();
  private storageKey = 'ingredient-photos-cache';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cache = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.warn('Failed to load ingredient photo cache:', error);
    }
  }

  private saveToStorage() {
    try {
      const obj = Object.fromEntries(this.cache);
      localStorage.setItem(this.storageKey, JSON.stringify(obj));
    } catch (error) {
      console.warn('Failed to save ingredient photo cache:', error);
    }
  }

  get(key: string): IngredientPhoto | undefined {
    return this.cache.get(key.toLowerCase());
  }

  set(key: string, photo: IngredientPhoto) {
    this.cache.set(key.toLowerCase(), photo);
    this.saveToStorage();
  }
}

const photoCache = new IngredientPhotoCache();

/**
 * Generate search query for ingredient photo
 */
function generateIngredientSearchQuery(ingredientName: string): string {
  // Clean up the ingredient name
  let clean = ingredientName.toLowerCase()
    .replace(/\(.*?\)/g, '') // Remove parentheses
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .trim();

  // Map common ingredient variations to better search terms
  const ingredientMap: { [key: string]: string } = {
    'egg yolks': 'egg yolk',
    'egg whites': 'egg white',
    'eggs': 'egg',
    'garlic cloves': 'garlic',
    'onion': 'whole onion',
    'tomatoes': 'tomato',
    'potatoes': 'potato',
    'carrots': 'carrot',
    'chicken breast': 'raw chicken breast',
    'ground beef': 'raw ground beef',
    'bacon': 'raw bacon strips',
    'butter': 'butter stick',
    'flour': 'flour bag',
    'sugar': 'sugar white',
    'salt': 'salt',
    'pepper': 'black pepper',
    'oil': 'cooking oil bottle',
    'olive oil': 'olive oil bottle',
    'milk': 'milk carton',
    'cheese': 'cheese block',
    'pasta': 'dry pasta',
    'spaghetti': 'dry spaghetti',
    'rice': 'white rice',
    'bread': 'bread loaf',
    'lettuce': 'lettuce head',
    'spinach': 'fresh spinach',
    'mushrooms': 'mushroom',
    'bell pepper': 'bell pepper whole',
    'lemon': 'whole lemon',
    'lime': 'whole lime',
    'parsley': 'fresh parsley',
    'basil': 'fresh basil',
    'thyme': 'fresh thyme',
    'cilantro': 'fresh cilantro',
  };

  // Check if we have a mapped term
  for (const [key, value] of Object.entries(ingredientMap)) {
    if (clean.includes(key)) {
      return value;
    }
  }

  // Default: add "ingredient" or "food" for better results
  return `${clean} ingredient`;
}

/**
 * Fetch ingredient photo from Unsplash
 */
async function fetchUnsplashIngredientPhoto(query: string): Promise<string | null> {
  try {
    // Using Unsplash's public demo endpoint (no API key required for testing)
    // For production, replace with your Unsplash API key
    const url = `https://source.unsplash.com/400x300/?${encodeURIComponent(query)}`;
    
    // Test if the URL is accessible
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(3000)
    });
    
    if (response.ok) {
      return url;
    }
    return null;
  } catch (error) {
    console.warn('Failed to fetch Unsplash photo:', error);
    return null;
  }
}

/**
 * Create fallback emoji representation for ingredient
 */
function createFallbackIngredientPhoto(ingredientName: string): IngredientPhoto {
  const name = ingredientName.toLowerCase();
  
  // Map ingredients to emojis
  const emojiMap: { [key: string]: string } = {
    'egg': '🥚',
    'bacon': '🥓',
    'spaghetti': '🍝',
    'pasta': '🍝',
    'cheese': '🧀',
    'milk': '🥛',
    'butter': '🧈',
    'bread': '🍞',
    'tomato': '🍅',
    'onion': '🧅',
    'garlic': '🧄',
    'potato': '🥔',
    'carrot': '🥕',
    'pepper': '🌶️',
    'bell pepper': '🫑',
    'broccoli': '🥦',
    'mushroom': '🍄',
    'corn': '🌽',
    'cucumber': '🥒',
    'lettuce': '🥬',
    'spinach': '🥬',
    'avocado': '🥑',
    'lemon': '🍋',
    'lime': '🍋',
    'orange': '🍊',
    'apple': '🍎',
    'banana': '🍌',
    'strawberry': '🍓',
    'chicken': '🍗',
    'beef': '🥩',
    'pork': '🥓',
    'fish': '🐟',
    'shrimp': '🦐',
    'rice': '🍚',
    'salt': '🧂',
    'oil': '🫗',
    'water': '💧',
    'sugar': '🍬',
    'flour': '🌾',
    'pecorino': '🧀',
  };

  let emoji = '🥘'; // Default food emoji
  
  // Find matching emoji
  for (const [key, value] of Object.entries(emojiMap)) {
    if (name.includes(key)) {
      emoji = value;
      break;
    }
  }

  return {
    url: null,
    alt: `${emoji} ${ingredientName}`,
    source: 'fallback'
  };
}

/**
 * Get photo for an ingredient
 * @param ingredientName - Name of the ingredient (e.g., "Spaghetti", "Egg Yolks")
 * @returns IngredientPhoto with URL (Unsplash) or emoji fallback
 */
export async function getIngredientPhoto(ingredientName: string): Promise<IngredientPhoto> {
  // Check cache first
  const cached = photoCache.get(ingredientName);
  if (cached) {
    return cached;
  }

  // Generate search query
  const searchQuery = generateIngredientSearchQuery(ingredientName);

  // Try to fetch from Unsplash
  const unsplashUrl = await fetchUnsplashIngredientPhoto(searchQuery);

  let photo: IngredientPhoto;

  if (unsplashUrl) {
    photo = {
      url: unsplashUrl,
      alt: ingredientName,
      source: 'unsplash'
    };
  } else {
    // Use emoji fallback
    photo = createFallbackIngredientPhoto(ingredientName);
  }

  // Cache the result
  photoCache.set(ingredientName, photo);

  return photo;
}

/**
 * Generate search query for equipment/tool photo
 */
function generateEquipmentSearchQuery(equipmentName: string): string {
  // Clean up the equipment name
  let clean = equipmentName.toLowerCase()
    .replace(/\(.*?\)/g, '') // Remove parentheses
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .trim();

  // Map common equipment variations to better search terms
  const equipmentMap: { [key: string]: string } = {
    'pot': 'cooking pot',
    'pan': 'frying pan',
    'saucepan': 'saucepan',
    'skillet': 'skillet pan',
    'bowl': 'mixing bowl',
    'spoon': 'wooden spoon',
    'spatula': 'kitchen spatula',
    'whisk': 'wire whisk',
    'knife': 'kitchen knife',
    'cutting board': 'cutting board',
    'grater': 'cheese grater',
    'peeler': 'vegetable peeler',
    'colander': 'colander strainer',
    'strainer': 'kitchen strainer',
    'measuring cup': 'measuring cups',
    'measuring spoon': 'measuring spoons',
    'mixer': 'electric mixer',
    'blender': 'kitchen blender',
    'oven': 'kitchen oven',
    'stove': 'stove burner',
    'microwave': 'microwave oven',
    'baking sheet': 'baking sheet pan',
    'baking dish': 'glass baking dish',
    'casserole dish': 'casserole dish',
    'tongs': 'kitchen tongs',
    'ladle': 'soup ladle',
    'timer': 'kitchen timer',
    'thermometer': 'cooking thermometer',
    'rolling pin': 'rolling pin',
    'can opener': 'can opener',
    'garlic press': 'garlic press',
  };

  // Check if we have a mapped term
  for (const [key, value] of Object.entries(equipmentMap)) {
    if (clean.includes(key)) {
      return value;
    }
  }

  // Default: add "kitchen" for better results
  return `kitchen ${clean}`;
}

/**
 * Create fallback emoji representation for equipment
 */
function createFallbackEquipmentPhoto(equipmentName: string): EquipmentPhoto {
  const name = equipmentName.toLowerCase();
  
  // Map equipment to emojis
  const emojiMap: { [key: string]: string } = {
    'pot': '🍲',
    'pan': '🍳',
    'saucepan': '🍲',
    'skillet': '🍳',
    'bowl': '🥣',
    'spoon': '🥄',
    'fork': '🍴',
    'knife': '🔪',
    'spatula': '🥄',
    'whisk': '🥄',
    'cutting board': '🔪',
    'grater': '🧀',
    'peeler': '🔪',
    'colander': '🥣',
    'strainer': '🥣',
    'measuring cup': '🥛',
    'measuring spoon': '🥄',
    'mixer': '🔨',
    'blender': '🥤',
    'oven': '🔥',
    'stove': '🔥',
    'microwave': '📦',
    'baking sheet': '📋',
    'baking dish': '🍱',
    'casserole': '🍱',
    'tongs': '🔧',
    'ladle': '🥄',
    'timer': '⏱️',
    'thermometer': '🌡️',
    'rolling pin': '📏',
    'can opener': '🔧',
    'garlic press': '🔧',
  };

  let emoji = '🔧'; // Default tool emoji
  
  // Find matching emoji
  for (const [key, value] of Object.entries(emojiMap)) {
    if (name.includes(key)) {
      emoji = value;
      break;
    }
  }

  return {
    url: null,
    alt: `${emoji} ${equipmentName}`,
    source: 'fallback'
  };
}

/**
 * Get photo for kitchen equipment/tool
 * @param equipmentName - Name of the equipment (e.g., "Large Pot", "Wooden Spoon")
 * @returns EquipmentPhoto with URL (Unsplash) or emoji fallback
 */
export async function getEquipmentPhoto(equipmentName: string): Promise<EquipmentPhoto> {
  // Check cache first
  const cached = photoCache.get(equipmentName);
  if (cached) {
    return cached;
  }

  // Generate search query
  const searchQuery = generateEquipmentSearchQuery(equipmentName);

  // Try to fetch from Unsplash
  const unsplashUrl = await fetchUnsplashIngredientPhoto(searchQuery);

  let photo: EquipmentPhoto;

  if (unsplashUrl) {
    photo = {
      url: unsplashUrl,
      alt: equipmentName,
      source: 'unsplash'
    };
  } else {
    // Use emoji fallback
    photo = createFallbackEquipmentPhoto(equipmentName);
  }

  // Cache the result
  photoCache.set(equipmentName, photo);

  return photo;
}
