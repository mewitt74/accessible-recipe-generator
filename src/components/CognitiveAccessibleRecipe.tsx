import { useState } from 'react';
import type { Recipe } from '../types';

interface Props {
  recipe: Recipe;
  onBack: () => void;
}

/**
 * Cognitive-Accessible Recipe Viewer
 * Designed for TBI/aphasia/cognitive disabilities
 * - Large, simple buttons (tap to proceed)
 * - One step at a time (full screen)
 * - Automatic text-to-speech
 * - Visual step icons
 * - Minimal text, maximum clarity
 */
export default function CognitiveAccessibleRecipe({ recipe, onBack }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Get all steps in order
  const allSteps = recipe.steps || [];
  const currentStep = allSteps[currentStepIndex];
  const isLastStep = currentStepIndex === allSteps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Text-to-speech function
  const speakInstruction = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-speak current step
  const handleNextStep = () => {
    if (!isLastStep) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      // Speak next step
      if (allSteps[nextIndex]) {
        speakInstruction(allSteps[nextIndex].instruction);
      }
    }
  };

  const handlePreviousStep = () => {
    if (!isFirstStep) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      // Speak previous step
      if (allSteps[prevIndex]) {
        speakInstruction(allSteps[prevIndex].instruction);
      }
    }
  };

  // Get step icon based on section
  const getStepIcon = (section: string) => {
    const icons: Record<string, string> = {
      'Prep': '🔪',
      'Cook Main': '🍳',
      'Cook Side': '🥘',
      'Make Sauce': '🥄',
      'Finish & Serve': '🍽️'
    };
    return icons[section] || '👉';
  };

  if (showIngredients) {
    return (
      <div className="cognitive-accessible-recipe">
        {/* Ingredients Screen */}
        <div className="ingredients-screen">
          <h1 className="recipe-title">{recipe.title}</h1>
          
          <div className="ingredients-list">
            <h2 className="section-title">📋 Get These:</h2>
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="ingredient-item-large">
                <div className="ingredient-amount">{ing.amount}</div>
                <div className="ingredient-name">{ing.name}</div>
              </div>
            ))}
          </div>

          {recipe.equipment && recipe.equipment.length > 0 && (
            <div className="equipment-list">
              <h2 className="section-title">🛠️ Tools Needed:</h2>
              {recipe.equipment.map((eq, i) => (
                <div key={i} className="equipment-item-large">
                  {eq}
                </div>
              ))}
            </div>
          )}

          <button 
            onClick={() => {
              setShowIngredients(false);
              setCurrentStepIndex(0);
              // Speak first instruction
              if (allSteps[0]) {
                speakInstruction(allSteps[0].instruction);
              }
            }}
            className="btn-huge btn-primary"
          >
            Ready to Cook? 👉
          </button>

          <button onClick={onBack} className="btn-back">
            🔍 Start New Search
          </button>
        </div>
      </div>
    );
  }

  // Cooking Steps Screen
  return (
    <div className="cognitive-accessible-recipe">
      <div className="cooking-step-screen">
        {/* Step Counter */}
        <div className="step-counter">
          Step {currentStepIndex + 1} of {allSteps.length}
        </div>

        {/* Step Icon */}
        {currentStep.section && (
          <div className="step-icon-large">
            {getStepIcon(currentStep.section)}
          </div>
        )}

        {/* Step Section Label */}
        {currentStep.section && (
          <div className="step-section">
            {currentStep.section}
          </div>
        )}

        {/* Main Instruction - HUGE TEXT */}
        <div className="instruction-area">
          <h2 className="instruction-text">
            {currentStep.instruction}
          </h2>
        </div>

        {/* Speaker Button - Optional */}
        <button
          onClick={() => speakInstruction(currentStep.instruction)}
          className={`btn-huge btn-speak ${isSpeaking ? 'speaking' : ''}`}
          aria-label="Speak instruction"
        >
          {isSpeaking ? '🔊 Listening...' : '🔊 Hear This'}
        </button>

        {/* Navigation Controls */}
        <div className="step-controls">
          {!isFirstStep && (
            <button
              onClick={handlePreviousStep}
              className="btn-step btn-prev"
              aria-label="Previous step"
            >
              ← Back
            </button>
          )}

          {!isLastStep && (
            <button
              onClick={handleNextStep}
              className="btn-step btn-next"
              aria-label="Next step"
            >
              Next →
            </button>
          )}

          {isLastStep && (
            <button
              onClick={() => {
                setShowIngredients(true);
                setCurrentStepIndex(0);
              }}
              className="btn-step btn-next"
              aria-label="Done cooking"
            >
              ✓ Done!
            </button>
          )}
        </div>

        {/* Tips if available */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div className="tips-reminder">
            <h3>💡 Tips:</h3>
            {recipe.tips.map((tip, i) => (
              <p key={i}>{tip}</p>
            ))}
          </div>
        )}

        {/* Back to Search */}
        <button onClick={onBack} className="btn-back">
          🔍 Start New Search
        </button>
      </div>
    </div>
  );
}
