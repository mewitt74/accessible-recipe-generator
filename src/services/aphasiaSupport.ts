/**
 * Aphasia & Cognitive Support Service
 * Specialized features for users with aphasia and cognitive disabilities
 * - Auto-read instructions aloud
 * - Idle reminders to check on progress
 * - Simplified language processing
 * - Visual + audio cues
 */

import { getStepActionDetails } from './stepPhotos';

// Idle reminder intervals
const IDLE_REMINDER_INTERVAL = 60000; // 60 seconds
const IDLE_REMINDER_URGENT = 180000; // 3 minutes

let idleTimer: ReturnType<typeof setTimeout> | null = null;
let urgentTimer: ReturnType<typeof setTimeout> | null = null;
let lastActivityTime = Date.now();

/**
 * Simplify instruction text for easier reading
 * - Shorter sentences
 * - Simple words
 * - Remove complex phrases
 */
export function simplifyInstruction(instruction: string): string {
  let simplified = instruction;
  
  // Replace complex cooking terms with simpler ones
  const simplifications: [RegExp, string][] = [
    [/sauté/gi, 'cook in a pan'],
    [/simmer/gi, 'cook on low heat'],
    [/fold in/gi, 'mix gently'],
    [/whisk/gi, 'stir fast'],
    [/dice/gi, 'cut into small pieces'],
    [/mince/gi, 'cut very small'],
    [/julienne/gi, 'cut into thin strips'],
    [/blanch/gi, 'boil quickly then cool'],
    [/braise/gi, 'cook slowly with liquid'],
    [/deglaze/gi, 'add liquid to hot pan'],
    [/reduce/gi, 'cook until less liquid'],
    [/incorporate/gi, 'mix in'],
    [/approximately/gi, 'about'],
    [/subsequently/gi, 'then'],
    [/ensure/gi, 'make sure'],
    [/prior to/gi, 'before'],
    [/utilize/gi, 'use'],
    [/combine/gi, 'mix together'],
    [/transfer/gi, 'move'],
    [/thoroughly/gi, 'well'],
    [/vigorously/gi, 'fast'],
    [/gently/gi, 'slowly'],
  ];
  
  for (const [pattern, replacement] of simplifications) {
    simplified = simplified.replace(pattern, replacement);
  }
  
  return simplified;
}

/**
 * Break instruction into smaller, numbered steps
 */
export function breakIntoMicroSteps(instruction: string): string[] {
  // Split on periods, "then", "and then", commas with verbs
  const microSteps: string[] = [];
  
  // Split by sentence endings and connectors
  const parts = instruction
    .split(/(?:\.\s*|\s+then\s+|\s+and then\s+)/i)
    .filter(p => p.trim().length > 0);
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed) {
      // Capitalize first letter
      microSteps.push(trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
    }
  }
  
  return microSteps.length > 0 ? microSteps : [instruction];
}

/**
 * Get an icon for the action in the instruction
 */
export function getActionIcon(instruction: string): string {
  const sharedAction = getStepActionDetails(instruction);
  if (sharedAction) {
    return sharedAction.emoji;
  }

  const lower = instruction.toLowerCase();
  
  if (/pour|add|put/.test(lower)) return '🫗';
  if (/wait|let|rest|cool/.test(lower)) return '⏳';
  if (/wash|rinse|clean/.test(lower)) return '🚿';
  if (/peel/.test(lower)) return '🥔';
  if (/measure|cup|spoon/.test(lower)) return '📏';
  if (/serve|plate/.test(lower)) return '🍽️';
  if (/taste|check/.test(lower)) return '👅';
  if (/turn|flip/.test(lower)) return '🔄';
  if (/cover|lid/.test(lower)) return '🫕';
  if (/remove|take/.test(lower)) return '👋';
  if (/season|salt|pepper/.test(lower)) return '🧂';
  if (/preheat|oven/.test(lower)) return '🌡️';
  
  return '👉'; // Default pointer
}

/**
 * Speak text with appropriate pace for comprehension
 * Slower pace, clear enunciation, pauses between phrases
 */
export function speakForAphasia(
  text: string, 
  options?: { 
    onStart?: () => void;
    onEnd?: () => void;
    rate?: number;
  }
): SpeechSynthesisUtterance | null {
  if (!('speechSynthesis' in window)) {
    return null;
  }
  
  // Stop any current speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Slower rate for better comprehension (0.7 = 70% of normal speed)
  utterance.rate = options?.rate || 0.75;
  
  // Slightly higher pitch for clarity
  utterance.pitch = 1.1;
  
  // Volume
  utterance.volume = 1.0;
  
  // Use a clear, natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    v.name.includes('Google') || 
    v.name.includes('Natural') || 
    v.name.includes('Samantha') ||
    v.name.includes('Daniel')
  );
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  if (options?.onStart) {
    utterance.onstart = options.onStart;
  }
  
  if (options?.onEnd) {
    utterance.onend = options.onEnd;
  }
  
  window.speechSynthesis.speak(utterance);
  
  return utterance;
}

