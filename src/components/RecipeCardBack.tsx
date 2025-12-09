import React from 'react';
import type { Recipe } from '../types';

export default function RecipeCardBack({ recipe }: { recipe: Recipe }) {
  return (
    <article className="card back" aria-label="Recipe card back">
      <h3>Steps</h3>
      <ol>
        {recipe.steps.map((s, i) => (
          <li key={i} className="step">
            <strong className="step-title">{s.shortTitle || `Step ${i + 1}`}</strong>
            <div className="instruction">{s.instruction}</div>
          </li>
        ))}
      </ol>

      {recipe.tips && recipe.tips.length > 0 && (
        <section>
          <h4>Tips</h4>
          <ul>
            {recipe.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </section>
      )}

      {recipe.equipment && recipe.equipment.length > 0 && (
        <section>
          <h4>Equipment</h4>
          <ul>
            {recipe.equipment.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </section>
      )}
    </article>
  );
}
