import { describe, it, expect } from 'vitest';
import { parseRecipeFromHtml } from './importer';

const sampleHtml = `
<html>
  <head><title>Test Pancakes</title></head>
  <body>
    <h1>Fluffy Pancakes</h1>
    <ul class="ingredients">
      <li>1 cup flour</li>
      <li>1 egg</li>
      <li>1 cup milk</li>
    </ul>
    <div class="directions">
      <ol>
        <li>Mix dry ingredients.</li>
        <li>Add milk and egg; whisk.</li>
        <li>Cook on griddle.</li>
      </ol>
    </div>
  </body>
</html>
`;

describe('importer.parseRecipeFromHtml', () => {
  it('parses a simple recipe HTML', () => {
    const r = parseRecipeFromHtml('https://example.com/recipe', sampleHtml);
    expect(r.title).toContain('Fluffy Pancakes');
    expect(r.ingredients.length).toBeGreaterThanOrEqual(3);
    expect(r.steps.length).toBeGreaterThanOrEqual(3);
  });
});
