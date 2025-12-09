import express from 'express';
import { parseRecipeFromHtml } from './parser.mjs';
import fetch from 'cross-fetch';
import process from 'process';

const app = express();
app.use(express.json({ limit: '2mb' }));

const USE_PUPPETEER = process.env.USE_PUPPETEER === '1' || process.env.USE_PUPPETEER === 'true';
let puppeteer = null;

app.post('/api/import', async (req, res) => {
  const { url, usePuppeteer } = req.body || {};
  if (!url) return res.status(400).json({ error: 'Missing url in body' });

  try {
    // First try a simple fetch
    let html;
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'accessible-recipe-generator (+https://github.com)' } });
      if (!r.ok) throw new Error(`Fetch failed with ${r.status}`);
      html = await r.text();
    } catch (err) {
      // If fetch failed and puppeteer is allowed, try rendering
      if (USE_PUPPETEER || usePuppeteer) {
        await ensurePuppeteer();
        const pageHtml = await renderWithPuppeteer(url);
        html = pageHtml;
      } else {
        throw err;
      }
    }

    let recipe = parseRecipeFromHtml(url, html);

    // If parser found only placeholder content, try puppeteer if allowed/requested
    const looksEmpty = (!recipe.ingredients || recipe.ingredients.length === 0) && (!recipe.steps || recipe.steps.length === 1 && recipe.steps[0].instruction === 'See original recipe.');
    if (looksEmpty && (USE_PUPPETEER || usePuppeteer)) {
      await ensurePuppeteer();
      const pageHtml = await renderWithPuppeteer(url);
      recipe = parseRecipeFromHtml(url, pageHtml);
    }

    return res.json({ recipe });
  } catch (err) {
    console.error('Import error', err);
    return res.status(500).json({ error: String(err) });
  }
});

async function ensurePuppeteer() {
  if (puppeteer) return;
  try {
    // dynamic import to avoid heavy dependency unless used
    puppeteer = await import('puppeteer');
  } catch (err) {
    console.error('Failed to import puppeteer:', err);
    throw new Error('Puppeteer not available');
  }
}

async function renderWithPuppeteer(url) {
  if (!puppeteer) throw new Error('Puppeteer not initialized');
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setUserAgent('accessible-recipe-generator (+https://github.com)');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const html = await page.content();
    await page.close();
    return html;
  } finally {
    await browser.close();
  }
}

const port = process.env.PORT || 5174;
app.listen(port, () => {
  console.log(`Import server listening on http://localhost:${port}`);
});
