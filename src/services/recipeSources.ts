/**
 * Recipe Source Integrations
 * 
 * Supports multiple ad-free recipe sources:
 * - RecipesWithoutAds.com
 * - Recipe-Free.com
 * - TheMealDB API (existing)
 */

import { Recipe, Ingredient, Step } from '../types';

export interface RecipeSource {
  name: string;
  domain: string;
  searchUrl: (query: string) => string;
  parseRecipeHtml: (html: string, url: string) => Promise<Recipe | null>;
}

/**
 * RecipesWithoutAds.com Source
 * Clean recipe site with no ads
 */
const recipesWithoutAdsSource: RecipeSource = {
  name: 'RecipesWithoutAds.com',
  domain: 'recipeswithoutsads.com',
  searchUrl: (query: string) => `https://www.recipeswithoutsads.com/search/${encodeURIComponent(query)}`,
  parseRecipeHtml: async (html: string, url: string) => {
    try {
      // Parse recipe from RecipesWithoutAds HTML
      const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
      const title = titleMatch ? titleMatch[1].trim() : 'Recipe';

      // Extract ingredients - typically in a list
      const ingredientMatches = html.match(
        /<li[^>]*class="ingredient[^"]*"[^>]*>([^<]+)<\/li>/gi
      ) || [];
      
      const ingredients: Ingredient[] = ingredientMatches.map((match) => {
        const text = match.replace(/<[^>]+>/g, '').trim();
        // Split amount from ingredient name
        const parts = text.split(/\s+(?=\w+(?:\s|$))/);
        return {
          amount: parts.length > 1 ? parts[0] : '',
          name: parts.length > 1 ? parts.slice(1).join(' ') : text,
          note: ''
        };
      });

      // Extract instructions/steps
      const stepsMatches = html.match(
        /<li[^>]*class="instruction[^"]*"[^>]*>([^<]+)<\/li>/gi
      ) || [];

      const steps: Step[] = stepsMatches.map((match, idx) => {
        const instruction = match.replace(/<[^>]+>/g, '').trim();
        return {
          section: idx === 0 ? 'Prep' : 'Cook Main',
          shortTitle: `Step ${idx + 1}`,
          instruction
        };
      });

      if (ingredients.length === 0 || steps.length === 0) {
        return null;
      }

      return {
        title,
        ingredients,
        steps,
        equipment: [],
        tips: [],
        servings: 4,
        prepTime: 15,
        prepTimeMinutes: 15,
        cookTime: 30,
        cookTimeMinutes: 30,
        source: url
      };
    } catch (error) {
      console.error('RecipesWithoutAds parsing failed:', error);
      return null;
    }
  }
};

/**
 * Recipe-Free.com Source
 * Ad-free recipe collection
 */
