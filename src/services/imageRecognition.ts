/**
 * Image Recognition Service
 * Provides OCR and food identification from images
 * Enhanced with recipe parsing for importing recipes from photos
 */

import { createWorker, type LoggerMessage, type Worker as TesseractWorker } from 'tesseract.js';
import { parseRecipeFromText, parsedRecipeToRecipe, isLikelyRecipe, ParsedRecipe } from './recipeParser';
import { Recipe } from '../types';

const TESSERACT_LANG = 'eng';
const TESSDATA_PATH = 'https://tessdata.projectnaptha.com/4.0.0_fast';
const TESSERACT_CACHE_NAMESPACE = 'accessible-recipe-ocr';

type OcrProgressUpdate = {
  status: string;
  progress: number;
};

type ProgressListener = (update: OcrProgressUpdate) => void;

type ExtendedWorker = TesseractWorker & {
  loadLanguage: (lang: string) => Promise<unknown>;
  initialize: (lang: string) => Promise<unknown>;
};

let workerPromise: Promise<ExtendedWorker> | null = null;
let activeProgressListener: ProgressListener | null = null;

function notifyProgress(status: string, progress: number) {
  if (activeProgressListener) {
    activeProgressListener({ status, progress });
  }
}

async function getOcrWorker(progressListener?: ProgressListener): Promise<ExtendedWorker> {
  if (progressListener) {
    activeProgressListener = progressListener;
  }

  if (!workerPromise) {
    workerPromise = (async () => {
      notifyProgress('Loading OCR engine', 0.05);

      const worker = await createWorker(
        undefined,
        undefined,
        {
          cachePath: TESSERACT_CACHE_NAMESPACE,
          langPath: TESSDATA_PATH,
          logger: (message: LoggerMessage) => {
            if (typeof message.progress === 'number') {
              notifyProgress(message.status, message.progress);
            }
          },
        },
      ) as ExtendedWorker;

      await worker.load();
      notifyProgress('Loading language data', 0.2);

      await worker.loadLanguage(TESSERACT_LANG);
      notifyProgress('Initializing OCR', 0.35);

      await worker.initialize(TESSERACT_LANG);
      notifyProgress('OCR ready', 0.5);

      return worker;
    })().catch((error) => {
      // Reset the promise so a future attempt can retry initialization
      workerPromise = null;
      throw error;
    });
  } else if (progressListener) {
    // If the worker already exists, let the caller know we can start soon
    notifyProgress('OCR ready', 0.5);
  }

  return workerPromise;
}

