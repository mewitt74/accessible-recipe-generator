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
 * Create emoji representation for ingredient (cleaner than photos with watermarks)
 */
function createFallbackIngredientPhoto(ingredientName: string): IngredientPhoto {
  const name = ingredientName.toLowerCase();
  
  // Map ingredients to emojis - comprehensive list
  const emojiMap: { [key: string]: string } = {
    // Proteins
    'egg': '🥚',
    'bacon': '🥓',
    'chicken': '🍗',
    'beef': '🥩',
    'steak': '🥩',
    'pork': '🥓',
    'ham': '🍖',
    'fish': '🐟',
    'salmon': '🐟',
    'tuna': '🐟',
    'shrimp': '🦐',
    'prawn': '🦐',
    'crab': '🦀',
    'lobster': '🦞',
    'sausage': '🌭',
    'turkey': '🦃',
    
    // Dairy
    'cheese': '🧀',
    'cheddar': '🧀',
    'mozzarella': '🧀',
    'parmesan': '🧀',
    'pecorino': '🧀',
    'milk': '🥛',
    'cream': '🥛',
    'butter': '🧈',
    'yogurt': '🥛',
    
    // Bread & Grains
    'bread': '🍞',
    'toast': '🍞',
    'rice': '🍚',
    'pasta': '🍝',
    'spaghetti': '🍝',
    'noodle': '🍜',
    'macaroni': '🍝',
    'flour': '🌾',
    'oat': '🌾',
    'cereal': '🥣',
    'bagel': '🥯',
    'croissant': '🥐',
    'pancake': '🥞',
    'waffle': '🧇',
    'tortilla': '🫓',
    
    // Vegetables
    'tomato': '🍅',
    'onion': '🧅',
    'garlic': '🧄',
    'potato': '🥔',
    'carrot': '🥕',
    'pepper': '🌶️',
    'chili': '🌶️',
    'chilli': '🌶️',
    'bell pepper': '🫑',
    'broccoli': '🥦',
    'mushroom': '🍄',
    'corn': '🌽',
    'cucumber': '🥒',
    'pickle': '🥒',
    'lettuce': '🥬',
    'spinach': '🥬',
    'kale': '🥬',
    'cabbage': '🥬',
    'avocado': '🥑',
    'eggplant': '🍆',
    'aubergine': '🍆',
    'pea': '🫛',
    'bean': '🫘',
    'ginger': '🫚',
    'celery': '🥬',
    
    // Fruits
    'lemon': '🍋',
    'lime': '🍋',
    'orange': '🍊',
    'apple': '🍎',
    'banana': '🍌',
    'strawberry': '🍓',
    'blueberry': '🫐',
    'grape': '🍇',
    'watermelon': '🍉',
    'melon': '🍈',
    'peach': '🍑',
    'pear': '🍐',
    'cherry': '🍒',
    'pineapple': '🍍',
    'mango': '🥭',
    'coconut': '🥥',
    'kiwi': '🥝',
    
    // Seasonings & Condiments
    'salt': '🧂',
    'pepper spice': '🧂',
    'sugar': '🍬',
    'honey': '🍯',
    'oil': '🫗',
    'olive oil': '🫒',
    'vinegar': '🫗',
    'soy sauce': '🫗',
    'ketchup': '🍅',
    'mustard': '🟡',
    'mayonnaise': '🥚',
    'mayo': '🥚',
    'hot sauce': '🌶️',
    'herb': '🌿',
    'basil': '🌿',
    'parsley': '🌿',
    'cilantro': '🌿',
    'mint': '🌿',
    'oregano': '🌿',
    'thyme': '🌿',
    'rosemary': '🌿',
    
    // Liquids
    'water': '💧',
    'stock': '🥣',
    'broth': '🥣',
    'soup': '🥣',
    'juice': '🧃',
    'wine': '🍷',
    'beer': '🍺',
    'coffee': '☕',
    'tea': '🍵',
    
    // Other
    'chocolate': '🍫',
    'candy': '🍬',
    'ice cream': '🍨',
    'pizza': '🍕',
    'burger': '🍔',
    'sandwich': '🥪',
    'taco': '🌮',
    'burrito': '🌯',
    'fry': '🍟',
    'fries': '🍟',
    'popcorn': '🍿',
    'pretzel': '🥨',
    'cookie': '🍪',
    'cake': '🎂',
    'pie': '🥧',
    'cupcake': '🧁',
    'donut': '🍩',
    'nut': '🥜',
    'peanut': '🥜',
    'almond': '🥜',
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
    alt: emoji,
    source: 'fallback'
  };
}

/**
 * Get photo for an ingredient
 * Uses emoji icons for clean, simple display (no watermarks)
 * @param ingredientName - Name of the ingredient (e.g., "Spaghetti", "Egg Yolks")
 * @returns IngredientPhoto with emoji representation
 */
export async function getIngredientPhoto(ingredientName: string): Promise<IngredientPhoto> {
  // Check cache first
  const cached = photoCache.get(ingredientName);
  if (cached) {
    return cached;
  }

  // Use emoji fallback for clean display (no watermarked photos)
  const photo = createFallbackIngredientPhoto(ingredientName);

  // Cache the result
  photoCache.set(ingredientName, photo);

  return photo;
}

/**
 * Create emoji representation for equipment (cleaner than photos with watermarks)
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
    alt: emoji,
    source: 'fallback'
  };
}

/**
 * Get photo for kitchen equipment/tool
 * Uses emoji icons for clean, simple display (no watermarks)
 * @param equipmentName - Name of the equipment (e.g., "Large Pot", "Wooden Spoon")
 * @returns EquipmentPhoto with emoji representation
 */
export async function getEquipmentPhoto(equipmentName: string): Promise<EquipmentPhoto> {
  // Check cache first
  const cached = photoCache.get(equipmentName);
  if (cached) {
    return cached;
  }

  // Use emoji fallback for clean display (no watermarked photos)
  const photo = createFallbackEquipmentPhoto(equipmentName);

  // Cache the result
  photoCache.set(equipmentName, photo);

  return photo;
}