const recipeFreeSource: RecipeSource = {
  name: 'Recipe-Free.com',
  domain: 'recipe-free.com',
  searchUrl: (query: string) => `https://www.recipe-free.com/search?q=${encodeURIComponent(query)}`,
  parseRecipeHtml: async (html: string, url: string) => {
    try {
      // Parse recipe from Recipe-Free HTML
      const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
      const title = titleMatch ? titleMatch[1].trim() : 'Recipe';

      // Extract ingredients - look for structured data or ingredient list
      const ingredientMatches = html.match(
        /<div[^>]*class="ingredient[^"]*"[^>]*>([^<]*)<\/div>/gi
      ) || html.match(
        /<li[^>]*class="ingredient[^"]*"[^>]*>([^<]+)<\/li>/gi
      ) || [];

      const ingredients: Ingredient[] = ingredientMatches.map((match) => {
        const text = match.replace(/<[^>]+>/g, '').trim();
        // Try to parse amount and name
        const amountMatch = text.match(/^([\d\s\/\-\.]+\s*[a-z]*)\s+/i);
        return {
          amount: amountMatch ? amountMatch[1].trim() : '',
          name: amountMatch ? text.substring(amountMatch[0].length) : text,
          note: ''
        };
      });

      // Extract instructions
      const instructionMatches = html.match(
        /<div[^>]*class="[^"]*instruction[^"]*"[^>]*>([^<]*)<\/div>/gi
      ) || html.match(
        /<li[^>]*class="[^"]*step[^"]*"[^>]*>([^<]+)<\/li>/gi
      ) || [];

      const steps: Step[] = instructionMatches.map((match, idx) => {
        const instruction = match.replace(/<[^>]+>/g, '').trim();
        const section = idx < 2 ? 'Prep' : 'Cook Main';
        return {
          section,
          shortTitle: `Step ${idx + 1}`,
          instruction
        };
      });

      if (ingredients.length === 0 || steps.length === 0) {
        return null;
      }

      return {
        title,
        ingredients,
        steps,
        equipment: [],
        tips: [],
        servings: 4,
        prepTime: 20,
        prepTimeMinutes: 20,
        cookTime: 30,
        cookTimeMinutes: 30,
        source: url
      };
    } catch (error) {
      console.error('Recipe-Free parsing failed:', error);
      return null;
    }
  }
};

/**
 * Available recipe sources
 */
export const recipeSources: RecipeSource[] = [
  recipesWithoutAdsSource,
  recipeFreeSource
];

/**
 * Get recipe source by domain
 */
export function getRecipeSourceByDomain(url: string): RecipeSource | undefined {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return recipeSources.find(source => hostname.includes(source.domain));
  } catch {
    return undefined;
  }
}

/**
 * Search a specific recipe source
 */
export async function searchRecipeSource(source: RecipeSource, query: string): Promise<{ url: string; title: string }[]> {
  try {
    const searchUrl = source.searchUrl(query);
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    
    // Extract recipe links from search results page
    const linkMatches = html.match(/href="([^"]*\/recipe[^"]*)"[^>]*title="([^"]+)"/gi) || [];
    
    const results: { url: string; title: string }[] = [];
    
    linkMatches.forEach((match) => {
      const urlMatch = match.match(/href="([^"]+)"/);
      const titleMatch = match.match(/title="([^"]+)"/);
      
      if (urlMatch && titleMatch) {
        let recipeUrl = urlMatch[1];
        // Convert relative URLs to absolute
        if (recipeUrl.startsWith('/')) {
          const baseUrl = source.searchUrl('').split('/search')[0];
          recipeUrl = baseUrl + recipeUrl;
        }
        
        results.push({
          url: recipeUrl,
          title: titleMatch[1].trim()
        });
      }
    });

    return results.slice(0, 10); // Return top 10 results
  } catch (error) {
    console.error(`Search failed for ${source.name}:`, error);
    return [];
  }
}

/**
 * Fetch and parse recipe from specific source
 */
export async function fetchRecipeFromSource(
  source: RecipeSource,
  url: string
): Promise<Recipe | null> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    return await source.parseRecipeHtml(html, url);
  } catch (error) {
    console.error(`Fetch failed for ${source.name}:`, error);
    return null;
  }
}

/**
 * Search all ad-free recipe sources
 */
export async function searchAllAdFreeSources(query: string): Promise<
  { source: string; results: { url: string; title: string }[] }[]
> {
  const searchPromises = recipeSources.map(async (source) => ({
    source: source.name,
    results: await searchRecipeSource(source, query)
  }));

  const results = await Promise.all(searchPromises);
  return results.filter(r => r.results.length > 0);
}

/**
 * Fetch recipe from URL, auto-detecting source
 */
export async function fetchRecipeFromAnySource(url: string): Promise<Recipe | null> {
  const source = getRecipeSourceByDomain(url);
  
  if (source) {
    return fetchRecipeFromSource(source, url);
  }

  // If not a known source, return null
  console.warn(`URL not from known recipe source: ${url}`);
  return null;
}
