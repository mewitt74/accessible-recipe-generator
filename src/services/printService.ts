/**
 * Print Service
 * Printer-friendly recipe formatting
 */

import type { Recipe, Ingredient, Step } from '../types';

export interface PrintOptions {
  includeNutrition: boolean;
  includeTimers: boolean;
  includeNotes: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  simplifiedSteps: boolean;
}

const DEFAULT_OPTIONS: PrintOptions = {
  includeNutrition: true,
  includeTimers: true,
  includeNotes: true,
  fontSize: 'large',
  highContrast: false,
  simplifiedSteps: true,
};

/**
 * Generate print-friendly HTML for a recipe
 */
export function generatePrintHTML(recipe: Recipe, options: Partial<PrintOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const fontSizes = {
    'normal': { title: '24px', body: '14px', step: '16px' },
    'large': { title: '32px', body: '18px', step: '20px' },
    'extra-large': { title: '40px', body: '22px', step: '26px' },
  };
  
  const sizes = fontSizes[opts.fontSize];
  
  const styles = `
    <style>
      @media print {
        body { margin: 0; padding: 20px; }
        .no-print { display: none !important; }
        .page-break { page-break-before: always; }
      }
      
      * {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: ${opts.highContrast ? '#000' : '#333'};
      }
      
      body {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background: ${opts.highContrast ? '#fff' : '#fff'};
      }
      
      .recipe-header {
        text-align: center;
        border-bottom: ${opts.highContrast ? '3px solid #000' : '2px solid #ddd'};
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      
      .recipe-emoji {
        font-size: 64px;
        margin-bottom: 10px;
      }
      
      .recipe-title {
        font-size: ${sizes.title};
        font-weight: bold;
        margin: 10px 0;
        ${opts.highContrast ? 'text-decoration: underline;' : ''}
      }
      
      .recipe-meta {
        font-size: ${sizes.body};
        color: ${opts.highContrast ? '#000' : '#666'};
      }
      
      .section {
        margin-bottom: 30px;
      }
      
      .section-title {
        font-size: ${sizes.step};
        font-weight: bold;
        border-bottom: ${opts.highContrast ? '2px solid #000' : '1px solid #ddd'};
        padding-bottom: 10px;
        margin-bottom: 15px;
        ${opts.highContrast ? 'background: #eee; padding: 10px;' : ''}
      }
      
      .ingredients-list {
        list-style: none;
        padding: 0;
      }
      
      .ingredient-item {
        font-size: ${sizes.body};
        padding: 8px 0;
        border-bottom: 1px dashed #ddd;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .ingredient-checkbox {
        width: 20px;
        height: 20px;
        border: 2px solid #333;
        display: inline-block;
        flex-shrink: 0;
      }
      
      .steps-list {
        list-style: none;
        padding: 0;
        counter-reset: step-counter;
      }
      
      .step-item {
        font-size: ${sizes.step};
        padding: 15px;
        margin-bottom: 15px;
        background: ${opts.highContrast ? '#f5f5f5' : '#f9f9f9'};
        border-left: ${opts.highContrast ? '6px solid #000' : '4px solid #4CAF50'};
        border-radius: 4px;
        display: flex;
        gap: 15px;
      }
      
      .step-number {
        font-size: ${sizes.title};
        font-weight: bold;
        color: ${opts.highContrast ? '#000' : '#4CAF50'};
        min-width: 50px;
        text-align: center;
      }
      
      .step-content {
        flex: 1;
      }
      
      .step-timer {
        background: ${opts.highContrast ? '#000' : '#ff9800'};
        color: #fff;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 14px;
        margin-top: 10px;
        display: inline-block;
      }
      
      .safety-tips {
        background: ${opts.highContrast ? '#fff3cd' : '#fff3cd'};
        border: 2px solid ${opts.highContrast ? '#000' : '#ffc107'};
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
      }
      
      .safety-title {
        font-weight: bold;
        color: ${opts.highContrast ? '#000' : '#856404'};
        margin-bottom: 10px;
      }
      
      .notes-section {
        border: 2px dashed #ddd;
        padding: 20px;
        margin-top: 30px;
      }
      
      .notes-lines {
        border-bottom: 1px solid #ddd;
        height: 30px;
        margin-bottom: 10px;
      }
      
      .footer {
        text-align: center;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        font-size: 12px;
        color: #999;
      }
    </style>
  `;
  
  const ingredientsList = recipe.ingredients
    .map((ing: Ingredient) => `
      <li class="ingredient-item">
        <span class="ingredient-checkbox"></span>
        <span>${ing.amount} ${ing.name}${ing.note ? ` (${ing.note})` : ''}</span>
      </li>
    `)
    .join('');
  
  const stepsList = recipe.steps
    .map((step: Step, index: number) => {
      // Extract timer if present
      const stepText = step.instruction;
      const timerMatch = stepText.match(/(\d+)\s*(minute|min|hour|hr|second|sec)/i);
      const timerHTML = opts.includeTimers && timerMatch 
        ? `<div class="step-timer">⏱️ ${timerMatch[0]}</div>`
        : '';
      
      // Simplify step if option enabled
      let displayText = stepText;
      if (opts.simplifiedSteps) {
        // Break long sentences
        displayText = stepText.replace(/\. /g, '.<br><br>');
      }
      
      return `
        <li class="step-item">
          <div class="step-number">${index + 1}</div>
          <div class="step-content">
            ${step.shortTitle ? `<strong>${step.shortTitle}:</strong> ` : ''}${displayText}
            ${timerHTML}
          </div>
        </li>
      `;
    })
    .join('');
  
  const safetyTips = recipe.tips && recipe.tips.length > 0
    ? `
      <div class="safety-tips">
        <div class="safety-title">⚠️ Safety Reminders</div>
        <ul>
          ${recipe.tips.map((tip: string) => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    `
    : '';
  
  const notesSection = opts.includeNotes
    ? `
      <div class="notes-section">
        <div class="section-title">📝 My Notes</div>
        <div class="notes-lines"></div>
        <div class="notes-lines"></div>
        <div class="notes-lines"></div>
        <div class="notes-lines"></div>
      </div>
    `
    : '';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${recipe.title} - Recipe</title>
      ${styles}
    </head>
    <body>
      <div class="recipe-header">
        <div class="recipe-emoji">🍽️</div>
        <h1 class="recipe-title">${recipe.title}</h1>
        <div class="recipe-meta">
          ⏱️ ${recipe.cookTimeMinutes} min cook time • 
          🍳 ${recipe.difficulty || 'Medium'} difficulty •
          🍽️ ${recipe.servings} servings
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">📋 Ingredients</h2>
        <ul class="ingredients-list">
          ${ingredientsList}
        </ul>
      </div>
      
      <div class="section">
        <h2 class="section-title">👩‍🍳 Steps</h2>
        <ol class="steps-list">
          ${stepsList}
        </ol>
      </div>
      
      ${safetyTips}
      ${notesSection}
      
      <div class="footer">
        Printed from Accessible Recipe Generator • ${new Date().toLocaleDateString()}
      </div>
      
      <script class="no-print">
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;
}

