/**
 * Icon System Utilities
 * Helper functions for working with cooking icons throughout the app
 */

import { COOKING_ICONS, CookingIcon, getIconSvg, getIconFallbackEmoji } from './iconLibrary';

/**
 * Get icon for a specific cooking step based on instruction text
 * Returns both SVG and fallback emoji for maximum compatibility
 */
export function getStepIcon(instruction: string): {
  svg: string;
  emoji: string;
  description: string;
  iconName: string;
} {
  const instruction_lower = instruction.toLowerCase();

  // Cutting/prep
  if (/chop|cut|slice|dice|mince|shred/i.test(instruction_lower)) {
    return {
      svg: getIconSvg('chop'),
      emoji: '🔪',
      description: 'Cut the ingredients',
      iconName: 'chop',
    };
  }

  // Boiling/heating
  if (/boil|heat|simmer|bubble/i.test(instruction_lower)) {
    return {
      svg: getIconSvg('boil'),
      emoji: '🫖',
      description: 'Heat the liquid',
      iconName: 'boil',
    };
  }

  // Frying/pan cooking
  if (/fry|sauté|saute|pan|skillet|stir/i.test(instruction_lower)) {
    return {
      svg: getIconSvg('fry'),
      emoji: '🍳',
      description: 'Cook in a pan',
      iconName: 'fry',
    };
  }

  // Baking/roasting/oven
  if (/bake|roast|oven|baked|roasted|baking/i.test(instruction_lower)) {
    return {
      svg: getIconSvg('bake'),
      emoji: '🔥',
      description: 'Bake in oven',
      iconName: 'bake',
    };
  }

  // Mixing/combining
  if (/mix|combine|whisk|beat|blend|fold|stir together/i.test(instruction_lower)) {
    return {
      svg: getIconSvg('mix'),
      emoji: '🥄',
      description: 'Mix ingredients',
      iconName: 'mix',
    };
  }

  // Seasoning
  if (/season|salt|pepper|spice|garnish/i.test(instruction_lower)) {
    return {
      svg: getIconSvg('season'),
      emoji: '🧂',
      description: 'Add seasonings',
      iconName: 'season',
    };
  }

  // Draining/straining
  if (/drain|strain|strain|rinse|pour off/i.test(instruction_lower)) {
    return {
      svg: getIconSvg('drain'),
      emoji: '🫗',
      description: 'Drain liquid',
      iconName: 'drain',
    };
  }

  // Serving/plating
  if (/serve|plate|arrange|present|dish|plated/i.test(instruction_lower)) {
    return {
      svg: getIconSvg('serve'),
      emoji: '🍽️',
      description: 'Serve and plate',
      iconName: 'serve',
    };
  }

  // Cooling/resting
  if (/cool|chill|rest|let sit|wait|cool down/i.test(instruction_lower)) {
    return {
      svg: getIconSvg('cool'),
      emoji: '❄️',
      description: 'Let cool',
      iconName: 'cool',
    };
  }

  // Default fallback
  return {
    svg: getIconSvg('warning'),
    emoji: '👉',
    description: 'Follow step',
    iconName: 'warning',
  };
}

/**
 * Get icon for an ingredient category
 */
export function getIngredientIcon(ingredientName: string): {
  svg: string;
  emoji: string;
  iconName: string;
} {
  const name = ingredientName.toLowerCase();

  // Proteins
  if (/chicken|beef|pork|fish|shrimp|tofu|meat|protein/i.test(name)) {
    return { svg: getIconSvg('knife'), emoji: '🥩', iconName: 'knife' };
  }

  // Vegetables
  if (/vegetable|broccoli|carrot|onion|garlic|spinach|pepper|tomato/i.test(name)) {
    return { svg: getIconSvg('chop'), emoji: '🥦', iconName: 'chop' };
  }

  // Grains/pasta
  if (/rice|pasta|bread|grain|flour|wheat|oat/i.test(name)) {
    return { svg: getIconSvg('bowl'), emoji: '🌾', iconName: 'bowl' };
  }

  // Dairy
  if (/milk|cheese|butter|yogurt|cream/i.test(name)) {
    return { svg: getIconSvg('pot'), emoji: '🥛', iconName: 'pot' };
  }

  // Seasonings
  if (/salt|pepper|spice|garlic|herb|seasoning/i.test(name)) {
    return { svg: getIconSvg('season'), emoji: '🧂', iconName: 'season' };
  }

  // Oils/liquids
  if (/oil|vinegar|sauce|liquid|broth|stock/i.test(name)) {
    return { svg: getIconSvg('pour'), emoji: '🫗', iconName: 'pour' };
  }

  // Default
  return { svg: getIconSvg('bowl'), emoji: '🥘', iconName: 'bowl' };
}

