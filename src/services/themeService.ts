/**
 * Theme Service
 * Manages light, dark, and high-contrast themes for accessibility
 */

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

const THEME_STORAGE_KEY = 'recipe_app_theme';

/**
 * Get saved theme preference or default to light
 */
export function getSavedTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'high-contrast') {
      return saved;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

/**
 * Save theme preference
 */
export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme preference:', error);
  }
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  
  // Remove all theme classes
  root.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
  
  // Add new theme class
  root.classList.add(`theme-${theme}`);
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    switch (theme) {
      case 'dark':
        metaThemeColor.setAttribute('content', '#1a1a2e');
        break;
      case 'high-contrast':
        metaThemeColor.setAttribute('content', '#000000');
        break;
      default:
        metaThemeColor.setAttribute('content', '#ffffff');
    }
  }
}

/**
 * Get next theme in cycle
 */
export function getNextTheme(current: ThemeMode): ThemeMode {
  const themes: ThemeMode[] = ['light', 'dark', 'high-contrast'];
  const currentIndex = themes.indexOf(current);
  return themes[(currentIndex + 1) % themes.length];
}

/**
 * Theme display info
 */
export const THEME_INFO: Record<ThemeMode, { icon: string; label: string; description: string }> = {
  'light': {
    icon: '☀️',
    label: 'Light Mode',
    description: 'Bright background, easy to read in daylight'
  },
  'dark': {
    icon: '🌙',
    label: 'Dark Mode',
    description: 'Dark background, easier on eyes at night'
  },
  'high-contrast': {
    icon: '👁️',
    label: 'High Contrast',
    description: 'Maximum contrast for visual impairments'
  }
};

/**
 * Initialize theme on app load
 */
export function initializeTheme(): ThemeMode {
  const theme = getSavedTheme();
  applyTheme(theme);
  return theme;
}
