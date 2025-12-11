/**
 * Keyboard Shortcuts Service
 * Quick navigation and actions for accessibility
 */

export interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  action: string;
  description: string;
  category: 'navigation' | 'actions' | 'accessibility' | 'recipe';
}

/**
 * Available keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  // Navigation
  { key: 'h', modifiers: ['alt'], action: 'go-home', description: 'Go to home', category: 'navigation' },
  { key: 'f', modifiers: ['alt'], action: 'go-favorites', description: 'Go to favorites', category: 'navigation' },
  { key: 's', modifiers: ['alt'], action: 'open-settings', description: 'Open settings', category: 'navigation' },
  { key: 'Escape', action: 'close-modal', description: 'Close current panel/modal', category: 'navigation' },
  
  // Actions
  { key: '/', action: 'focus-search', description: 'Focus search/input', category: 'actions' },
  { key: 'Enter', modifiers: ['ctrl'], action: 'submit', description: 'Submit/Generate', category: 'actions' },
  { key: 'p', modifiers: ['ctrl'], action: 'print', description: 'Print recipe', category: 'actions' },
  { key: 'c', modifiers: ['alt'], action: 'copy-recipe', description: 'Copy recipe to clipboard', category: 'actions' },
  
  // Accessibility
  { key: '+', modifiers: ['alt'], action: 'increase-font', description: 'Increase font size', category: 'accessibility' },
  { key: '-', modifiers: ['alt'], action: 'decrease-font', description: 'Decrease font size', category: 'accessibility' },
  { key: 't', modifiers: ['alt'], action: 'toggle-theme', description: 'Toggle theme', category: 'accessibility' },
  { key: 'v', modifiers: ['alt'], action: 'toggle-voice', description: 'Toggle voice commands', category: 'accessibility' },
  { key: 'r', modifiers: ['alt'], action: 'read-aloud', description: 'Read recipe aloud', category: 'accessibility' },
  
  // Recipe navigation
  { key: 'ArrowRight', modifiers: ['alt'], action: 'next-step', description: 'Next step', category: 'recipe' },
  { key: 'ArrowLeft', modifiers: ['alt'], action: 'prev-step', description: 'Previous step', category: 'recipe' },
  { key: 'Space', action: 'start-timer', description: 'Start/pause timer', category: 'recipe' },
  { key: 'l', modifiers: ['alt'], action: 'add-to-list', description: 'Add to shopping list', category: 'recipe' },
  { key: 'b', modifiers: ['alt'], action: 'add-to-favorites', description: 'Add to favorites', category: 'recipe' },
];

export type ShortcutAction = typeof KEYBOARD_SHORTCUTS[number]['action'];

/**
 * Callback type for shortcut handlers
 */
export type ShortcutHandler = (action: ShortcutAction) => void;

// Store registered handlers
const handlers = new Set<ShortcutHandler>();

/**
 * Check if a keyboard event matches a shortcut
 */
function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  // Check key
  if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
    return false;
  }
  
  // Check modifiers
  const modifiers = shortcut.modifiers || [];
  const ctrlRequired = modifiers.includes('ctrl');
  const altRequired = modifiers.includes('alt');
  const shiftRequired = modifiers.includes('shift');
  const metaRequired = modifiers.includes('meta');
  
  // On Mac, ctrl shortcuts often use meta (Cmd)
  const ctrlOrMeta = event.ctrlKey || event.metaKey;
  
  if (ctrlRequired && !ctrlOrMeta) return false;
  if (altRequired && !event.altKey) return false;
  if (shiftRequired && !event.shiftKey) return false;
  if (metaRequired && !event.metaKey) return false;
  
  // Make sure no extra modifiers are pressed (unless it's just ctrl/meta swap)
  if (!ctrlRequired && !metaRequired && (event.ctrlKey || event.metaKey)) return false;
  if (!altRequired && event.altKey) return false;
  if (!shiftRequired && event.shiftKey) return false;
  
  return true;
}

/**
 * Handle keyboard events
 */
