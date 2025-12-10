/**
 * Social Sharing Service
 * Share recipes with caregivers, family members, or friends
 */

import type { Recipe } from '../types';

export interface ShareableRecipe {
  recipe: Recipe;
  sharedBy: string;
  message?: string;
  sharedAt: string;
}

/**
 * Generate a shareable URL for a recipe
 * Uses base64 encoding to embed recipe data in URL
 */
export function generateShareableLink(recipe: Recipe, message?: string): string {
  try {
    // Create a minimal version of the recipe to keep URL shorter
    const shareData: ShareableRecipe = {
      recipe: {
        title: recipe.title,
        servings: recipe.servings,
        prepTimeMinutes: recipe.prepTimeMinutes,
        cookTimeMinutes: recipe.cookTimeMinutes,
        ingredients: recipe.ingredients,
        equipment: recipe.equipment,
        steps: recipe.steps,
        tips: recipe.tips,
      },
      sharedBy: 'A friend',
      message,
      sharedAt: new Date().toISOString(),
    };

    // Encode as base64
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    
    // Create URL with hash
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#share=${encoded}`;
  } catch (error) {
    console.error('Failed to generate shareable link:', error);
    return '';
  }
}

/**
 * Parse a shared recipe from URL
 */
export function parseSharedRecipe(url: string): ShareableRecipe | null {
  try {
    const hash = url.split('#share=')[1];
    if (!hash) return null;

    const decoded = decodeURIComponent(atob(hash));
    return JSON.parse(decoded) as ShareableRecipe;
  } catch (error) {
    console.error('Failed to parse shared recipe:', error);
    return null;
  }
}

/**
 * Check if current URL contains a shared recipe
 */
export function hasSharedRecipe(): boolean {
  return window.location.hash.startsWith('#share=');
}

/**
 * Get shared recipe from current URL
 */
export function getSharedRecipeFromUrl(): ShareableRecipe | null {
  if (!hasSharedRecipe()) return null;
  return parseSharedRecipe(window.location.href);
}

/**
 * Share via Web Share API (mobile-friendly)
 */
export async function shareViaWebShare(recipe: Recipe, message?: string): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    const shareUrl = generateShareableLink(recipe, message);
    
    await navigator.share({
      title: `Recipe: ${recipe.title}`,
      text: message || `Check out this recipe for ${recipe.title}!`,
      url: shareUrl,
    });
    
    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.log('Share cancelled or failed:', error);
    return false;
  }
}

/**
 * Copy recipe link to clipboard
 */
export async function copyRecipeLink(recipe: Recipe, message?: string): Promise<boolean> {
  try {
    const shareUrl = generateShareableLink(recipe, message);
    await navigator.clipboard.writeText(shareUrl);
    return true;
  } catch (error) {
    console.error('Failed to copy link:', error);
    return false;
  }
}

/**
 * Generate email share link
 */
export function generateEmailShareLink(recipe: Recipe, message?: string): string {
  const subject = encodeURIComponent(`Recipe: ${recipe.title}`);
  const shareUrl = generateShareableLink(recipe, message);
  const body = encodeURIComponent(
    `${message || 'Check out this recipe!'}\n\n` +
    `Recipe: ${recipe.title}\n` +
    `Servings: ${recipe.servings}\n` +
    `Prep Time: ${recipe.prepTimeMinutes} minutes\n` +
    `Cook Time: ${recipe.cookTimeMinutes} minutes\n\n` +
    `Open the recipe here:\n${shareUrl}`
  );
  
  return `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Generate SMS share link (mobile)
 */
export function generateSmsShareLink(recipe: Recipe, message?: string): string {
  const shareUrl = generateShareableLink(recipe, message);
  const text = encodeURIComponent(
    `${message || 'Check out this recipe!'}\n${recipe.title}\n${shareUrl}`
  );
  
  return `sms:?body=${text}`;
}

/**
 * Generate WhatsApp share link
 */
export function generateWhatsAppShareLink(recipe: Recipe, message?: string): string {
  const shareUrl = generateShareableLink(recipe, message);
  const text = encodeURIComponent(
    `${message || 'Check out this recipe!'}\n\n` +
    `🍳 *${recipe.title}*\n` +
    `⏱️ ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} minutes total\n` +
    `🍽️ ${recipe.servings} servings\n\n` +
    `Open the full recipe:\n${shareUrl}`
  );
  
  return `https://wa.me/?text=${text}`;
}

