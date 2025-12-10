import type { Recipe } from '../types';

export default function RecipeCardFront({ recipe }: { recipe: Recipe }) {
  return (
    <article className="recipe-card-front" aria-label="Recipe card front">
      {/* Green Header with Title */}
      <header className="card-header">
        <h1 className="card-title">{recipe.title}</h1>
        {recipe.subtitle && <p className="card-subtitle">{recipe.subtitle}</p>}
      </header>

      {/* Ingredients Grid */}
      <section className="ingredients-section">
        <h2 className="section-heading">Ingredients</h2>
        <div className="ingredients-grid">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="ingredient-box">
              <div className="ingredient-amount">{ing.amount}</div>
              <div className="ingredient-name">{ing.name}</div>
              {ing.note && <div className="ingredient-note">{ing.note}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Green Footer with Prep/Cook/Calories */}
      <footer className="card-footer">
        <div className="footer-item">
          <div className="footer-label">Prep Time</div>
          <div className="footer-value">{recipe.prepTimeMinutes} min</div>
        </div>
        <div className="footer-item">
          <div className="footer-label">Cook Time</div>
          <div className="footer-value">{recipe.cookTimeMinutes} min</div>
        </div>
        <div className="footer-item">
          <div className="footer-label">Calories</div>
          <div className="footer-value">{recipe.calories || 'N/A'}</div>
        </div>
      </footer>
    </article>
  );
}
