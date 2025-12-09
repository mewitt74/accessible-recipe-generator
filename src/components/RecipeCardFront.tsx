import React from 'react';
import type { Recipe } from '../types';

export default function RecipeCardFront({ recipe }: { recipe: Recipe }) {
  return (
    <article className="card front" aria-label="Recipe card front">
      <h1 className="card-title">{recipe.title}</h1>
      {recipe.subtitle && <h2 className="card-subtitle">{recipe.subtitle}</h2>}
      <div className="meta">
        <div>Serves: {recipe.servings}</div>
        <div>Prep: {recipe.prepTimeMinutes} min</div>
        <div>Cook: {recipe.cookTimeMinutes} min</div>
      </div>

      <section>
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing.amount ? `${ing.amount} ` : ''}{ing.name}{ing.note ? ` — ${ing.note}` : ''}</li>
          ))}
        </ul>
      </section>

    </article>
  );
}
