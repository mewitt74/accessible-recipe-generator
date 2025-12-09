import express from 'express';
import { parseRecipeFromUrl } from './importer.js';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 5174;

app.get('/api/import', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing url param' });
  try {
    // Try simple fetch-based parse
    const recipe = await parseRecipeFromUrl(url);

    // If parsed a very small result, attempt Puppeteer render fallback
    const isSparse = recipe.ingredients.length <= 1 || (recipe.steps.length <= 1);
    if (isSparse && process.env.ENABLE_PUPPETEER !== '0') {
      try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setUserAgent('accessible-recipe-generator/1.0 (+https://github.com)');
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        const html = await page.content();
        await browser.close();
        const parsed = await (await import('./importer.js')).parseRecipeFromHtml(url, html);
        return res.json(parsed);
      } catch (err) {
        // Puppeteer fallback failed; continue with the earlier recipe
        console.warn('Puppeteer fallback failed', err);
      }
    }

    return res.json(recipe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
});

app.use(express.static('dist'));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
