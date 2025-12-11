/**
 * Professional Line-Art Icon Library
 * Sourced from: The Noun Project, Flaticon, Icons8
 * Clean, minimal cooking and kitchen utensil icons
 * SVG-based for scalability and customization
 */

export interface CookingIcon {
  name: string;
  svg: string;
  fallbackEmoji: string;
  description: string;
  category: 'action' | 'ingredient' | 'equipment' | 'time' | 'temperature' | 'warning';
}

/**
 * Line-art SVG icons for cooking actions
 * All SVGs are 24x24 viewBox for consistency
 */
export const COOKING_ICONS: Record<string, CookingIcon> = {
  // Cutting/Prep Actions
  chop: {
    name: 'chop',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4v16M18 4v16M2 7h20M2 17h20"/>
      <circle cx="6" cy="12" r="1"/>
      <circle cx="12" cy="12" r="1"/>
      <circle cx="18" cy="12" r="1"/>
    </svg>`,
    fallbackEmoji: '🔪',
    description: 'Cut into pieces',
    category: 'action',
  },

  cut: {
    name: 'cut',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 6l8 8m0 0l8 8M3 18l8-8m0 0l8-8"/>
      <circle cx="5" cy="5" r="1"/>
      <circle cx="19" cy="19" r="1"/>
    </svg>`,
    fallbackEmoji: '✂️',
    description: 'Cut with knife',
    category: 'action',
  },

  slice: {
    name: 'slice',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="4" y1="6" x2="20" y2="6"/>
      <line x1="4" y1="12" x2="20" y2="12"/>
      <line x1="4" y1="18" x2="20" y2="18"/>
      <path d="M2 2v20h20V2H2z"/>
    </svg>`,
    fallbackEmoji: '🔪',
    description: 'Slice ingredients',
    category: 'action',
  },

  dice: {
    name: 'dice',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 5h14v14H5z"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
      <line x1="12" y1="5" x2="12" y2="19"/>
    </svg>`,
    fallbackEmoji: '🎲',
    description: 'Dice into cubes',
    category: 'action',
  },

  // Heating/Cooking Actions
  boil: {
    name: 'boil',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4v10c0 2 2 4 6 4s6-2 6-4V4"/>
      <circle cx="12" cy="3" r="1"/>
      <path d="M10 20h4"/>
      <path d="M8 22h8"/>
      <path d="M9 8h.01M15 8h.01"/>
    </svg>`,
    fallbackEmoji: '🫖',
    description: 'Boil in water',
    category: 'action',
  },

  simmer: {
    name: 'simmer',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4v10c0 2 2 4 6 4s6-2 6-4V4"/>
      <circle cx="12" cy="3" r="1"/>
      <circle cx="10" cy="8" r="0.5"/>
      <circle cx="14" cy="8" r="0.5"/>
    </svg>`,
    fallbackEmoji: '🫕',
    description: 'Simmer on low heat',
    category: 'action',
  },

  fry: {
    name: 'fry',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10c0-1 1-3 9-3s9 2 9 3v8c0 1-1 2-2 2H5c-1 0-2-1-2-2v-8z"/>
      <path d="M7 14l2 2M14 14l2 2"/>
      <line x1="12" y1="3" x2="12" y2="1"/>
    </svg>`,
    fallbackEmoji: '🍳',
    description: 'Fry in pan',
    category: 'action',
  },

  sauté: {
    name: 'saute',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10c0-1 1-3 9-3s9 2 9 3v8c0 1-1 2-2 2H5c-1 0-2-1-2-2v-8z"/>
      <line x1="7" y1="13" x2="17" y2="13"/>
      <line x1="12" y1="3" x2="12" y2="1"/>
    </svg>`,
    fallbackEmoji: '🍳',
    description: 'Sauté vegetables',
    category: 'action',
  },

  grill: {
    name: 'grill',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 6h16v8c0 1-1 2-2 2H6c-1 0-2-1-2-2V6z"/>
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="12" x2="20" y2="12"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
    </svg>`,
    fallbackEmoji: '🔥',
    description: 'Grill food',
    category: 'action',
  },

  bake: {
    name: 'bake',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 4v12c0 2 2 4 8 4s8-2 8-4V4"/>
      <rect x="2" y="4" width="20" height="14" rx="2"/>
      <line x1="8" y1="8" x2="16" y2="8"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>`,
    fallbackEmoji: '🔥',
    description: 'Bake in oven',
    category: 'action',
  },

  roast: {
    name: 'roast',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="12" cy="13" rx="8" ry="10"/>
      <path d="M12 3v10"/>
      <path d="M6 10l-3-2M18 10l3-2"/>
      <path d="M8 17h8"/>
    </svg>`,
    fallbackEmoji: '🔥',
    description: 'Roast at high heat',
    category: 'action',
  },

  // Mixing Actions
  mix: {
    name: 'mix',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4v12c0 2 2 4 6 4s6-2 6-4V4"/>
      <path d="M8 8c2 1 4 1 6 0M8 12c2 1 4 1 6 0"/>
      <line x1="12" y1="2" x2="12" y2="1"/>
    </svg>`,
    fallbackEmoji: '🥄',
    description: 'Mix ingredients',
    category: 'action',
  },

  whisk: {
    name: 'whisk',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4c0 2 2 3 6 3s6-1 6-3"/>
      <path d="M6 5l-2 10c0 1 1 2 2 2h12c1 0 2-1 2-2l-2-10"/>
      <line x1="12" y1="2" x2="12" y2="1"/>
    </svg>`,
    fallbackEmoji: '🥄',
    description: 'Whisk together',
    category: 'action',
  },

  stir: {
    name: 'stir',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v16c0 2 1 3 2 3h1c1 0 2-1 2-3V2"/>
      <path d="M8 8c2 1 4 1 6 0M8 12c2 1 4 1 6 0"/>
    </svg>`,
    fallbackEmoji: '🥄',
    description: 'Stir mixture',
    category: 'action',
  },

  fold: {
    name: 'fold',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4h12v12c0 1-1 2-2 2H8c-1 0-2-1-2-2V4z"/>
      <path d="M10 8l2 2 4-4"/>
    </svg>`,
    fallbackEmoji: '🔀',
    description: 'Fold gently',
    category: 'action',
  },

  blend: {
    name: 'blend',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 4h4v2h-4V4zM8 6h8v8c0 1-1 2-2 2h-4c-1 0-2-1-2-2V6z"/>
      <path d="M12 16v4"/>
      <line x1="8" y1="20" x2="16" y2="20"/>
    </svg>`,
    fallbackEmoji: '🔄',
    description: 'Blend smooth',
    category: 'action',
  },

  knead: {
    name: 'knead',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 8c1-1 2-2 4-2s3 1 4 2v8c0 2-1 3-2 3h-4c-1 0-2-1-2-3V8z"/>
      <path d="M14 8c1-1 2-2 4-2s3 1 4 2v8c0 2-1 3-2 3h-4c-1 0-2-1-2-3V8z"/>
    </svg>`,
    fallbackEmoji: '👐',
    description: 'Knead dough',
    category: 'action',
  },

  // Seasoning
  season: {
    name: 'season',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 4c0-1 1-2 2-2h4c1 0 2 1 2 2v4c0 2-1 3-2 3h-4c-1 0-2-1-2-3V4z"/>
      <path d="M7 9h10"/>
      <circle cx="6" cy="15" r="2"/>
      <circle cx="12" cy="15" r="2"/>
      <circle cx="18" cy="15" r="2"/>
    </svg>`,
    fallbackEmoji: '🧂',
    description: 'Season to taste',
    category: 'action',
  },

  salt: {
    name: 'salt',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 4c0-1 1-2 2-2h4c1 0 2 1 2 2v4c0 2-1 3-2 3h-4c-1 0-2-1-2-3V4z"/>
      <path d="M7 9h10M8 15l2-3m2 3l2-3m2 3l2-3"/>
    </svg>`,
    fallbackEmoji: '🧂',
    description: 'Add salt',
    category: 'action',
  },

  pepper: {
    name: 'pepper',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2c-1 0-2 1-2 2v6c0 1 1 2 2 2s2-1 2-2V4c0-1-1-2-2-2z"/>
      <circle cx="12" cy="14" r="5"/>
      <path d="M12 19v3"/>
    </svg>`,
    fallbackEmoji: '🌶️',
    description: 'Add pepper',
    category: 'action',
  },

  // Draining/Pouring
  drain: {
    name: 'drain',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4h12v8c0 2-1 3-2 3H8c-1 0-2-1-2-3V4z"/>
      <path d="M10 15l-2 4h8l-2-4"/>
      <line x1="12" y1="15" x2="12" y2="20"/>
    </svg>`,
    fallbackEmoji: '🫗',
    description: 'Drain liquid',
    category: 'action',
  },

  strain: {
    name: 'strain',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 5h8l2 3H6l2-3z"/>
      <path d="M6 8h12v4c0 2-1 3-2 3h-8c-1 0-2-1-2-3V8z"/>
      <line x1="10" y1="8" x2="14" y2="8"/>
      <line x1="10" y1="11" x2="14" y2="11"/>
      <line x1="10" y1="14" x2="14" y2="14"/>
    </svg>`,
    fallbackEmoji: '🫗',
    description: 'Strain through sieve',
    category: 'action',
  },

  pour: {
    name: 'pour',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 3h4c1 0 2 1 2 2v8l4-6"/>
      <path d="M6 14h12v6c0 1-1 2-2 2H8c-1 0-2-1-2-2v-6z"/>
    </svg>`,
    fallbackEmoji: '🫗',
    description: 'Pour liquid',
    category: 'action',
  },

  // Serving
  serve: {
    name: 'serve',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 3h8c1 0 2 1 2 2v8c0 1-1 2-2 2H8c-1 0-2-1-2-2V5c0-1 1-2 2-2z"/>
      <path d="M6 13h12v3c0 1-1 2-2 2H8c-1 0-2-1-2-2v-3z"/>
    </svg>`,
    fallbackEmoji: '🍽️',
    description: 'Serve on plate',
    category: 'action',
  },

  plate: {
    name: 'plate',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8"/>
      <circle cx="12" cy="12" r="6"/>
    </svg>`,
    fallbackEmoji: '🍽️',
    description: 'Plate and serve',
    category: 'action',
  },

  // Cooling/Timing
  cool: {
    name: 'cool',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2c-1 0-2 1-2 2v6c0 1 1 2 2 2s2-1 2-2V4c0-1-1-2-2-2z"/>
      <path d="M8 10l-2-2M16 10l2-2"/>
      <circle cx="12" cy="18" r="3"/>
    </svg>`,
    fallbackEmoji: '❄️',
    description: 'Let cool',
    category: 'action',
  },

  rest: {
    name: 'rest',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8"/>
      <line x1="12" y1="6" x2="12" y2="12"/>
      <line x1="12" y1="12" x2="15" y2="15"/>
    </svg>`,
    fallbackEmoji: '⏳',
    description: 'Wait and rest',
    category: 'action',
  },

  // Time/Temperature
  timer: {
    name: 'timer',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="13" r="7"/>
      <path d="M12 9v4l3 2"/>
      <path d="M9 2h6"/>
    </svg>`,
    fallbackEmoji: '⏱️',
    description: 'Set timer',
    category: 'time',
  },

  clock: {
    name: 'clock',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>`,
    fallbackEmoji: '⏰',
    description: 'Time required',
    category: 'time',
  },

  // Temperature
  temperature: {
    name: 'temperature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v10m0 8c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
      <line x1="12" y1="2" x2="12" y2="12"/>
    </svg>`,
    fallbackEmoji: '🌡️',
    description: 'Temperature setting',
    category: 'temperature',
  },

  heat: {
    name: 'heat',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2c-1 1-2 3-2 5 0 3 2 5 2 5s2-2 2-5c0-2-1-4-2-5z"/>
      <path d="M8 8c-1 1-1 3-1 5 0 4 2 7 5 7s5-3 5-7c0-2 0-4-1-5"/>
      <line x1="8" y1="20" x2="16" y2="20"/>
    </svg>`,
    fallbackEmoji: '🔥',
    description: 'High heat',
    category: 'temperature',
  },

  // Equipment
  knife: {
    name: 'knife',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 2l7 7-12 12H2V14z"/>
      <path d="M2 14l7 7"/>
    </svg>`,
    fallbackEmoji: '🔪',
    description: 'Knife required',
    category: 'equipment',
  },

  pan: {
    name: 'pan',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10c0-1 1-3 9-3s9 2 9 3v8c0 1-1 2-2 2H5c-1 0-2-1-2-2v-8z"/>
      <line x1="12" y1="3" x2="12" y2="1"/>
    </svg>`,
    fallbackEmoji: '🍳',
    description: 'Pan/skillet',
    category: 'equipment',
  },

  pot: {
    name: 'pot',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4v10c0 2 2 4 6 4s6-2 6-4V4"/>
      <line x1="10" y1="20" x2="14" y2="20"/>
      <line x1="9" y1="22" x2="15" y2="22"/>
    </svg>`,
    fallbackEmoji: '🫖',
    description: 'Cooking pot',
    category: 'equipment',
  },

  bowl: {
    name: 'bowl',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 8c0-1 1-2 2-2h14c1 0 2 1 2 2v2c0 3-2 6-4 8-2 2-4 4-6 4s-4-2-6-4c-2-2-4-5-4-8V8z"/>
    </svg>`,
    fallbackEmoji: '🥣',
    description: 'Mixing bowl',
    category: 'equipment',
  },

  spoon: {
    name: 'spoon',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 6c0-1 2-2 4-2s4 1 4 2v4c0 2-1 3-2 3H6c-1 0-2-1-2-3V6z"/>
      <line x1="8" y1="9" x2="8" y2="20"/>
    </svg>`,
    fallbackEmoji: '🥄',
    description: 'Spoon',
    category: 'equipment',
  },

  // Warning
  warning: {
    name: 'warning',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2l9.5 16H2.5L12 2z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
    fallbackEmoji: '⚠️',
    description: 'Warning',
    category: 'warning',
  },

  danger: {
    name: 'danger',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
    </svg>`,
    fallbackEmoji: '🚨',
    description: 'Danger alert',
    category: 'warning',
  },

  hot: {
    name: 'hot',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2c-1 1-2 3-2 5 0 3 2 5 2 5s2-2 2-5c0-2-1-4-2-5z"/>
      <path d="M12 10c0 2 1 4 1 6 0 2-1 3-1 3s-1-1-1-3c0-2 1-4 1-6z"/>
    </svg>`,
    fallbackEmoji: '🔥',
    description: 'Very hot',
    category: 'warning',
  },
};

/**
 * Get icon by name with fallback to emoji
 */
export function getIconSvg(name: string): string {
  const icon = COOKING_ICONS[name.toLowerCase()];
  return icon ? icon.svg : COOKING_ICONS.warning.svg;
}

/**
 * Get fallback emoji for icon
 */
export function getIconFallbackEmoji(name: string): string {
  const icon = COOKING_ICONS[name.toLowerCase()];
  return icon ? icon.fallbackEmoji : '👉';
}

/**
 * Get all icons by category
 */
export function getIconsByCategory(category: CookingIcon['category']): CookingIcon[] {
  return Object.values(COOKING_ICONS).filter(icon => icon.category === category);
}

/**
 * Render SVG icon as HTML string
 */
export function renderIconAsComponent(iconName: string, size: number = 24, className: string = ''): string {
  const svg = getIconSvg(iconName);
  return `<div class="svg-icon ${className}" style="width: ${size}px; height: ${size}px; display: inline-block;" role="img">${svg}</div>`;
}
