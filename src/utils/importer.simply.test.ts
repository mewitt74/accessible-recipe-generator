import { describe, it, expect } from 'vitest';
import { parseRecipeFromHtml } from './importer';

const simplySample = `
<html>
  <body>
    <h1>Simply Test Stew</h1>
    <ul itemprop="recipeIngredient">
      <li>1 lb beef</li>
      <li>2 carrots</li>
    </ul>
    <div itemprop="recipeInstructions">
      <p>Brown the meat.</p>
      <p>Add vegetables and simmer.</p>
    </div>
  </body>
</html>
`;

describe('Simply Recipes parsing', () => {
  it('parses simply-like HTML', () => {
    const r = parseRecipeFromHtml('https://www.simplyrecipes.com/recipe/123', simplySample);
    expect(r.title).toContain('Simply Test Stew');
    expect(r.ingredients.length).toBeGreaterThanOrEqual(2);
    expect(r.steps.length).toBeGreaterThanOrEqual(2);
  });
});
