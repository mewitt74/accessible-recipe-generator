/**
 * Onboarding Component
 * Guided tutorial for first-time users
 */

import { useState } from 'react';
import { ONBOARDING_STEPS, completeOnboarding, getTotalSteps } from '../services/onboardingService';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = getTotalSteps();
  const step = ONBOARDING_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    completeOnboarding();
    onComplete();
  };

  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        {/* Progress dots */}
        <div className="onboarding-progress">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`onboarding-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="onboarding-content">
          <div className="onboarding-icon">{step.icon}</div>
          <h2 className="onboarding-title">{step.title}</h2>
          <p className="onboarding-description">{step.description}</p>
        </div>

        {/* Step counter */}
        <div className="onboarding-step-counter">
          {currentStep + 1} of {totalSteps}
        </div>

        {/* Buttons */}
        <div className="onboarding-buttons">
          {!isFirstStep && (
            <button onClick={handlePrevious} className="btn-onboarding-back">
              ← Back
            </button>
          )}
          
          <button onClick={handleSkip} className="btn-onboarding-skip">
            Skip Tutorial
          </button>

          <button onClick={handleNext} className="btn-onboarding-next">
            {isLastStep ? "Let's Cook! 🍳" : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