/**
 * Open print dialog for a recipe
 */
export function printRecipe(recipe: Recipe, options?: Partial<PrintOptions>): void {
  const html = generatePrintHTML(recipe, options);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

/**
 * Generate a simplified checklist version
 */
export function generateChecklist(recipe: Recipe): string {
  let checklist = `🍽️ ${recipe.title}\n`;
  checklist += '═'.repeat(40) + '\n\n';
  
  checklist += '📋 INGREDIENTS:\n';
  recipe.ingredients.forEach((ing: Ingredient) => {
    checklist += `☐ ${ing.amount} ${ing.name}${ing.note ? ` (${ing.note})` : ''}\n`;
  });
  
  checklist += '\n👩‍🍳 STEPS:\n';
  recipe.steps.forEach((step: Step, i: number) => {
    checklist += `${i + 1}. ☐ ${step.instruction}\n\n`;
  });
  
  return checklist;
}

/**
 * Copy checklist to clipboard
 */
export async function copyChecklistToClipboard(recipe: Recipe): Promise<boolean> {
  const checklist = generateChecklist(recipe);
  
  try {
    await navigator.clipboard.writeText(checklist);
    return true;
  } catch {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = checklist;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}

/**
 * Get print preview URL (data URL)
 */
export function getPrintPreviewDataUrl(recipe: Recipe, options?: Partial<PrintOptions>): string {
  const html = generatePrintHTML(recipe, options);
  return 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
}
