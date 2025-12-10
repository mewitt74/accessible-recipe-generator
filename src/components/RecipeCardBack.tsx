import type { Recipe, Step } from '../types';

export default function RecipeCardBack({ recipe }: { recipe: Recipe }) {
  // Group steps by section
  const stepsBySection: Record<string, Step[]> = {};
  recipe.steps.forEach(step => {
    if (!stepsBySection[step.section]) {
      stepsBySection[step.section] = [];
    }
    stepsBySection[step.section].push(step);
  });

  // Calculate step numbers across all sections
  let globalStepNumber = 1;

  return (
    <article className="recipe-card-back" aria-label="Recipe card back">
      {/* Green Header */}
      <header className="card-header">
        <h1 className="card-title">{recipe.title}</h1>
      </header>

      {/* Equipment Section */}
      {recipe.equipment && recipe.equipment.length > 0 && (
        <section className="equipment-section">
          <h2 className="section-heading">Equipment Needed</h2>
          <ul className="equipment-list">
            {recipe.equipment.map((item, i) => (
              <li key={i} className="equipment-item">
                <span className="checkmark">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Instructions Section - Grouped by Section */}
      <section className="instructions-section">
        <h2 className="section-heading">Instructions</h2>
        
        {Object.keys(stepsBySection).map((sectionName) => (
          <div key={sectionName} className="instruction-group">
            <h3 className="section-label">{sectionName.toUpperCase()}</h3>
            
            {stepsBySection[sectionName].map((step) => {
              const stepNum = globalStepNumber++;
              return (
                <div key={stepNum} className="step-container">
                  <div className="step-number-circle">
                    <span className="step-number">{stepNum}</span>
                  </div>
                  <div className="step-content">
                    <h4 className="step-title">{step.shortTitle}</h4>
                    <p className="step-instruction">{step.instruction}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </section>

      {/* Tips Section */}
      {recipe.tips && recipe.tips.length > 0 && (
        <section className="tips-section">
          <h2 className="section-heading">Tips</h2>
          <ul className="tips-list">
            {recipe.tips.map((tip, i) => (
              <li key={i} className="tip-item">{tip}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