// Comprehensive food database with brands, aliases and categories
const FOOD_DATABASE = {
  'mac and cheese': {
    brands: ['kraft', 'velveeta', 'annie', 'stouffer'],
    aliases: ['macaroni', 'mac n cheese', 'mac & cheese', 'mac n\' cheese', 'macaroni and cheese', 'cheese pasta'],
    searchTerms: ['mac and cheese', 'macaroni and cheese', 'pasta'],
    keywords: ['mac', 'macaroni', 'cheese', 'kraft', 'velveeta']
  },
  chicken: {
    brands: ['tyson', 'perdue', 'foster farms'],
    aliases: ['poultry', 'fowl', 'bird', 'breast', 'thigh', 'drumstick', 'wing', 'nugget', 'tender'],
    searchTerms: ['chicken', 'poultry'],
    keywords: ['chicken', 'pollo', 'poulet']
  },
  beef: {
    brands: ['angus', 'wagyu'],
    aliases: ['meat', 'steak', 'ground', 'roast', 'brisket', 'chuck', 'rib', 'sirloin', 'hamburger'],
    searchTerms: ['beef', 'steak', 'meat', 'burger', 'patty'],
    keywords: ['beef', 'carne', 'boeuf', 'steak']
  },
  pork: {
    brands: ['hormel', 'oscar mayer', 'jimmy dean'],
    aliases: ['ham', 'bacon', 'chop', 'ribs', 'tenderloin', 'shoulder', 'sausage'],
    searchTerms: ['pork', 'ham', 'bacon', 'pork chop', 'sausage'],
    keywords: ['pork', 'cerdo', 'porc', 'bacon', 'ham']
  },
  fish: {
    brands: ['gorton', 'captain d', 'mrs paul'],
    aliases: ['seafood', 'salmon', 'tuna', 'cod', 'trout', 'tilapia', 'flounder', 'halibut', 'fish stick'],
    searchTerms: ['fish', 'salmon', 'tuna', 'cod', 'seafood'],
    keywords: ['fish', 'pescado', 'poisson', 'salmon', 'tuna']
  },
  pasta: {
    brands: ['barilla', 'mueller', 'ronzoni', 'de cecco'],
    aliases: ['noodle', 'spaghetti', 'macaroni', 'penne', 'linguine', 'fettuccine', 'lasagna', 'rotini'],
    searchTerms: ['pasta', 'noodle', 'spaghetti', 'macaroni'],
    keywords: ['pasta', 'noodles', 'spaghetti', 'macaroni']
  },
  rice: {
    brands: ['uncle ben', 'minute rice', 'riceland'],
    aliases: ['risotto', 'pilaf', 'fried rice', 'brown rice', 'white rice', 'jasmine', 'basmati'],
    searchTerms: ['rice', 'risotto', 'pilaf', 'fried rice'],
    keywords: ['rice', 'arroz']
  },
  soup: {
    brands: ['campbell', 'progresso', 'amy', 'pacific'],
    aliases: ['broth', 'stew', 'bisque', 'chowder', 'consomme', 'ramen'],
    searchTerms: ['soup', 'broth', 'stew', 'chowder', 'bisque'],
    keywords: ['soup', 'sopa', 'broth']
  },
  pizza: {
    brands: ['digiorno', 'tombstone', 'red baron', 'tony'],
    aliases: ['pie', 'flatbread', 'margherita', 'pepperoni'],
    searchTerms: ['pizza', 'flatbread'],
    keywords: ['pizza', 'pepperoni']
  },
  vegetables: {
    brands: ['green giant', 'birds eye'],
    aliases: ['broccoli', 'carrot', 'spinach', 'lettuce', 'tomato', 'potato', 'onion', 'garlic', 'peas', 'corn'],
    searchTerms: ['vegetables', 'veggies', 'salad', 'greens'],
    keywords: ['vegetable', 'veggie', 'verduras', 'broccoli', 'carrot']
  },
  eggs: {
    brands: ['eggland', 'land o lakes'],
    aliases: ['omelet', 'scrambled', 'fried', 'boiled', 'egg'],
    searchTerms: ['eggs', 'omelet', 'scrambled eggs'],
    keywords: ['egg', 'huevo', 'oeuf']
  },
  cheese: {
    brands: ['kraft', 'sargento', 'tillamook'],
    aliases: ['cheddar', 'mozzarella', 'parmesan', 'brie', 'gouda', 'american', 'swiss'],
    searchTerms: ['cheese', 'cheddar'],
    keywords: ['cheese', 'queso', 'fromage', 'cheddar']
  },
  burrito: {
    brands: ['el monterey', 'jose ole', 'evol'],
    aliases: ['wrap', 'tortilla', 'burrito bowl'],
    searchTerms: ['burrito', 'wrap', 'tortilla'],
    keywords: ['burrito', 'wrap', 'mexican']
  },
  lasagna: {
    brands: ['stouffer', 'marie callender'],
    aliases: ['lasagne'],
    searchTerms: ['lasagna', 'lasagne', 'pasta'],
    keywords: ['lasagna', 'lasagne']
  },
  'mashed potatoes': {
    brands: ['idahoan', 'betty crocker'],
    aliases: ['potato', 'spud', 'mash'],
    searchTerms: ['mashed potatoes', 'potato'],
    keywords: ['potato', 'mashed', 'spud']
  }
};

/**
 * Extract text from an image using Tesseract.js OCR
 * This performs OCR on food package photos to read brand names and product names
 */
export async function extractTextFromImage(
  imageFile: File,
  onProgress?: (update: OcrProgressUpdate) => void,
): Promise<string> {
  activeProgressListener = onProgress ?? null;

  try {
    console.log('Starting OCR on image...');

    const worker = await getOcrWorker(onProgress ?? undefined);

    notifyProgress('Reading image', 0.4);
    const { data } = await worker.recognize(imageFile);

    notifyProgress('Completed OCR', 1);

    console.log('OCR completed. Extracted text:', data.text);

    return data.text || '';
  } catch (error) {
    console.error('OCR error:', error);
    return '';
  } finally {
    activeProgressListener = null;
  }
}

