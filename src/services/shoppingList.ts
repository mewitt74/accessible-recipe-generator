/**
 * Shopping List Generator Service
 * Creates printable shopping lists from recipe ingredients
 */

import type { Recipe } from '../types';

export interface ShoppingItem {
  name: string;
  amount: string;
  category: string;
  checked: boolean;
}

// Common grocery store categories/aisles
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Produce': ['lettuce', 'tomato', 'onion', 'garlic', 'pepper', 'carrot', 'celery', 'potato', 'apple', 'banana', 'lemon', 'lime', 'orange', 'vegetable', 'fruit', 'herb', 'cilantro', 'parsley', 'basil', 'spinach', 'kale', 'broccoli', 'cucumber', 'avocado'],
  'Meat & Seafood': ['chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'bacon', 'sausage', 'turkey', 'ham', 'steak', 'ground', 'meat'],
  'Dairy & Eggs': ['milk', 'cheese', 'butter', 'egg', 'yogurt', 'cream', 'sour cream', 'cottage', 'cheddar', 'mozzarella', 'parmesan'],
  'Bread & Bakery': ['bread', 'roll', 'bun', 'tortilla', 'bagel', 'croissant', 'muffin', 'pita'],
  'Canned Goods': ['canned', 'tomato sauce', 'beans', 'soup', 'broth', 'stock', 'paste'],
  'Pasta & Rice': ['pasta', 'spaghetti', 'noodle', 'rice', 'macaroni', 'penne', 'linguine', 'orzo'],
  'Condiments': ['ketchup', 'mustard', 'mayonnaise', 'mayo', 'soy sauce', 'vinegar', 'oil', 'olive oil', 'dressing', 'sauce', 'salsa', 'hot sauce'],
  'Spices': ['salt', 'pepper', 'spice', 'seasoning', 'oregano', 'thyme', 'cumin', 'paprika', 'cinnamon', 'nutmeg', 'bay leaf'],
  'Frozen': ['frozen', 'ice cream'],
  'Beverages': ['water', 'juice', 'soda', 'coffee', 'tea'],
  'Other': []
};

/**
 * Determine the category/aisle for an ingredient
 */
function categorizeIngredient(ingredientName: string): string {
  const lower = ingredientName.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'Other';
}

/**
 * Generate a shopping list from a recipe
 */
export function generateShoppingList(recipe: Recipe): ShoppingItem[] {
  const items: ShoppingItem[] = [];
  
  for (const ingredient of recipe.ingredients) {
    items.push({
      name: ingredient.name,
      amount: ingredient.amount || '',
      category: categorizeIngredient(ingredient.name),
      checked: false
    });
  }
  
  // Sort by category for easier shopping
  items.sort((a, b) => {
    const categoryOrder = Object.keys(CATEGORY_KEYWORDS);
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);
    return aIndex - bIndex;
  });
  
  return items;
}

/**
 * Group shopping items by category
 */
export function groupByCategory(items: ShoppingItem[]): Map<string, ShoppingItem[]> {
  const grouped = new Map<string, ShoppingItem[]>();
  
  for (const item of items) {
    if (!grouped.has(item.category)) {
      grouped.set(item.category, []);
    }
    grouped.get(item.category)!.push(item);
  }
  
  return grouped;
}

/**
 * Generate printable HTML for shopping list
 */
export function generatePrintableList(recipe: Recipe): string {
  const items = generateShoppingList(recipe);
  const grouped = groupByCategory(items);
  
  let html = `
    <html>
    <head>
      <title>Shopping List - ${recipe.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 18px;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #7fb539;
          font-size: 28px;
          border-bottom: 3px solid #7fb539;
          padding-bottom: 10px;
        }
        h2 {
          color: #333;
          font-size: 22px;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        .item {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px dashed #ddd;
        }
        .checkbox {
          width: 28px;
          height: 28px;
          border: 2px solid #7fb539;
          border-radius: 4px;
          margin-right: 16px;
          flex-shrink: 0;
        }
        .amount {
          font-weight: bold;
          color: #7fb539;
          min-width: 100px;
        }
        .name {
          flex: 1;
        }
        @media print {
          body { font-size: 16px; }
          h1 { font-size: 24px; }
          h2 { font-size: 18px; }
        }
      </style>
    </head>
    <body>
      <h1>🛒 Shopping List</h1>
      <p style="color: #666; font-size: 16px;">For: ${recipe.title}</p>
  `;
  
  for (const [category, categoryItems] of grouped) {
    html += `<h2>${category}</h2>`;
    for (const item of categoryItems) {
      html += `
        <div class="item">
          <div class="checkbox"></div>
          <span class="amount">${item.amount}</span>
          <span class="name">${item.name}</span>
        </div>
      `;
    }
  }
  
  html += `
    </body>
    </html>
  `;
  
  return html;
}

/**
 * Open shopping list in a new printable window
 */
export function printShoppingList(recipe: Recipe): void {
  const html = generatePrintableList(recipe);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Auto-print after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

// Save shopping list to localStorage
const SHOPPING_LIST_KEY = 'current_shopping_list';

export function saveShoppingList(items: ShoppingItem[]): void {
  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving shopping list:', error);
  }
}

export function loadShoppingList(): ShoppingItem[] {
  try {
    const stored = localStorage.getItem(SHOPPING_LIST_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading shopping list:', error);
    return [];
  }
}

export function clearShoppingList(): void {
  try {
    localStorage.removeItem(SHOPPING_LIST_KEY);
  } catch (error) {
    console.error('Error clearing shopping list:', error);
  }
}
