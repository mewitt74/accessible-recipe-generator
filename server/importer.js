import fetch from 'node-fetch';
import cheerio from 'cheerio';

export async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'accessible-recipe-generator/1.0 (+https://github.com)' } });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.text();
}

export function parseRecipeFromHtml(url, html) {
  const $ = cheerio.load(html);
  const hostname = new URL(url).hostname.replace('www.', '');

  let title = $('h1').first().text().trim();
  if (!title) title = $('meta[property="og:title"]').attr('content') || $('title').text().trim();

  // site-specific heuristics
  const host = hostname.toLowerCase();
  const ingredients = [];
  const steps = [];

  if (host.includes('allrecipes')) {
    $('.ingredients-item-name').each((_, el) => {
      const txt = $(el).text().trim(); if (txt) ingredients.push({ amount: '', name: txt });
    });
    $('.instructions-section-item p').each((_, el) => {
      const txt = $(el).text().trim(); if (txt) steps.push({ section: 'Main', shortTitle: '', instruction: txt });
    });
  }

  if (ingredients.length === 0) {
    $('[itemprop="recipeIngredient"]').each((_, el) => {
      const txt = $(el).text().trim(); if (txt) ingredients.push({ amount: '', name: txt });
    });
  }

  if (steps.length === 0) {
    $('[itemprop="recipeInstructions"] p').each((_, el) => {
      const txt = $(el).text().trim(); if (txt) steps.push({ section: 'Main', shortTitle: '', instruction: txt });
    });
  }

  // generic fallbacks
  if (ingredients.length === 0) {
    const sels = ['.ingredients li', '.ingred-list li', '.components__item', '.ingredients li span'];
    for (const s of sels) {
      const nodes = $(s);
      if (nodes && nodes.length > 0) {
        nodes.each((_, el) => { const t = $(el).text().trim(); if (t) ingredients.push({ amount: '', name: t }); });
        break;
      }
    }
  }

  if (steps.length === 0) {
    const sels = ['.directions li', '.steps li', '.method li', '.directions p'];
    for (const s of sels) {
      const nodes = $(s);
      if (nodes && nodes.length > 0) {
        nodes.each((_, el) => { const t = $(el).text().trim(); if (t) steps.push({ section: 'Main', shortTitle: '', instruction: t }); });
        break;
      }
    }
  }

  const servingsText = $('[itemprop="recipeYield"]').text().trim() || $('[class*="yield"]').first().text().trim();
  let servings = 1;
  if (servingsText) {
    const m = servingsText.match(/(\d+)/);
    if (m) servings = Number(m[1]);
  }

  function parseTime(s) {
    if (!s) return 0;
    const dt = (s||'').match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (dt) return Number(dt[1]||0)*60 + Number(dt[2]||0);
    const m = (s||'').match(/(\d+)\s*min/i); if (m) return Number(m[1]);
    const any = (s||'').match(/(\d+)/); if (any) return Number(any[1]);
    return 0;
  }

  const prep = parseTime($('[itemprop="prepTime"]').attr('datetime') || $('[class*="prep"]').first().text());
  const cook = parseTime($('[itemprop="cookTime"]').attr('datetime') || $('[class*="cook"]').first().text());

  return {
    title: title || `Recipe from ${hostname}`,
    subtitle: undefined,
    servings,
    prepTimeMinutes: prep || 0,
    cookTimeMinutes: cook || 0,
    ingredients: ingredients.map(i => ({ amount: i.amount||'', name: i.name || '' })),
    equipment: [],
    steps: steps.length>0 ? steps : [{ section: 'Main', shortTitle: '', instruction: 'See original recipe.' }],
    tips: [],
  };
}

export async function parseRecipeFromUrl(url) {
  const html = await fetchHtml(url);
  return parseRecipeFromHtml(url, html);
}