/**
 * Smart food identification with expanded matching including brand names
 */
function matchFoodKeywords(text: string): string[] {
  const lowerText = text.toLowerCase();
  const matches: Set<string> = new Set();
  const matchScores: Map<string, number> = new Map();
  
  // Check each food in database
  for (const [foodName, foodData] of Object.entries(FOOD_DATABASE)) {
    let score = 0;
    
    // Check brand names (highest priority - 10 points)
    if (foodData.brands) {
      for (const brand of foodData.brands) {
        if (lowerText.includes(brand)) {
          score += 10;
          break;
        }
      }
    }
    
    // Check main search terms (5 points)
    for (const term of foodData.searchTerms) {
      if (lowerText.includes(term)) {
        score += 5;
        break;
      }
    }
    
    // Check aliases (3 points)
    for (const alias of foodData.aliases) {
      if (lowerText.includes(alias)) {
        score += 3;
        break;
      }
    }
    
    // Check multilingual keywords (2 points)
    for (const keyword of foodData.keywords) {
      if (lowerText.includes(keyword)) {
        score += 2;
        break;
      }
    }
    
    if (score > 0) {
      matches.add(foodName);
      matchScores.set(foodName, score);
    }
  }
  
  // Sort by score (highest first)
  return Array.from(matches).sort((a, b) => {
    const scoreA = matchScores.get(a) || 0;
    const scoreB = matchScores.get(b) || 0;
    return scoreB - scoreA;
  });
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
 * Process an uploaded image and extract food names using OCR
 */
export async function getFoodNameFromImage(imageFile: File): Promise<{
  foodNames: string[];
  suggestions: string[];
  needsManualInput: boolean;
}> {
  try {
    console.log('Processing image for food identification...');
    
    // Always perform OCR on the image to read text from packages
    const extractedText = await extractTextFromImage(imageFile);
    
    if (extractedText && extractedText.length > 10) {
      console.log('Extracted text from image:', extractedText);
      
      // Match food keywords from extracted text
      const matches = matchFoodKeywords(extractedText);
      
      if (matches.length > 0) {
        console.log('Found food matches:', matches);
        return {
          foodNames: matches,
          suggestions: matches.slice(0, 5),
          needsManualInput: false
        };
      }
    }
    
    // Try filename as fallback
    const filenameMatches = await identifyFoodFromImageMetadata(imageFile);
    
    if (filenameMatches.length > 0) {
      return {
        foodNames: filenameMatches,
        suggestions: filenameMatches.slice(0, 3),
        needsManualInput: false
      };
    }
    
    // No automatic identification - need manual input
    console.log('Could not identify food from image');
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

/**
 * Import a recipe from an image (cookbook page, printed recipe, etc.)
 * Uses OCR to extract text, then parses it into a structured recipe
 */
interface ImportOptions {
  onProgress?: (update: OcrProgressUpdate) => void;
}

export async function importRecipeFromImage(
  imageFile: File,
  options: ImportOptions = {},
): Promise<{
  success: boolean;
  recipe?: Recipe;
  parsedRecipe?: ParsedRecipe;
  rawText?: string;
  error?: string;
  isRecipe: boolean;
}> {
  try {
    console.log('Starting recipe import from image...');
    
    // Extract text from image using OCR
    const rawText = await extractTextFromImage(imageFile, options.onProgress);
    
    if (!rawText || rawText.trim().length < 20) {
      return {
        success: false,
        error: 'Could not extract readable text from the image. Try a clearer photo with good lighting.',
        isRecipe: false,
        rawText: rawText || '',
      };
    }
    
    console.log('Extracted text:', rawText.substring(0, 200) + '...');
    
    // Check if this looks like a recipe
    const isRecipe = isLikelyRecipe(rawText);
    
    if (!isRecipe) {
      // This might be a food package - try food identification instead
      console.log('Text does not look like a recipe, may be a food package');
      return {
        success: false,
        rawText,
        isRecipe: false,
        error: 'This doesn\'t appear to be a recipe. It might be a food package - try using "Search by Photo" instead.',
      };
    }
    
    // Parse the recipe text
    const parsedRecipe = parseRecipeFromText(rawText);
    
    console.log('Parsed recipe:', {
      title: parsedRecipe.title,
      ingredients: parsedRecipe.ingredients.length,
      instructions: parsedRecipe.instructions.length,
      confidence: parsedRecipe.confidence,
    });
    
    // Check if we got meaningful content
    if (parsedRecipe.ingredients.length === 0 && parsedRecipe.instructions.length === 0) {
      return {
        success: false,
        rawText,
        parsedRecipe,
        isRecipe: true,
        error: 'Found a recipe but could not parse ingredients or instructions. You may need to edit it manually.',
      };
    }
    
    // Convert to standard Recipe format
    const recipe = parsedRecipeToRecipe(parsedRecipe);
    
    return {
      success: true,
      recipe,
      parsedRecipe,
      rawText,
      isRecipe: true,
    };
  } catch (error) {
    console.error('Recipe import error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import recipe from image',
      isRecipe: false,
    };
  }
}

/**
 * Extract cooking instructions from an image (box label, recipe card, etc.)
 * Returns structured steps without needing full recipe parsing
 */
export async function extractInstructionsFromImage(
  imageFile: File,
  onProgress?: ProgressListener,
): Promise<{
  success: boolean;
  instructions: string[];
  rawText: string;
  error?: string;
}> {
  try {
    console.log('Extracting instructions from image...');
    
    // Extract raw text from image
    const text = await extractTextFromImage(imageFile, onProgress);
    
    if (!text || text.trim().length < 20) {
      return {
        success: false,
        instructions: [],
        rawText: text || '',
        error: 'Could not read text from the image. Try a clearer photo with good lighting.',
      };
    }

    console.log('Extracted text:', text.substring(0, 200) + '...');

    // Parse instructions from the text
    const instructions = parseInstructionsFromText(text);

    if (instructions.length === 0) {
      return {
        success: false,
        instructions: [],
        rawText: text,
        error: 'Could not find cooking instructions in the text. Make sure the image shows step-by-step instructions.',
      };
    }

    console.log('Found instructions:', {
      count: instructions.length,
      first: instructions[0].substring(0, 50),
    });

    return {
      success: true,
      instructions,
      rawText: text,
    };
  } catch (error) {
    console.error('Instruction extraction error:', error);
    return {
      success: false,
      instructions: [],
      rawText: '',
      error: error instanceof Error ? error.message : 'Failed to extract instructions from image',
    };
  }
}

/**
 * Parse cooking instruction steps from text
 * Handles various formats (numbered, bulleted, paragraphs)
 */
function parseInstructionsFromText(text: string): string[] {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const instructions: string[] = [];

  // Keywords that indicate instructions section
  const instructionKeywords = ['step', 'instruction', 'direction', 'procedure', 'heat', 'cook', 'bake', 'mix', 'add', 'combine'];
  let inInstructionSection = false;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    // Check if entering instruction section
    if (instructionKeywords.some(k => lowerLine.includes(k)) && line.length < 80) {
      inInstructionSection = true;
      continue;
    }

    // Skip header lines and very short lines
    if (line.length < 10 || line.length > 300) continue;

    // Extract instruction lines (numbered, bulleted, or plain text)
    const isNumbered = /^\d+[\.\)]\s+/.test(line);
    const isBulleted = /^[\-•●]\s+/.test(line);
    const isCookingAction = /^(heat|cook|bake|mix|add|combine|stir|fry|boil|simmer|steam|preheat|melt|chop|slice|dice|pour|blend|whisk|fold|serve)/i.test(line);

    if (isNumbered || isBulleted || isCookingAction || inInstructionSection) {
      // Clean up the line
      let instruction = line
        .replace(/^\d+[\.\)]\s+/, '') // Remove leading numbers
        .replace(/^[\-•●]\s+/, '')    // Remove bullets
        .trim();

      if (instruction.length > 10) {
        instructions.push(instruction);
      }
    }
  }

  // If we found some instructions, return them
  if (instructions.length > 0) {
    return instructions;
  }

  // Fallback: treat each non-empty line as a potential instruction
  const fallback = lines
    .filter(line => line.length > 20 && line.length < 300)
    .slice(0, 20); // Max 20 steps

  return fallback;
}

/**
 * Re-export parser types for convenience
 */
export type { ParsedRecipe };
export type { OcrProgressUpdate };
export { parseRecipeFromText, parsedRecipeToRecipe, isLikelyRecipe };
