import { useState, useEffect, useRef, useCallback } from 'react';
import type { Recipe } from '../types';
import { getCookingStepPhoto, type StepPhoto } from '../services/stepPhotos';
import { getIngredientPhoto, getEquipmentPhoto, type IngredientPhoto, type EquipmentPhoto } from '../services/ingredientPhotos';
import { getBasicRecipeStepPhoto, getBasicRecipeIngredientPhoto, getBasicRecipeEquipmentPhoto } from '../services/recipePhotos';
import { parseVoiceCommand, executeVoiceCommand, createSpeechRecognition, isSpeechRecognitionSupported, speakFeedback, VOICE_COMMANDS_HELP } from '../services/voiceCommands';
import { scaleRecipe, SCALE_OPTIONS } from '../services/recipeScaling';
import { estimateNutrition, type NutritionEstimate } from '../services/nutritionService';
import { startCookingSession, completeCookingSession, updateSessionProgress, rateSession } from '../services/cookingHistory';
import { getShareOptions } from '../services/socialSharing';

interface Props {
  recipe: Recipe;
  onBack: () => void;
  onComplete?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
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
 * - Voice commands for hands-free control
 * - Recipe scaling for different serving sizes
 * - Nutrition information display
 * - Cooking history and progress tracking
 * - Social sharing options
 */
export default function EnhancedCognitiveRecipe({ recipe, onBack, onComplete, onToggleFavorite, isFavorite }: Props) {
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
  const [showEmergency, setShowEmergency] = useState(false);
  
  // New state for features 6-10
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [scaledRecipe, setScaledRecipe] = useState(recipe);
  const [showNutrition, setShowNutrition] = useState(false);
  const [nutritionData, setNutritionData] = useState<NutritionEstimate | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [sessionRating, setSessionRating] = useState(0);
  const [cookingStartTime] = useState(Date.now());
  
  const recognitionRef = useRef<any>(null);

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
          // Try pre-defined photos first for basic recipes
          if (recipe.id) {
            const predefinedPhoto = getBasicRecipeIngredientPhoto(recipe.id, ing.name);
            if (predefinedPhoto) {
              newPhotos.set(i, { source: 'unsplash', url: predefinedPhoto, alt: ing.name });
              continue;
            }
          }
          
          // Fall back to dynamic photo search
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
  }, [recipe.ingredients, recipe.id, showIngredients]);

  // Load equipment photos
  useEffect(() => {
    const loadEquipmentPhotos = async () => {
      if (!recipe.equipment || recipe.equipment.length === 0) return;
      
      const newPhotos = new Map<number, EquipmentPhoto>();
      
      for (let i = 0; i < recipe.equipment.length; i++) {
        const eq = recipe.equipment[i];
        try {
          // Try pre-defined photos first for basic recipes
          if (recipe.id) {
            const predefinedPhoto = getBasicRecipeEquipmentPhoto(recipe.id, eq);
            if (predefinedPhoto) {
              newPhotos.set(i, { source: 'unsplash', url: predefinedPhoto, alt: eq });
              continue;
            }
          }
          
          // Fall back to dynamic photo search
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
  }, [recipe.equipment, recipe.id, showIngredients]);

  // Load photo for current step
  useEffect(() => {
    const loadPhoto = async () => {
      if (!stepPhotos.has(currentStepIndex)) {
        setLoadingPhoto(true);
        try {
          // Try pre-defined photos first for basic recipes
          if (recipe.id && currentStep.stepNumber) {
            const predefinedPhoto = getBasicRecipeStepPhoto(recipe.id, currentStep.stepNumber);
            if (predefinedPhoto) {
              setStepPhotos(prev => new Map(prev).set(currentStepIndex, {
                source: 'unsplash',
                url: predefinedPhoto,
                alt: currentStep.instruction
              }));
              setLoadingPhoto(false);
              return;
            }
          }
          
          // Fall back to dynamic photo search
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
  }, [currentStepIndex, showIngredients, currentStep, recipe.title, recipe.id, stepPhotos]);

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

  // Scale recipe when factor changes
  useEffect(() => {
    if (scaleFactor !== 1) {
      setScaledRecipe(scaleRecipe(recipe, recipe.servings * scaleFactor));
    } else {
      setScaledRecipe(recipe);
    }
  }, [recipe, scaleFactor]);

  // Calculate nutrition data
  useEffect(() => {
    const nutrition = estimateNutrition(scaledRecipe.ingredients, scaledRecipe.servings);
    setNutritionData(nutrition);
  }, [scaledRecipe]);

  // Start cooking session on mount
  useEffect(() => {
    startCookingSession(recipe.title, allSteps.length, recipe.id);
  }, [recipe.title, recipe.id, allSteps.length]);

  // Update session progress when step changes
  useEffect(() => {
    updateSessionProgress(recipe.title, currentStepIndex + 1);
  }, [recipe.title, currentStepIndex]);

  // Voice recognition setup
  const setupVoiceRecognition = useCallback(() => {
    if (!isSpeechRecognitionSupported()) {
      speakFeedback("Sorry, voice commands are not supported in your browser.");
      return;
    }

    const recognition = createSpeechRecognition();
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      const command = parseVoiceCommand(transcript);
      
      const executed = executeVoiceCommand(command, {
        onNext: handleNextStep,
        onPrevious: handlePreviousStep,
        onRead: () => speakInstruction(currentStep?.instruction || ''),
        onTimer: startTimer,
        onStop: () => {
          setTimerActive(false);
          speakFeedback("Timer stopped");
        },
        onHelp: () => {
          setShowEmergency(true);
          speakFeedback("Showing safety help");
        },
        onDone: handleComplete,
        onFavorite: () => {
          if (onToggleFavorite) {
            onToggleFavorite();
            speakFeedback(isFavorite ? "Removed from favorites" : "Added to favorites");
          }
        },
      });

      if (executed) {
        speakFeedback(`Got it: ${command.replace(/-/g, ' ')}`);
      }
    };

    recognition.onend = () => {
      // Restart if still enabled
      if (voiceEnabled && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Already started
        }
      }
      setVoiceListening(false);
    };

    recognition.onerror = () => {
      setVoiceListening(false);
    };

    recognitionRef.current = recognition;
  }, [currentStep, isFavorite, onToggleFavorite, voiceEnabled]);

  // Toggle voice recognition
  const toggleVoiceCommands = useCallback(() => {
    if (voiceEnabled) {
      // Disable
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setVoiceEnabled(false);
      setVoiceListening(false);
      speakFeedback("Voice commands off");
    } else {
      // Enable
      setVoiceEnabled(true);
      setupVoiceRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setVoiceListening(true);
        speakFeedback("Voice commands on. Say 'help' to see commands.");
      }
    }
  }, [voiceEnabled, setupVoiceRecognition]);

  // Cleanup voice recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle recipe completion with rating
  const handleComplete = useCallback(() => {
    const durationMinutes = Math.round((Date.now() - cookingStartTime) / 60000);
    completeCookingSession(recipe.title, sessionRating || undefined, undefined, durationMinutes);
    
    if (onComplete) {
      onComplete();
    } else {
      setShowIngredients(true);
      setCurrentStepIndex(0);
    }
  }, [recipe.title, cookingStartTime, sessionRating, onComplete]);

  // Handle rating selection
  const handleRating = (rating: number) => {
    setSessionRating(rating);
    rateSession(recipe.title, rating);
  };

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
          <h1 className="recipe-title">{scaledRecipe.title}</h1>

          {/* Recipe Scaling Controls */}
          <div className="scale-controls">
            <span className="scale-label">Servings:</span>
            <div className="scale-buttons">
              {SCALE_OPTIONS.map(option => (
                <button
                  key={option.factor}
                  onClick={() => setScaleFactor(option.factor)}
                  className={`btn-scale ${scaleFactor === option.factor ? 'active' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <span className="servings-display">{scaledRecipe.servings} servings</span>
          </div>

          {/* Nutrition Toggle */}
          <button 
            onClick={() => setShowNutrition(!showNutrition)} 
            className="btn-nutrition-toggle"
          >
            {showNutrition ? '📊 Hide Nutrition' : '📊 Show Nutrition'}
          </button>

          {/* Nutrition Panel */}
          {showNutrition && nutritionData && (
            <div className="nutrition-panel">
              <h3>Nutrition Per Serving</h3>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-value">{nutritionData.perServing.calories}</span>
                  <span className="nutrition-label">Calories</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">{nutritionData.perServing.protein}g</span>
                  <span className="nutrition-label">Protein</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">{nutritionData.perServing.carbs}g</span>
                  <span className="nutrition-label">Carbs</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">{nutritionData.perServing.fat}g</span>
                  <span className="nutrition-label">Fat</span>
                </div>
              </div>
              {nutritionData.confidence !== 'high' && (
                <p className="nutrition-disclaimer">
                  ⚠️ Estimate only - {nutritionData.warnings.join(', ')}
                </p>
              )}
            </div>
          )}

          <div className="ingredients-section">
            <h2 className="section-title">📋 Get These Items:</h2>
            <div className="ingredients-checklist">
              {scaledRecipe.ingredients.map((ing, i) => {
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

          {/* Share Button */}
          <div className="share-section">
            <button onClick={() => setShowShare(!showShare)} className="btn-share">
              📤 Share Recipe
            </button>
            
            {showShare && (
              <div className="share-options">
                {getShareOptions().map(option => (
                  <button
                    key={option.id}
                    onClick={() => option.action(recipe)}
                    className="btn-share-option"
                  >
                    {option.icon} {option.label}
                  </button>
                ))}
              </div>
            )}
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
        {/* NEXT Button - Always at Top */}
        {!isLastStep && (
          <div className="next-button-sticky">
            <button
              onClick={handleNextStep}
              className="btn-huge btn-next-prominent"
              aria-label="Next step"
            >
              NEXT STEP →
            </button>
          </div>
        )}

        {/* Voice Command Toggle */}
        <div className="voice-control-bar">
          <button
            onClick={toggleVoiceCommands}
            className={`btn-voice ${voiceEnabled ? 'active' : ''} ${voiceListening ? 'listening' : ''}`}
          >
            {voiceListening ? '🎤 Listening...' : voiceEnabled ? '🎤 Voice ON' : '🎤 Voice Commands'}
          </button>
          {voiceEnabled && (
            <button onClick={() => setShowVoiceHelp(!showVoiceHelp)} className="btn-voice-help">
              ❓
            </button>
          )}
        </div>

        {/* Voice Commands Help */}
        {showVoiceHelp && (
          <div className="voice-help-panel">
            <h3>🎤 Voice Commands:</h3>
            <ul className="voice-commands-list">
              {VOICE_COMMANDS_HELP.map((cmd, i) => (
                <li key={i}>
                  <strong>{cmd.command}</strong> - {cmd.description}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowVoiceHelp(false)} className="btn-secondary">
              Close
            </button>
          </div>
        )}
        
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

        {/* Secondary Controls */}
        <div className="step-controls-secondary">
          {!isFirstStep && (
            <button
              onClick={handlePreviousStep}
              className="btn-back"
              aria-label="Previous step"
            >
              ← Go Back
            </button>
          )}

          {isLastStep && !showRating && (
            <button
              onClick={() => setShowRating(true)}
              className="btn-step btn-done"
              aria-label="Done cooking"
            >
              ✓ All Done!
            </button>
          )}
        </div>

        {/* Rating Panel (shown when done) */}
        {showRating && (
          <div className="rating-panel">
            <h3>🎉 Great job! How did it go?</h3>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`star-btn ${sessionRating >= star ? 'active' : ''}`}
                >
                  {sessionRating >= star ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            <p className="rating-label">
              {sessionRating === 0 ? 'Tap a star to rate' :
               sessionRating <= 2 ? "We'll make it better next time!" :
               sessionRating <= 4 ? "Nice work!" : "Amazing! You're a star chef! 👨‍🍳"}
            </p>
            <button onClick={handleComplete} className="btn-primary btn-finish">
              {sessionRating > 0 ? '✓ Save & Finish' : 'Skip & Finish'}
            </button>
          </div>
        )}

        {/* Emergency/Safety Button */}
        <div className="emergency-section">
          <button 
            onClick={() => setShowEmergency(!showEmergency)} 
            className="btn-emergency"
          >
            🆘 Need Help?
          </button>
          
          {showEmergency && (
            <div className="emergency-panel">
              <h3>🛑 Safety First!</h3>
              <div className="emergency-actions">
                <div className="emergency-tip">
                  <span className="emergency-icon">🔥</span>
                  <span>Turn OFF the stove/oven</span>
                </div>
                <div className="emergency-tip">
                  <span className="emergency-icon">🚰</span>
                  <span>Run cold water on burns</span>
                </div>
                <div className="emergency-tip">
                  <span className="emergency-icon">🚪</span>
                  <span>Leave if you smell gas</span>
                </div>
                <div className="emergency-tip">
                  <span className="emergency-icon">📞</span>
                  <span>Call 911 for emergencies</span>
                </div>
              </div>
              <button onClick={() => setShowEmergency(false)} className="btn-secondary">
                Close
              </button>
            </div>
          )}
        </div>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button onClick={onToggleFavorite} className={`btn-favorite-cooking ${isFavorite ? 'active' : ''}`}>
            {isFavorite ? '❤️ Saved to My Recipes' : '🤍 Save This Recipe'}
          </button>
        )}

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