/**
 * Get icon for equipment/tools
 */
export function getEquipmentIcon(equipmentName: string): {
  svg: string;
  emoji: string;
  iconName: string;
} {
  const name = equipmentName.toLowerCase();

  if (/knife|blade|sharp/i.test(name)) {
    return { svg: getIconSvg('knife'), emoji: '🔪', iconName: 'knife' };
  }

  if (/pan|skillet|fry/i.test(name)) {
    return { svg: getIconSvg('pan'), emoji: '🍳', iconName: 'pan' };
  }

  if (/pot|dutch/i.test(name)) {
    return { svg: getIconSvg('pot'), emoji: '🫖', iconName: 'pot' };
  }

  if (/bowl|mixing|whisk|beat/i.test(name)) {
    return { svg: getIconSvg('bowl'), emoji: '🥣', iconName: 'bowl' };
  }

  if (/spoon|ladle|scoop|utensil/i.test(name)) {
    return { svg: getIconSvg('spoon'), emoji: '🥄', iconName: 'spoon' };
  }

  return { svg: getIconSvg('bowl'), emoji: '🔧', iconName: 'bowl' };
}

/**
 * Get timing icon
 */
export function getTimingIcon(timeType: 'prep' | 'cook' | 'rest' | 'total'): {
  svg: string;
  emoji: string;
  iconName: string;
  label: string;
} {
  switch (timeType) {
    case 'prep':
      return { svg: getIconSvg('chop'), emoji: '🔪', iconName: 'chop', label: 'Prep Time' };
    case 'cook':
      return { svg: getIconSvg('timer'), emoji: '⏱️', iconName: 'timer', label: 'Cook Time' };
    case 'rest':
      return { svg: getIconSvg('rest'), emoji: '⏳', iconName: 'rest', label: 'Rest Time' };
    case 'total':
      return { svg: getIconSvg('clock'), emoji: '⏰', iconName: 'clock', label: 'Total Time' };
  }
}

/**
 * Get warning/safety icon
 */
export function getSafetyIcon(warningType: 'hot' | 'sharp' | 'heavy' | 'burn' | 'generic'): {
  svg: string;
  emoji: string;
  iconName: string;
  label: string;
  severity: 'warning' | 'danger';
} {
  switch (warningType) {
    case 'hot':
      return {
        svg: getIconSvg('hot'),
        emoji: '🔥',
        iconName: 'hot',
        label: 'Hot surface',
        severity: 'danger',
      };
    case 'sharp':
      return {
        svg: getIconSvg('knife'),
        emoji: '🔪',
        iconName: 'knife',
        label: 'Sharp objects',
        severity: 'warning',
      };
    case 'heavy':
      return {
        svg: getIconSvg('warning'),
        emoji: '⚠️',
        iconName: 'warning',
        label: 'Heavy item',
        severity: 'warning',
      };
    case 'burn':
      return {
        svg: getIconSvg('danger'),
        emoji: '🚨',
        iconName: 'danger',
        label: 'Burn hazard',
        severity: 'danger',
      };
    default:
      return {
        svg: getIconSvg('warning'),
        emoji: '⚠️',
        iconName: 'warning',
        label: 'Caution',
        severity: 'warning',
      };
  }
}

/**
 * Get all icons in a category with descriptions
 */
export function getIconsInCategory(category: 'action' | 'ingredient' | 'equipment' | 'time' | 'temperature' | 'warning'): CookingIcon[] {
  return Object.values(COOKING_ICONS).filter(icon => icon.category === category);
}

/**
 * Search for icons by partial name
 */
export function searchIcons(query: string): CookingIcon[] {
  const q = query.toLowerCase();
  return Object.values(COOKING_ICONS).filter(
    icon =>
      icon.name.includes(q) ||
      icon.description.toLowerCase().includes(q) ||
      icon.category.includes(q)
  );
}

/**
 * Validate icon name exists
 */
export function isValidIconName(name: string): boolean {
  return name.toLowerCase() in COOKING_ICONS;
}

/**
 * Get random icon from category (useful for onboarding, achievements)
 */
export function getRandomIcon(category?: 'action' | 'ingredient' | 'equipment' | 'time' | 'temperature' | 'warning'): CookingIcon {
  const icons = category
    ? Object.values(COOKING_ICONS).filter(icon => icon.category === category)
    : Object.values(COOKING_ICONS);

  return icons[Math.floor(Math.random() * icons.length)];
}

/**
 * Format icon with text for accessibility
 */
export function formatIconWithText(
  iconName: string,
  text: string,
  useEmojiFallback: boolean = false
): string {
  if (useEmojiFallback) {
    return `${getIconFallbackEmoji(iconName)} ${text}`;
  }
  return `[Icon: ${iconName}] ${text}`;
}
