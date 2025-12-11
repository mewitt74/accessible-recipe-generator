/**
 * Substitutions Panel Component
 * Shows ingredient alternatives
 */

import { useState } from 'react';
import {
  findSubstitutions,
  getSubstitutionCategories,
  type Substitution,
} from '../services/substitutions';
import type { Ingredient } from '../types';

interface SubstitutionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients?: Ingredient[];
}

export default function SubstitutionsPanel({
  isOpen,
  onClose,
  ingredients = [],
}: SubstitutionsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  const categories = getSubstitutionCategories();
  
  // Convert Ingredient[] to string[] for searching
  const ingredientNames = ingredients.map(ing => ing.name);
  
  // Find substitutions for search or selected ingredient
  const currentSubstitution: Substitution | null = 
    selectedIngredient ? findSubstitutions(selectedIngredient) :
    searchTerm ? findSubstitutions(searchTerm) : null;
  
  // Find relevant substitutions from recipe ingredients
  const recipeSubstitutions = ingredientNames
    .map(name => ({ ingredient: name, sub: findSubstitutions(name) }))
    .filter(item => item.sub !== null);
  
  return (
    <div className="substitutions-overlay" onClick={onClose}>
      <div className="substitutions-modal" onClick={e => e.stopPropagation()}>
        <div className="substitutions-header">
          <h2>🔄 Ingredient Substitutions</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        
        {/* Search */}
        <div className="substitutions-search">
          <input
            type="text"
            placeholder="Search for an ingredient..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setSelectedIngredient(null);
            }}
            className="search-input"
          />
        </div>
        
        <div className="substitutions-content">
          {/* Recipe ingredients with substitutions */}
          {recipeSubstitutions.length > 0 && !searchTerm && !selectedIngredient && (
            <div className="recipe-substitutions">
              <h3>📝 In Your Recipe</h3>
              <div className="ingredient-chips">
                {recipeSubstitutions.map(({ ingredient }) => (
                  <button
                    key={ingredient}
                    className="ingredient-chip"
                    onClick={() => setSelectedIngredient(ingredient)}
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Show substitution details */}
          {currentSubstitution && (
            <div className="substitution-details">
              <h3>
                Substitutes for <span className="highlight">{currentSubstitution.original}</span>
              </h3>
              <div className="alternatives-list">
                {currentSubstitution.alternatives.map((alt, index) => (
                  <div key={index} className="alternative-card">
                    <div className="alt-header">
                      <span className="alt-name">{alt.name}</span>
                      <span className="alt-ratio">{alt.ratio}</span>
                    </div>
                    {alt.notes && (
                      <p className="alt-notes">💡 {alt.notes}</p>
                    )}
                    {alt.dietaryInfo && alt.dietaryInfo.length > 0 && (
                      <div className="dietary-tags">
                        {alt.dietaryInfo.map(tag => (
                          <span key={tag} className="dietary-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button 
                className="back-btn"
                onClick={() => {
                  setSelectedIngredient(null);
                  setSearchTerm('');
                }}
              >
                ← Back to list
              </button>
            </div>
          )}
          
          {/* Browse all */}
          {!currentSubstitution && !searchTerm && (
            <div className="browse-substitutions">
              <h3>🔍 Browse All</h3>
              <div className="category-grid">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className="category-btn"
                    onClick={() => setSelectedIngredient(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* No results */}
          {searchTerm && !currentSubstitution && (
            <div className="no-results">
              <p>😕 No substitutions found for "{searchTerm}"</p>
              <p className="hint">Try searching for common ingredients like "milk", "eggs", or "butter"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
