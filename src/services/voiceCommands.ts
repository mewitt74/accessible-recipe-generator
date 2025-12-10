/**
 * Voice Commands Service
 * Hands-free control for cooking: "Next step", "Read again", "Set timer", etc.
 */

export type VoiceCommand = 
  | 'next'
  | 'back' 
  | 'previous'
  | 'read'
  | 'repeat'
  | 'timer-1'
  | 'timer-5'
  | 'timer-10'
  | 'stop'
  | 'help'
  | 'done'
  | 'favorite'
  | 'unknown';

interface VoiceCommandHandler {
  onNext: () => void;
  onPrevious: () => void;
  onRead: () => void;
  onTimer: (minutes: number) => void;
  onStop: () => void;
  onHelp: () => void;
  onDone: () => void;
  onFavorite: () => void;
}

// Command patterns - what users might say
const COMMAND_PATTERNS: { pattern: RegExp; command: VoiceCommand }[] = [
  // Next step
  { pattern: /\b(next|forward|continue|go)\b/i, command: 'next' },
  
  // Previous step  
  { pattern: /\b(back|previous|go back|before)\b/i, command: 'back' },
  
  // Read/repeat instruction
  { pattern: /\b(read|repeat|again|say|tell|what)\b/i, command: 'read' },
  
  // Timer commands
  { pattern: /\b(timer|time|set).*(1|one)\s*(minute|min)?\b/i, command: 'timer-1' },
  { pattern: /\b(timer|time|set).*(5|five)\s*(minute|min)?\b/i, command: 'timer-5' },
  { pattern: /\b(timer|time|set).*(10|ten)\s*(minute|min)?\b/i, command: 'timer-10' },
  { pattern: /\b(1|one)\s*(minute|min)?\s*(timer|time)\b/i, command: 'timer-1' },
  { pattern: /\b(5|five)\s*(minute|min)?\s*(timer|time)\b/i, command: 'timer-5' },
  { pattern: /\b(10|ten)\s*(minute|min)?\s*(timer|time)\b/i, command: 'timer-10' },
  
  // Stop timer
  { pattern: /\b(stop|cancel|pause|clear)\b/i, command: 'stop' },
  
  // Help/emergency
  { pattern: /\b(help|emergency|sos|urgent)\b/i, command: 'help' },
  
  // Done/finish
  { pattern: /\b(done|finish|complete|all done)\b/i, command: 'done' },
  
  // Favorite
  { pattern: /\b(save|favorite|heart|love)\b/i, command: 'favorite' },
];

/**
 * Parse spoken text into a command
 */
export function parseVoiceCommand(transcript: string): VoiceCommand {
  const text = transcript.toLowerCase().trim();
  
  for (const { pattern, command } of COMMAND_PATTERNS) {
    if (pattern.test(text)) {
      return command;
    }
  }
  
  return 'unknown';
}

/**
 * Execute a voice command
 */
export function executeVoiceCommand(command: VoiceCommand, handlers: VoiceCommandHandler): boolean {
  switch (command) {
    case 'next':
      handlers.onNext();
      return true;
    case 'back':
    case 'previous':
      handlers.onPrevious();
      return true;
    case 'read':
    case 'repeat':
      handlers.onRead();
      return true;
    case 'timer-1':
      handlers.onTimer(1);
      return true;
    case 'timer-5':
      handlers.onTimer(5);
      return true;
    case 'timer-10':
      handlers.onTimer(10);
      return true;
    case 'stop':
      handlers.onStop();
      return true;
    case 'help':
      handlers.onHelp();
      return true;
    case 'done':
      handlers.onDone();
      return true;
    case 'favorite':
      handlers.onFavorite();
      return true;
    default:
      return false;
  }
}

/**
 * Check if browser supports speech recognition
 */
export function isSpeechRecognitionSupported(): boolean {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

/**
 * Create a speech recognition instance
 */
export function createSpeechRecognition(): any {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }
  
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;
  
  return recognition;
}

/**
 * Speak feedback to user
 */
export function speakFeedback(text: string): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Available voice commands for help display
 */
export const VOICE_COMMANDS_HELP = [
  { command: '"Next"', description: 'Go to next step' },
  { command: '"Back"', description: 'Go to previous step' },
  { command: '"Read again"', description: 'Repeat the instruction' },
  { command: '"Set 5 minute timer"', description: 'Start a timer' },
  { command: '"Stop"', description: 'Stop the timer' },
  { command: '"Help"', description: 'Show safety tips' },
  { command: '"Save"', description: 'Save to favorites' },
  { command: '"Done"', description: 'Finish cooking' },
];
