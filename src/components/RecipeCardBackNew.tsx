import { useState, useEffect } from 'react';
import type { Recipe } from '../types';
import { getCookingStepPhoto, type StepPhoto } from '../services/stepPhotos';

export default function RecipeCardBackNew({ recipe }: { recipe: Recipe }) {
  const [stepPhotos, setStepPhotos] = useState<Map<number, StepPhoto>>(new Map());
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  // Load photos for all steps
  useEffect(() => {
    const loadAllPhotos = async () => {
      const photoMap = new Map<number, StepPhoto>();
      
      for (let i = 0; i < recipe.steps.length; i++) {
        const step = recipe.steps[i];
        try {
          const photo = await getCookingStepPhoto(step.instruction, recipe.title);
          photoMap.set(i, photo);
        } catch (error) {
          console.error(`Failed to load photo for step ${i}:`, error);
        }
      }
      
      setStepPhotos(photoMap);
      setLoadingPhotos(false);
    };

    loadAllPhotos();
  }, [recipe]);

  return (
    <article className="recipe-card-back modern-card-style" aria-label="Recipe card back">
      {/* Header */}
      <div className="hf-back-header">
        <h2 className="hf-recipe-title-back">{recipe.title}</h2>
        <div className="hf-subtitle">Step-by-Step Cooking Instructions</div>
      </div>

      {/* Steps Grid with Photos */}
      <div className="hf-steps-container">
        {recipe.steps.map((step, index) => {
          const photo = stepPhotos.get(index);
          
          return (
            <div key={index} className="hf-step-card">
              {/* Step Number Badge */}
              <div className="hf-step-number-badge">
                {index + 1} {step.section?.toUpperCase() || 'STEP'}
              </div>

              <div className="hf-step-content">
                {/* Step Photo */}
                <div className="hf-step-photo-container">
                  {loadingPhotos ? (
                    <div className="hf-photo-loading">
                      <div className="spinner-small">⏳</div>
                    </div>
                  ) : photo?.url ? (
                    <img 
                      src={photo.url} 
                      alt={`Step ${index + 1}`}
                      className="hf-step-photo"
                    />
                  ) : (
                    <div className="hf-photo-placeholder">
                      <div className="hf-emoji-placeholder">{photo?.alt.split(' ')[0] || '👨‍🍳'}</div>
                    </div>
                  )}
                </div>

                {/* Step Instruction */}
                <div className="hf-step-text">
                  <p className="hf-step-instruction">{step.instruction}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips Section */}
      {recipe.tips && recipe.tips.length > 0 && (
        <div className="hf-tips-section">
          <h3 className="hf-tips-title">💡 HELPFUL TIPS</h3>
          <ul className="hf-tips-list">
            {recipe.tips.map((tip, i) => (
              <li key={i} className="hf-tip-item">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <footer className="hf-back-footer">
        <div className="hf-enjoy-message">🍽️ Enjoy your meal!</div>
      </footer>
    </article>
  );
}
