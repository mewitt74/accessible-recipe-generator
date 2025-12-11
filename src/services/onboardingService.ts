/**
 * Onboarding Service
 * Guided tutorial for first-time users
 */

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: string; // CSS selector to highlight
  position?: 'top' | 'bottom' | 'center';
}

const ONBOARDING_STORAGE_KEY = 'recipe_app_onboarding_complete';

/**
 * Check if user has completed onboarding
 */
export function hasCompletedOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark onboarding as complete
 */
export function completeOnboarding(): void {
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  } catch (error) {
    console.error('Failed to save onboarding status:', error);
  }
}

/**
 * Reset onboarding (for testing or re-showing)
 */
export function resetOnboarding(): void {
  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset onboarding:', error);
  }
}

/**
 * Onboarding steps for the app
 */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome! 👋',
    description: 'This app helps you cook easy recipes step by step. Let me show you how it works!',
    icon: '🍳',
    position: 'center'
  },
  {
    id: 'dont-know',
    title: "Don't Know What to Make?",
    description: 'Tap this big orange button and we\'ll suggest a simple recipe for you!',
    icon: '🤷',
    highlight: '.btn-dont-know',
    position: 'bottom'
  },
  {
    id: 'categories',
    title: 'Pick a Category',
    description: 'Or choose what type of food you want - breakfast, lunch, dinner, or snacks.',
    icon: '🍽️',
    highlight: '.category-grid',
    position: 'top'
  },
  {
    id: 'voice',
    title: 'Hands-Free Cooking 🎤',
    description: 'While cooking, tap the microphone button and say "Next" to go to the next step. Your hands can stay clean!',
    icon: '🗣️',
    position: 'center'
  },
  {
    id: 'timer',
    title: 'Easy Timers ⏱️',
    description: 'Need to wait? Tap a timer button (1, 5, or 10 minutes). We\'ll beep when time is up!',
    icon: '⏰',
    position: 'center'
  },
  {
    id: 'read-aloud',
    title: 'Read to Me 🔊',
    description: 'Tap "Read to Me" and I\'ll read the instructions out loud. Great when your hands are busy!',
    icon: '📢',
    position: 'center'
  },
  {
    id: 'emergency',
    title: 'Need Help? 🆘',
    description: 'If something goes wrong while cooking, tap "Need Help?" for safety tips.',
    icon: '🚨',
    position: 'center'
  },
  {
    id: 'favorites',
    title: 'Save Your Favorites ❤️',
    description: 'Like a recipe? Tap the heart to save it. Find your saved recipes anytime with "My Recipes".',
    icon: '💝',
    highlight: '.btn-favorites',
    position: 'bottom'
  },
  {
    id: 'ready',
    title: "You're Ready! 🎉",
    description: "That's it! Start cooking and have fun. You can see this tutorial again in Settings.",
    icon: '👨‍🍳',
    position: 'center'
  }
];

/**
 * Get step by index
 */
export function getOnboardingStep(index: number): OnboardingStep | null {
  if (index >= 0 && index < ONBOARDING_STEPS.length) {
    return ONBOARDING_STEPS[index];
  }
  return null;
}

/**
 * Total number of steps
 */
export function getTotalSteps(): number {
  return ONBOARDING_STEPS.length;
}
