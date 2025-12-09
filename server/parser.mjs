import cheerio from 'cheerio';

function parseTimeToMinutes(input) {
  if (!input) return 0;
  const s = (input || '').trim();
  const dt = s.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (dt) {
    const hours = Number(dt[1] || 0);
    const mins = Number(dt[2] || 0);
    return hours * 60 + mins;
  }
  const m = s.match(/(\d+)\s*(?:hr|hours|h)/i);
  const m2 = s.match(/(\d+)\s*(?:min|minutes|m)/i);
  let total = 0;
  if (m && m[1]) total += Number(m[1]) * 60;
  if (m2 && m2[1]) total += Number(m2[1]);
  if (total > 0) return total;
  const anyNum = s.match(/(\d+)/);
  if (anyNum) return Number(anyNum[1]);
  return 0;
}

export function parseRecipeFromHtml(url, html) {
  const $ = cheerio.load(html);
  const hostname = new URL(url).hostname.replace('www.', '');

  let title = $('h1').first().text().trim();
  if (!title) title = $('meta[property="og:title"]').attr('content') || $('title').text().trim();

  const ingredientSelectors = [
    '.ingredients-item-name',
    '.ingredient',
    '.ingred-list li',
    '[itemprop="recipeIngredient"]',
    '.ingredients li',
    '.components__item',
  ];

  let ingredients = [];
  for (const sel of ingredientSelectors) {
    const nodes = $(sel);
    if (nodes && nodes.length > 0) {
      nodes.each((_, el) => {
        const txt = $(el).text().trim();
        if (txt) ingredients.push({ amount: '', name: txt, note: '' });
      });
      break;
    }
  }

  const stepSelectors = [
    '.instructions-section-item p',
    '.instruction',
    '.directions li',
    '[itemprop="recipeInstructions"] p',
    '[itemprop="recipeInstructions"]',
    '.steps li',
    '.method li',
  ];

  let steps = [];
  for (const sel of stepSelectors) {
    const nodes = $(sel);
    if (nodes && nodes.length > 0) {
      nodes.each((i, el) => {
        const txt = $(el).text().trim();
        if (txt) steps.push({ section: 'Main', shortTitle: '', instruction: txt });
      });
      break;
    }
  }

  if (steps.length === 0) {
    const paras = $('article p');
    paras.each((i, el) => {
      const txt = $(el).text().trim();
      if (txt && steps.length < 20) steps.push({ section: 'Main', shortTitle: '', instruction: txt });
    });
  }

  let servings = 1;
  const servingsText = $('[itemprop="recipeYield"]').text().trim() || $('[class*="yield"]').first().text().trim();
  if (servingsText) {
    const m = servingsText.match(/(\d+)/);
    if (m) servings = Number(m[1]);
  }

  const prepTimeMinutes = parseTimeToMinutes($('[itemprop="prepTime"]').attr('datetime') || $('[class*="prep"]')?.text());
  const cookTimeMinutes = parseTimeToMinutes($('[itemprop="cookTime"]').attr('datetime') || $('[class*="cook"]')?.text());

  const equipment = [];
  $('[class*="equipment"]').find('li').each((_, el) => {
    const t = $(el).text().trim();
    if (t) equipment.push(t);
  });

  const tips = [];
  $('[class*="tips"]').find('li,p').each((_, el) => {
    const t = $(el).text().trim();
    if (t) tips.push(t);
  });

  const recipe = {
    title: title || `Recipe from ${hostname}`,
    subtitle: undefined,
    servings,
    prepTimeMinutes: prepTimeMinutes ?? 0,
    cookTimeMinutes: cookTimeMinutes ?? 0,
    ingredients: ingredients.map(i => ({ amount: i.amount ?? '', name: i.name, note: i.note })),
    equipment,
    steps: steps.length > 0 ? steps : [{ section: 'Main', shortTitle: '', instruction: 'See original recipe.' }],
    tips,
  };

  return recipe;
}
