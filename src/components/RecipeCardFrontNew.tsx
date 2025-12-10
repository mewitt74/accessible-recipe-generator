import type { Recipe } from '../types';

export default function RecipeCardFront({ recipe }: { recipe: Recipe }) {
  return (
    <article className="recipe-card-front modern-card-style" aria-label="Recipe card front">
      {/* Brand Header */}
      <div className="hf-brand-header">
        <div className="hf-logo">🍳</div>
        <h3 className="hf-brand-name">RECIPE CARD</h3>
      </div>

      {/* Ingredients Header */}
      <div className="hf-ingredients-header">
        <h2>INGREDIENTS</h2>
        <div className="hf-serving-info">{recipe.servings} PERSON{recipe.servings > 1 ? 'S' : ''}</div>
      </div>

      {/* Ingredients Visual Grid */}
      <div className="hf-ingredients-grid">
        {recipe.ingredients.map((ing, i) => (
          <div key={i} className="hf-ingredient-box">
            <div className="hf-ingredient-icon">
              {getIngredientEmoji(ing.name)}
            </div>
            <div className="hf-ingredient-amount">{ing.amount}</div>
            <div className="hf-ingredient-name">{ing.name}</div>
          </div>
        ))}
      </div>

      {/* Equipment Section */}
      {recipe.equipment && recipe.equipment.length > 0 && (
        <div className="hf-equipment-section">
          <h3 className="hf-section-title">BUST OUT</h3>
          <div className="hf-equipment-list">
            {recipe.equipment.map((eq, i) => (
              <div key={i} className="hf-equipment-item">• {eq}</div>
            ))}
          </div>
        </div>
      )}

      {/* Footer with Time Info */}
      <footer className="hf-footer">
        <div className="hf-footer-badge green-bg">PREP: {recipe.prepTimeMinutes} MIN</div>
        <div className="hf-footer-badge green-bg">COOK: {recipe.cookTimeMinutes} MIN</div>
        {recipe.calories && (
          <div className="hf-footer-badge green-bg">CALORIES: {recipe.calories}</div>
        )}
      </footer>
    </article>
  );
}

// Helper function to get emoji for ingredients
function getIngredientEmoji(ingredientName: string): string {
  const name = ingredientName.toLowerCase();
  
  const emojiMap: Record<string, string> = {
    'potato': '🥔',
    'chicken': '🍗',
    'beef': '🥩',
    'pork': '🥓',
    'fish': '🐟',
    'salmon': '🐟',
    'shrimp': '🦐',
    'rice': '🍚',
    'pasta': '🍝',
    'noodle': '🍜',
    'tomato': '🍅',
    'onion': '🧅',
    'garlic': '🧄',
    'pepper': '🫑',
    'carrot': '🥕',
    'lemon': '🍋',
    'lime': '🍋',
    'butter': '🧈',
    'cheese': '🧀',
    'egg': '🥚',
    'milk': '🥛',
    'cream': '🥛',
    'oil': '🫗',
    'salt': '🧂',
    'bean': '🫘',
    'green bean': '🫛',
    'corn': '🌽',
    'mushroom': '🍄',
    'avocado': '🥑',
    'bread': '🍞',
    'lettuce': '🥬',
    'cucumber': '🥒',
    'broccoli': '🥦',
    'spinach': '🥬',
    'herb': '🌿',
    'basil': '🌿',
    'parsley': '🌿',
    'cilantro': '🌿',
    'spice': '🌶️',
    'chili': '🌶️',
    'ginger': '🫚',
    'stock': '🍲',
    'broth': '🍲',
    'sauce': '🥫',
    'honey': '🍯',
    'sugar': '🍬',
    'flour': '🌾',
    'water': '💧',
  };
  
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (name.includes(key)) {
      return emoji;
    }
  }
  
  return '🥘'; // Default food emoji
}
