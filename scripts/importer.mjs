#!/usr/bin/env node
import { parseRecipeFromUrl } from '../src/utils/importer.js';

const url = process.argv[2];
if (!url) {
  console.error('Usage: node scripts/importer.mjs <url>');
  process.exit(2);
}

(async () => {
  try {
    const r = await parseRecipeFromUrl(url);
    console.log(JSON.stringify(r, null, 2));
  } catch (err) {
    console.error('Error importing:', err);
    process.exit(1);
  }
})();