/**
 * Generate recipe as printable text
 */
export function generatePrintableRecipe(recipe: Recipe): string {
  let text = '';
  
  text += `═══════════════════════════════════════\n`;
  text += `    ${recipe.title.toUpperCase()}\n`;
  text += `═══════════════════════════════════════\n\n`;
  
  text += `Servings: ${recipe.servings}\n`;
  text += `Prep Time: ${recipe.prepTimeMinutes} minutes\n`;
  text += `Cook Time: ${recipe.cookTimeMinutes} minutes\n`;
  text += `Total Time: ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} minutes\n\n`;
  
  text += `───────────────────────────────────────\n`;
  text += `INGREDIENTS\n`;
  text += `───────────────────────────────────────\n`;
  recipe.ingredients.forEach(ing => {
    text += `• ${ing.amount} ${ing.name}`;
    if (ing.note) text += ` (${ing.note})`;
    text += '\n';
  });
  text += '\n';
  
  if (recipe.equipment && recipe.equipment.length > 0) {
    text += `───────────────────────────────────────\n`;
    text += `EQUIPMENT\n`;
    text += `───────────────────────────────────────\n`;
    recipe.equipment.forEach(eq => {
      text += `• ${eq}\n`;
    });
    text += '\n';
  }
  
  text += `───────────────────────────────────────\n`;
  text += `INSTRUCTIONS\n`;
  text += `───────────────────────────────────────\n`;
  recipe.steps.forEach((step, i) => {
    text += `${i + 1}. ${step.instruction}\n\n`;
  });
  
  if (recipe.tips && recipe.tips.length > 0) {
    text += `───────────────────────────────────────\n`;
    text += `TIPS\n`;
    text += `───────────────────────────────────────\n`;
    recipe.tips.forEach(tip => {
      text += `💡 ${tip}\n`;
    });
  }
  
  return text;
}

/**
 * Export recipe as JSON file
 */
export function exportRecipeAsJson(recipe: Recipe): void {
  const dataStr = JSON.stringify(recipe, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Check if Web Share API is available
 */
export function isWebShareSupported(): boolean {
  return !!navigator.share;
}

/**
 * Share options for display
 */
export interface ShareOption {
  id: string;
  label: string;
  icon: string;
  action: (recipe: Recipe, message?: string) => void | Promise<void> | Promise<boolean>;
}

export function getShareOptions(): ShareOption[] {
  const options: ShareOption[] = [];

  // Native share (if available)
  if (isWebShareSupported()) {
    options.push({
      id: 'native',
      label: 'Share',
      icon: '📤',
      action: (recipe, message) => shareViaWebShare(recipe, message),
    });
  }

  // Copy link (always available)
  options.push({
    id: 'copy',
    label: 'Copy Link',
    icon: '📋',
    action: (recipe, message) => copyRecipeLink(recipe, message),
  });

  // Email
  options.push({
    id: 'email',
    label: 'Email',
    icon: '📧',
    action: (recipe, message) => {
      window.location.href = generateEmailShareLink(recipe, message);
    },
  });

  // SMS (mobile)
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    options.push({
      id: 'sms',
      label: 'Text Message',
      icon: '💬',
      action: (recipe, message) => {
        window.location.href = generateSmsShareLink(recipe, message);
      },
    });
  }

  // WhatsApp
  options.push({
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: '📱',
    action: (recipe, message) => {
      window.open(generateWhatsAppShareLink(recipe, message), '_blank');
    },
  });

  // Print
  options.push({
    id: 'print',
    label: 'Print',
    icon: '🖨️',
    action: () => window.print(),
  });

  return options;
}
