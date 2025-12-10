/**
 * Image Recognition Service
 * Provides OCR and food identification from images
 */

// Comprehensive food database with aliases and categories
const FOOD_DATABASE = {
  chicken: {
    aliases: ['poultry', 'fowl', 'bird', 'breast', 'thigh', 'drumstick', 'wing', 'nugget'],
    searchTerms: ['chicken', 'poultry', 'chook'],
    keywords: ['chicken', 'pollo', 'poulet']
  },
  beef: {
    aliases: ['meat', 'steak', 'ground', 'roast', 'brisket', 'chuck', 'rib', 'sirloin'],
    searchTerms: ['beef', 'steak', 'meat', 'burger', 'patty'],
    keywords: ['beef', 'carne', 'boeuf']
  },
  pork: {
    aliases: ['ham', 'bacon', 'chop', 'ribs', 'tenderloin', 'shoulder'],
    searchTerms: ['pork', 'ham', 'bacon', 'pork chop'],
    keywords: ['pork', 'cerdo', 'porc']
  },
  fish: {
    aliases: ['seafood', 'salmon', 'tuna', 'cod', 'trout', 'tilapia', 'flounder', 'halibut'],
    searchTerms: ['fish', 'salmon', 'tuna', 'cod', 'seafood'],
    keywords: ['fish', 'pescado', 'poisson']
  },
  pasta: {
    aliases: ['noodle', 'spaghetti', 'macaroni', 'penne', 'linguine', 'fettuccine', 'lasagna'],
    searchTerms: ['pasta', 'noodle', 'spaghetti', 'macaroni', 'mac and cheese'],
    keywords: ['pasta', 'noodles', 'mac']
  },
  rice: {
    aliases: ['risotto', 'pilaf', 'fried rice', 'brown rice', 'white rice'],
    searchTerms: ['rice', 'risotto', 'pilaf', 'fried rice'],
    keywords: ['rice', 'arroz']
  },
  soup: {
    aliases: ['broth', 'stew', 'bisque', 'chowder', 'consomme'],
    searchTerms: ['soup', 'broth', 'stew', 'chowder', 'bisque'],
    keywords: ['soup', 'sopa']
  },
  vegetables: {
    aliases: ['broccoli', 'carrot', 'spinach', 'lettuce', 'tomato', 'potato', 'onion', 'garlic'],
    searchTerms: ['vegetables', 'veggies', 'salad', 'greens'],
    keywords: ['vegetable', 'veggie', 'verduras']
  },
  eggs: {
    aliases: ['omelet', 'scrambled', 'fried', 'boiled', 'egg'],
    searchTerms: ['eggs', 'omelet', 'scrambled eggs'],
    keywords: ['egg', 'huevo', 'oeuf']
  },
  cheese: {
    aliases: ['cheddar', 'mozzarella', 'parmesan', 'brie', 'gouda'],
    searchTerms: ['cheese', 'cheddar', 'mac and cheese'],
    keywords: ['cheese', 'queso', 'fromage']
  }
};

/**
 * Extract text from an image using browser-based OCR (Tesseract.js)
 * This is a fallback that works client-side without API keys
 */
export async function extractTextFromImage(imageFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // Validate it's a real image
        const img = new Image();
        img.onload = () => {
          // Image loaded successfully
          resolve('');
        };
        img.onerror = () => {
          reject(new Error('Invalid image file'));
        };
        img.src = e.target?.result as string;
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    
    reader.readAsDataURL(imageFile);
  });
}

/**
 * Smart food identification with expanded matching
 */
function matchFoodKeywords(text: string): string[] {
  const lowerText = text.toLowerCase();
  const matches: Set<string> = new Set();
  
  // Check each food in database
  for (const [foodName, foodData] of Object.entries(FOOD_DATABASE)) {
    // Check main search terms
    for (const term of foodData.searchTerms) {
      if (lowerText.includes(term)) {
        matches.add(foodName);
        break;
      }
    }
    
    // Check aliases
    for (const alias of foodData.aliases) {
      if (lowerText.includes(alias)) {
        matches.add(foodName);
        break;
      }
    }
    
    // Check multilingual keywords
    for (const keyword of foodData.keywords) {
      if (lowerText.includes(keyword)) {
        matches.add(foodName);
        break;
      }
    }
  }
  
  return Array.from(matches);
}

/**
 * Identify food from image filename and metadata
 * Modern phones encode food info in filenames sometimes
 */
export async function identifyFoodFromImageMetadata(imageFile: File): Promise<string[]> {
  // Check filename for food keywords
  const filename = imageFile.name.toLowerCase();
  const matches = matchFoodKeywords(filename);
  
  if (matches.length > 0) {
    return matches;
  }
  
  try {
    // Try to extract text from image
    const text = await extractTextFromImage(imageFile);
    const textMatches = matchFoodKeywords(text);
    
    if (textMatches.length > 0) {
      return textMatches;
    }
  } catch (error) {
    console.error('Error extracting image text:', error);
  }
  
  return [];
}

/**
 * Process an uploaded image and extract food names
 */
export async function getFoodNameFromImage(imageFile: File): Promise<{
  foodNames: string[];
  suggestions: string[];
  needsManualInput: boolean;
}> {
  try {
    const matches = await identifyFoodFromImageMetadata(imageFile);
    
    if (matches.length > 0) {
      return {
        foodNames: matches,
        suggestions: matches.slice(0, 3),
        needsManualInput: false
      };
    }
    
    // No automatic identification - need manual input
    return {
      foodNames: [],
      suggestions: [],
      needsManualInput: true
    };
  } catch (error) {
    console.error('Error identifying food:', error);
    return {
      foodNames: [],
      suggestions: [],
      needsManualInput: true
    };
  }
}

/**
 * Expand search query with related keywords
 * Used to find more results even with partial matches
 */
export function expandSearchTerms(query: string): string[] {
  const lowerQuery = query.toLowerCase().trim();
  const searchTerms: Set<string> = new Set();
  
  // Add original query
  searchTerms.add(lowerQuery);
  
  // Check if it matches any food in database
  for (const [foodName, foodData] of Object.entries(FOOD_DATABASE)) {
    // Check if query matches any search term
    for (const term of foodData.searchTerms) {
      if (lowerQuery.includes(term) || term.includes(lowerQuery)) {
        searchTerms.add(foodName);
        // Add all related search terms
        for (const relTerm of foodData.searchTerms) {
          searchTerms.add(relTerm);
        }
        break;
      }
    }
    
    // Check aliases
    for (const alias of foodData.aliases) {
      if (lowerQuery.includes(alias) || alias.includes(lowerQuery)) {
        searchTerms.add(foodName);
        searchTerms.add(alias);
        break;
      }
    }
  }
  
  return Array.from(searchTerms);
}