/**
 * Play a gentle attention sound
 */
export function playAttentionSound(type: 'gentle' | 'reminder' | 'urgent' = 'gentle'): void {
  if (!('AudioContext' in window)) return;
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch (type) {
    case 'gentle':
      oscillator.frequency.value = 440; // A4 note
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
      
    case 'reminder':
      // Two-note chime
      oscillator.frequency.value = 523; // C5
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      break;
      
    case 'urgent':
      // Three-note alert
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime); // E5
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.4); // E5
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.6);
      break;
  }
}

/**
 * Start idle reminders
 * Checks if user has been inactive and plays gentle reminders
 */
export function startIdleReminders(
  onIdle: () => void,
  onUrgent: () => void
): () => void {
  lastActivityTime = Date.now();
  
  const checkIdle = () => {
    const idleTime = Date.now() - lastActivityTime;
    
    if (idleTime >= IDLE_REMINDER_URGENT) {
      playAttentionSound('urgent');
      onUrgent();
    } else if (idleTime >= IDLE_REMINDER_INTERVAL) {
      playAttentionSound('reminder');
      onIdle();
    }
  };
  
  // Check every 30 seconds
  idleTimer = setInterval(checkIdle, 30000);
  
  // Return cleanup function
  return () => {
    if (idleTimer) clearInterval(idleTimer);
    if (urgentTimer) clearTimeout(urgentTimer);
  };
}

/**
 * Reset idle timer (call on user activity)
 */
export function resetIdleTimer(): void {
  lastActivityTime = Date.now();
}

/**
 * Get reminder message based on current step
 */
export function getIdleReminderMessage(stepNumber: number, totalSteps: number, instruction: string): string {
  const progress = Math.round((stepNumber / totalSteps) * 100);
  
  if (progress < 30) {
    return `You're doing great! Step ${stepNumber} says: ${simplifyInstruction(instruction)}`;
  } else if (progress < 70) {
    return `You're halfway there! Current step: ${simplifyInstruction(instruction)}`;
  } else {
    return `Almost done! Step ${stepNumber} of ${totalSteps}: ${simplifyInstruction(instruction)}`;
  }
}

/**
 * Check if an instruction has a wait/timing component
 */
export function hasTimingComponent(instruction: string): { hasTime: boolean; minutes?: number } {
  const lower = instruction.toLowerCase();
  
  // Match patterns like "5 minutes", "for 10 min", "about 15 mins"
  const timeMatch = lower.match(/(\d+)\s*(?:min(?:ute)?s?|hour|hr)/i);
  
  if (timeMatch) {
    let minutes = parseInt(timeMatch[1]);
    if (lower.includes('hour') || lower.includes('hr')) {
      minutes *= 60;
    }
    return { hasTime: true, minutes };
  }
  
  // Check for general timing words without specific time
  if (/wait|until|let it|rest|cool|set aside/.test(lower)) {
    return { hasTime: true };
  }
  
  return { hasTime: false };
}

/**
 * Format a number for easier reading
 */
export function formatNumberSimple(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(n)) return String(num);
  
  // Convert decimals to fractions for easier understanding
  if (n === 0.25) return '¼';
  if (n === 0.5) return '½';
  if (n === 0.75) return '¾';
  if (n === 0.33 || n === 0.333) return '⅓';
  if (n === 0.67 || n === 0.666 || n === 0.667) return '⅔';
  
  // Handle mixed numbers
  if (n > 1) {
    const whole = Math.floor(n);
    const decimal = n - whole;
    if (decimal === 0.5) return `${whole}½`;
    if (decimal === 0.25) return `${whole}¼`;
    if (decimal === 0.75) return `${whole}¾`;
  }
  
  return String(n);
}

/**
 * Generate encouragement message
 */
export function getEncouragementMessage(stepNumber: number, totalSteps: number): string {
  const progress = stepNumber / totalSteps;
  
  const messages = {
    start: [
      "Let's cook! 👨‍🍳",
      "You've got this! 💪",
      "Time to cook! 🍳",
    ],
    middle: [
      "Great job! Keep going! 🌟",
      "You're doing amazing! ✨",
      "Halfway there! 🎯",
      "Looking good! 👍",
    ],
    end: [
      "Almost done! 🎉",
      "Just a little more! 🏁",
      "So close! You can do it! 💫",
      "Final steps! 🙌",
    ],
    done: [
      "You did it! 🎊",
      "Great cooking! 🏆",
      "Enjoy your meal! 😋",
    ],
  };
  
  if (progress === 1) {
    return messages.done[Math.floor(Math.random() * messages.done.length)];
  } else if (progress >= 0.75) {
    return messages.end[Math.floor(Math.random() * messages.end.length)];
  } else if (progress >= 0.25) {
    return messages.middle[Math.floor(Math.random() * messages.middle.length)];
  } else {
    return messages.start[Math.floor(Math.random() * messages.start.length)];
  }
}