function handleKeyDown(event: KeyboardEvent): void {
  // Don't trigger shortcuts when typing in inputs
  const target = event.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    // Only allow Escape and Ctrl+Enter in inputs
    if (event.key !== 'Escape' && !(event.key === 'Enter' && (event.ctrlKey || event.metaKey))) {
      return;
    }
  }
  
  // Find matching shortcut
  for (const shortcut of KEYBOARD_SHORTCUTS) {
    if (matchesShortcut(event, shortcut)) {
      event.preventDefault();
      
      // Notify all handlers
      handlers.forEach(handler => {
        handler(shortcut.action as ShortcutAction);
      });
      
      return;
    }
  }
}

/**
 * Initialize keyboard shortcuts listener
 */
export function initKeyboardShortcuts(): void {
  document.addEventListener('keydown', handleKeyDown);
}

/**
 * Cleanup keyboard shortcuts listener
 */
export function cleanupKeyboardShortcuts(): void {
  document.removeEventListener('keydown', handleKeyDown);
}

/**
 * Register a shortcut handler
 */
export function registerShortcutHandler(handler: ShortcutHandler): () => void {
  handlers.add(handler);
  
  // Return unsubscribe function
  return () => {
    handlers.delete(handler);
  };
}

/**
 * Get shortcuts by category
 */
export function getShortcutsByCategory(category: KeyboardShortcut['category']): KeyboardShortcut[] {
  return KEYBOARD_SHORTCUTS.filter(s => s.category === category);
}

/**
 * Get all categories
 */
export function getShortcutCategories(): KeyboardShortcut['category'][] {
  return ['navigation', 'actions', 'accessibility', 'recipe'];
}

/**
 * Format shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.modifiers) {
    if (shortcut.modifiers.includes('ctrl')) parts.push('Ctrl');
    if (shortcut.modifiers.includes('alt')) parts.push('Alt');
    if (shortcut.modifiers.includes('shift')) parts.push('Shift');
    if (shortcut.modifiers.includes('meta')) parts.push('⌘');
  }
  
  // Format special keys
  let keyDisplay = shortcut.key;
  switch (shortcut.key) {
    case 'ArrowRight': keyDisplay = '→'; break;
    case 'ArrowLeft': keyDisplay = '←'; break;
    case 'ArrowUp': keyDisplay = '↑'; break;
    case 'ArrowDown': keyDisplay = '↓'; break;
    case 'Escape': keyDisplay = 'Esc'; break;
    case ' ':
    case 'Space': keyDisplay = 'Space'; break;
    case 'Enter': keyDisplay = 'Enter'; break;
    default: keyDisplay = shortcut.key.toUpperCase();
  }
  
  parts.push(keyDisplay);
  
  return parts.join(' + ');
}

/**
 * Get category label
 */
export function getCategoryLabel(category: KeyboardShortcut['category']): string {
  const labels: Record<KeyboardShortcut['category'], string> = {
    navigation: '🧭 Navigation',
    actions: '⚡ Actions',
    accessibility: '♿ Accessibility',
    recipe: '📖 Recipe',
  };
  return labels[category];
}

/**
 * Check if keyboard shortcuts are enabled
 */
export function areShortcutsEnabled(): boolean {
  try {
    const stored = localStorage.getItem('keyboardShortcutsEnabled');
    return stored !== 'false'; // Enabled by default
  } catch {
    return true;
  }
}

/**
 * Toggle keyboard shortcuts
 */
export function setShortcutsEnabled(enabled: boolean): void {
  localStorage.setItem('keyboardShortcutsEnabled', String(enabled));
  
  if (enabled) {
    initKeyboardShortcuts();
  } else {
    cleanupKeyboardShortcuts();
  }
}

/**
 * Show keyboard shortcuts help overlay content
 */
export function getShortcutsHelpContent(): string {
  let content = '⌨️ KEYBOARD SHORTCUTS\n\n';
  
  for (const category of getShortcutCategories()) {
    content += `${getCategoryLabel(category)}\n`;
    content += '─'.repeat(30) + '\n';
    
    for (const shortcut of getShortcutsByCategory(category)) {
      content += `${formatShortcut(shortcut).padEnd(15)} ${shortcut.description}\n`;
    }
    content += '\n';
  }
  
  return content;
}
