import { describe, it, expect } from 'vitest';
import { parseRecipeFromHtml } from './importer';

const allrecipesSample = `
<html>
  <body>
    <h1>AllRecipes Test Cake</h1>
    <ul>
      <li class="ingredients-item-name">1 cup sugar</li>
      <li class="ingredients-item-name">2 cups flour</li>
    </ul>
    <div class="instructions-section-item"><p>Mix ingredients.</p></div>
    <div class="instructions-section-item"><p>Bake 30 minutes.</p></div>
  </body>
</html>
`;

describe('AllRecipes parsing', () => {
  it('parses AllRecipes-like HTML', () => {
    const r = parseRecipeFromHtml('https://www.allrecipes.com/recipe/123', allrecipesSample);
    expect(r.title).toContain('AllRecipes Test Cake');
    expect(r.ingredients.length).toBe(2);
    expect(r.steps.length).toBe(2);
  });
});
