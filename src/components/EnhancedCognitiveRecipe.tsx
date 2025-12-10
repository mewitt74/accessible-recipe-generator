import { useState, useEffect } from 'react';
import type { Recipe } from '../types';
import { getCookingStepPhoto, type StepPhoto } from '../services/stepPhotos';
import { getIngredientPhoto, getEquipmentPhoto, type IngredientPhoto, type EquipmentPhoto } from '../services/ingredientPhotos';

interface Props {
  recipe: Recipe;
  onBack: () => void;
}

interface SafetyTip {
  icon: string;
  text: string;
  severity: 'info' | 'warning' | 'danger';
}

/**
 * Enhanced Cognitive Accessible Recipe Viewer
 * Features:
 * - Large step photos (Unsplash API with fallback emojis)
 * - Visual safety warnings (heat, sharp objects, timing)
 * - Ingredient checklist before cooking
 * - Audio timer with alerts
 * - Simplified navigation (only NEXT/BACK)
 * - High contrast design for visual disabilities
 */
export default function EnhancedCognitiveRecipe({ recipe, onBack }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [stepPhotos, setStepPhotos] = useState<Map<number, StepPhoto>>(new Map());
  const [ingredientPhotos, setIngredientPhotos] = useState<Map<number, IngredientPhoto>>(new Map());
  const [equipmentPhotos, setEquipmentPhotos] = useState<Map<number, EquipmentPhoto>>(new Map());
  const [loadingPhoto, setLoadingPhoto] = useState(true);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [safetyTips, setSafetyTips] = useState<SafetyTip[]>([]);

  const allSteps = recipe.steps || [];
  const currentStep = allSteps[currentStepIndex];
  const isLastStep = currentStepIndex === allSteps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Load ingredient photos
  useEffect(() => {
    const loadIngredientPhotos = async () => {
      const newPhotos = new Map<number, IngredientPhoto>();
      
      for (let i = 0; i < recipe.ingredients.length; i++) {
        const ing = recipe.ingredients[i];
        try {
          const photo = await getIngredientPhoto(ing.name);
          newPhotos.set(i, photo);
        } catch (error) {
          console.error(`Failed to load photo for ${ing.name}:`, error);
        }
      }
      
      setIngredientPhotos(newPhotos);
    };

    if (showIngredients) {
      loadIngredientPhotos();
    }
  }, [recipe.ingredients, showIngredients]);

  // Load equipment photos
  useEffect(() => {
    const loadEquipmentPhotos = async () => {
      if (!recipe.equipment || recipe.equipment.length === 0) return;
      
      const newPhotos = new Map<number, EquipmentPhoto>();
      
      for (let i = 0; i < recipe.equipment.length; i++) {
        const eq = recipe.equipment[i];
        try {
          const photo = await getEquipmentPhoto(eq);
          newPhotos.set(i, photo);
        } catch (error) {
          console.error(`Failed to load photo for ${eq}:`, error);
        }
      }
      
      setEquipmentPhotos(newPhotos);
    };

    if (showIngredients) {
      loadEquipmentPhotos();
    }
  }, [recipe.equipment, showIngredients]);

  // Load photo for current step
  useEffect(() => {
    const loadPhoto = async () => {
      if (!stepPhotos.has(currentStepIndex)) {
        setLoadingPhoto(true);
        try {
          const photo = await getCookingStepPhoto(
            currentStep.instruction,
            recipe.title
          );
          setStepPhotos(prev => new Map(prev).set(currentStepIndex, photo));
        } catch (error) {
          console.error('Failed to load photo:', error);
        } finally {
          setLoadingPhoto(false);
        }
      } else {
        setLoadingPhoto(false);
      }
    };

    if (!showIngredients && currentStep) {
      loadPhoto();
    }
  }, [currentStepIndex, showIngredients, currentStep, recipe.title, stepPhotos]);

  // Auto-speak step when it loads
  useEffect(() => {
    if (!showIngredients && currentStep && !loadingPhoto) {
      setTimeout(() => {
        speakInstruction(currentStep.instruction);
      }, 500);
    }
  }, [currentStepIndex, showIngredients, loadingPhoto, currentStep]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timerSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimerSeconds(s => {
        if (s <= 1) {
          // Timer finished - play alert sound
          playTimerAlert();
          setTimerActive(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  // Extract safety tips from current step
  useEffect(() => {
    if (!currentStep) return;

    const tips: SafetyTip[] = [];
    const inst = currentStep.instruction.toLowerCase();

    // Hot/heat warnings
    if (/hot|boil|fry|bake|oven|stove|heat/.test(inst)) {
      tips.push({
        icon: '🔥',
        text: 'Be careful! This step is HOT. Watch your hands.',
        severity: 'danger'
      });
    }

    // Sharp object warnings
    if (/cut|slice|chop|dice|knife/.test(inst)) {
      tips.push({
        icon: '🔪',
        text: 'You will use a sharp knife. Be careful of your fingers!',
        severity: 'warning'
      });
    }

    // Timing warnings
    if (/minute|hour|time|cook|bake|until/.test(inst)) {
      tips.push({
        icon: '⏱️',
        text: 'This step takes time. Use the timer button below.',
        severity: 'info'
      });
    }

    setSafetyTips(tips);
  }, [currentStep]);

  const speakInstruction = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextStep = () => {
    if (!isLastStep) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
    }
  };

  const handlePreviousStep = () => {
    if (!isFirstStep) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
    }
  };

  const playTimerAlert = () => {
    // Use Web Audio API for alert sound
    if ('AudioContext' in window) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setTimerActive(true);
    speakInstruction(`Timer started for ${minutes} minutes`);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Ingredient checklist screen
  if (showIngredients) {
    return (
      <div className="cognitive-accessible-recipe">
        <div className="ingredients-screen">
          <h1 className="recipe-title">{recipe.title}</h1>

          <div className="ingredients-section">
            <h2 className="section-title">📋 Get These Items:</h2>
            <div className="ingredients-checklist">
              {recipe.ingredients.map((ing, i) => {
                const photo = ingredientPhotos.get(i);
                return (
                  <div key={i} className="ingredient-check-item">
                    <input
                      type="checkbox"
                      id={`ing-${i}`}
                      className="ingredient-checkbox"
                    />
                    <label htmlFor={`ing-${i}`} className="ingredient-check-label">
                      <div className="ingredient-photo-container">
                        {photo ? (
                          photo.source === 'unsplash' && photo.url ? (
                            <img
                              src={photo.url}
                              alt={photo.alt}
                              className="ingredient-photo"
                            />
                          ) : (
                            <div className="ingredient-emoji">{photo.alt}</div>
                          )
                        ) : (
                          <div className="ingredient-photo-loading">⏳</div>
                        )}
                      </div>
                      <div className="ingredient-text">
                        <span className="ingredient-check-amount">{ing.amount}</span>
                        <span className="ingredient-check-name">{ing.name}</span>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {recipe.equipment && recipe.equipment.length > 0 && (
            <div className="equipment-section">
              <h2 className="section-title">🛠️ Tools You Need:</h2>
              <div className="equipment-checklist">
                {recipe.equipment.map((eq, i) => {
                  const photo = equipmentPhotos.get(i);
                  return (
                    <div key={i} className="equipment-check-item">
                      <input
                        type="checkbox"
                        id={`eq-${i}`}
                        className="equipment-checkbox"
                      />
                      <label htmlFor={`eq-${i}`} className="equipment-check-label">
                        <div className="ingredient-photo-container">
                          {photo ? (
                            photo.source === 'unsplash' && photo.url ? (
                              <img
                                src={photo.url}
                                alt={photo.alt}
                                className="ingredient-photo"
                              />
                            ) : (
                              <div className="ingredient-emoji">{photo.alt}</div>
                            )
                          ) : (
                            <div className="ingredient-photo-loading">⏳</div>
                          )}
                        </div>
                        <div className="ingredient-text">
                          <span className="equipment-check-name">{eq}</span>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="start-button-wrapper">
            <button
              onClick={() => {
                setShowIngredients(false);
                setCurrentStepIndex(0);
              }}
              className="btn-huge btn-primary"
            >
              Ready to Cook? 👉
            </button>
          </div>

          <button onClick={onBack} className="btn-back">
            🔍 Start New Search
          </button>
        </div>
      </div>
    );
  }

  // Cooking steps screen
  const currentPhoto = stepPhotos.get(currentStepIndex);
  const progressPercent = Math.round(((currentStepIndex + 1) / allSteps.length) * 100);
  const stepsRemaining = allSteps.length - currentStepIndex - 1;

  return (
    <div className="cognitive-accessible-recipe">
      <div className="cooking-step-screen">
        {/* Progress Tracker */}
        <div className="progress-tracker">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="progress-circles">
            {allSteps.map((_, index) => (
              <div 
                key={index} 
                className={`progress-circle ${
                  index < currentStepIndex ? 'completed' : 
                  index === currentStepIndex ? 'current' : 
                  'upcoming'
                }`}
              >
                {index < currentStepIndex ? '✓' : index + 1}
              </div>
            ))}
          </div>
          <div className="progress-text">
            {stepsRemaining === 0 
              ? '🎉 Last step! Almost done!' 
              : currentStepIndex === 0 
              ? `${allSteps.length} steps total. Let's start!`
              : `${stepsRemaining} more ${stepsRemaining === 1 ? 'step' : 'steps'} to go!`
            }
          </div>
        </div>

        {/* Step counter */}
        <div className="step-counter">
          Step {currentStepIndex + 1} of {allSteps.length}
        </div>

        {/* Safety warnings */}
        {safetyTips.length > 0 && (
          <div className="safety-alerts">
            {safetyTips.map((tip, i) => (
              <div key={i} className={`safety-alert safety-${tip.severity}`}>
                <span className="safety-icon">{tip.icon}</span>
                <span className="safety-text">{tip.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Step photo */}
        {currentPhoto ? (
          currentPhoto.url ? (
            <div className="step-photo-container">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.alt}
                className="step-photo"
                loading="lazy"
              />
              <span className="photo-source">Photo from Unsplash</span>
            </div>
          ) : (
            <div className="step-emoji-fallback">
              <div className="emoji-large">{currentPhoto.alt.split(' ')[0]}</div>
            </div>
          )
        ) : loadingPhoto ? (
          <div className="step-photo-loading">
            <div className="spinner">⏳</div>
            <p>Loading photo...</p>
          </div>
        ) : null}

        {/* Section and instruction */}
        <div className="step-section-label">{currentStep.section}</div>

        <div className="instruction-area">
          <h2 className="instruction-text">{currentStep.instruction}</h2>
        </div>

        {/* Voice button */}
        <button
          onClick={() => speakInstruction(currentStep.instruction)}
          className={`btn-huge btn-speak ${isSpeaking ? 'speaking' : ''}`}
          aria-label="Hear this step aloud"
        >
          {isSpeaking ? '🔊 Listening...' : '🔊 Read to Me'}
        </button>

        {/* Timer buttons (if step involves cooking time) */}
        <div className="timer-controls">
          {timerActive && timerSeconds > 0 ? (
            <>
              <div className="timer-display">{formatTime(timerSeconds)}</div>
              <button
                onClick={() => setTimerActive(false)}
                className="btn-timer btn-danger"
              >
                ⏹️ Stop Timer
              </button>
            </>
          ) : (
            <>
              <button onClick={() => startTimer(1)} className="btn-timer">
                ⏱️ 1 min
              </button>
              <button onClick={() => startTimer(5)} className="btn-timer">
                ⏱️ 5 min
              </button>
              <button onClick={() => startTimer(10)} className="btn-timer">
                ⏱️ 10 min
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
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

        {/* Tips section */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div className="tips-section">
            <h3>💡 Helpful Tips:</h3>
            {recipe.tips.map((tip, i) => (
              <p key={i}>{tip}</p>
            ))}
          </div>
        )}

        {/* Back button */}
        <button onClick={onBack} className="btn-back">
          🔍 Start New Search
        </button>
      </div>
    </div>
  );
}
