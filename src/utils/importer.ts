import { load as cheerioLoad } from 'cheerio';
import type { Recipe } from '../types';

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.text();
}

export async function parseRecipeFromUrl(url: string): Promise<Recipe> {
  const html = await fetchHtml(url);
  return parseRecipeFromHtml(url, html);
}

export function parseRecipeFromHtml(url: string, html: string): Recipe {
  const $ = cheerioLoad(html);
  const hostname = new URL(url).hostname.replace('www.', '');

  // Title heuristics
  let title = $('h1').first().text().trim();
  if (!title) title = $('meta[property="og:title"]').attr('content') || $('title').text().trim();

  // Ingredient selectors heuristics
  const ingredientSelectors = [
    '.ingredients-item-name', // allrecipes
    '.ingredient', // common
    '.ingred-list li',
    '[itemprop="recipeIngredient"]',
    '.ingredients li',
    '.components__item',
  ];

  let ingredients: { amount?: string; name: string; note?: string }[] = [];
  for (const sel of ingredientSelectors) {
    const nodes = $(sel);
    if (nodes && nodes.length > 0) {
      nodes.each((_idx: number, el: any) => {
        const txt = $(el).text().trim();
        if (txt) {
          ingredients.push({ name: txt });
        }
      });
      break;
    }
  }

  // Steps heuristics
  const stepSelectors = [
    '.instructions-section-item p', // allrecipes
    '.instruction',
    '.directions li',
    '[itemprop="recipeInstructions"] p',
    '[itemprop="recipeInstructions"]',
    '.steps li',
    '.method li',
  ];

  type StepData = { section: 'Prep' | 'Cook Main' | 'Cook Side' | 'Make Sauce' | 'Finish & Serve'; shortTitle: string; instruction: string };
  let steps: StepData[] = [];
  for (const sel of stepSelectors) {
    const nodes = $(sel);
    if (nodes && nodes.length > 0) {
      nodes.each((_idx: number, el: any) => {
        const txt = $(el).text().trim();
        if (txt) {
          steps.push({ section: 'Prep', shortTitle: '', instruction: txt });
        }
      });
      break;
    }
  }

  // Fallback: try to collect paragraphs under article
  if (steps.length === 0) {
    const paras = $('article p');
    paras.each((_idx: number, el: any) => {
      const txt = $(el).text().trim();
      if (txt && steps.length < 20) {
        steps.push({ section: 'Prep', shortTitle: '', instruction: txt });
      }
    });
  }

  // Servings / times heuristics
  let servings = 1;
  const servingsText = $('[itemprop="recipeYield"]').text().trim() || $('[class*="yield"]').first().text().trim();
  if (servingsText) {
    const m = servingsText.match(/(\d+)/);
    if (m) servings = Number(m[1]);
  }

  const prepTimeMinutes = parseTimeToMinutes($('[itemprop="prepTime"]').attr('datetime') || $('[class*="prep"]')?.text());
  const cookTimeMinutes = parseTimeToMinutes($('[itemprop="cookTime"]').attr('datetime') || $('[class*="cook"]')?.text());

  // Equipment and tips heuristics
  const equipment: string[] = [];
  $('[class*="equipment"]').find('li').each((_idx: number, el: any) => {
    const t = $(el).text().trim();
    if (t) equipment.push(t);
  });

  const tips: string[] = [];
  $('[class*="tips"]').find('li,p').each((_idx: number, el: any) => {
    const t = $(el).text().trim();
    if (t) tips.push(t);
  });

  const recipe: Recipe = {
    title: title || `Recipe from ${hostname}`,
    subtitle: undefined,
    servings,
    prepTimeMinutes: prepTimeMinutes ?? 0,
    cookTimeMinutes: cookTimeMinutes ?? 0,
    ingredients: ingredients.map(i => ({ amount: i.amount ?? '', name: i.name, note: i.note })),
    equipment,
    steps: steps.length > 0 ? steps : [{ section: 'Prep', shortTitle: '', instruction: 'See original recipe.' }],
    tips,
  };

  return recipe;
}

function parseTimeToMinutes(input?: string | null): number {
  if (!input) return 0;
  const s = (input || '').trim();
  // If datetime format PT20M
  const dt = s.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (dt) {
    const hours = Number(dt[1] || 0);
    const mins = Number(dt[2] || 0);
    return hours * 60 + mins;
  }
  // Otherwise find numbers with "min" or "hr"
  const m = s.match(/(\d+)\s*hr|hours|h/i);
  const m2 = s.match(/(\d+)\s*min|minutes|m/i);
  let total = 0;
  if (m && m[1]) total += Number(m[1]) * 60;
  if (m2 && m2[1]) total += Number(m2[1]);
  if (total > 0) return total;
  const anyNum = s.match(/(\d+)/);
  if (anyNum) return Number(anyNum[1]);
  return 0;
}
