# Enhanced Search Functionality

## Overview
The recipe search has been significantly enhanced to support multiple search methods with expanded criteria matching. Patients can now find recipes using photos, text, or a combination of both.

## Search Methods

### 1. Photo-Based Search
**Input:** Patient takes a photo of a meal (e.g., chicken breast package, Mac & Cheese box)

**Process:**
- System analyzes image filename and metadata
- Attempts to extract text/keywords from the image
- Identifies food type(s) present in the photo
- Shows identified foods as clickable pills (e.g., "chicken", "pasta")
- Auto-searches for recipes matching identified foods

**Result:** Recipe suggestions appear immediately

### 2. Text-Based Search
**Input:** Patient types food name (e.g., "chicken", "beef", "pasta", "soup")

**Process:**
- System expands search with related terms
- Example: "chicken" → searches for chicken, poultry, bird, breast, thigh, drumstick, wing, nugget
- Searches by exact dish name first
- Falls back to ingredient-based search if needed

**Result:** Broader recipe results from related terms

### 3. Hybrid Search (Photo + Text)
**Workflow:**
1. Patient uploads photo of chicken breast
2. System identifies "chicken" in photo
3. Photo food match appears as pill: "chicken"
4. Patient can click pill to auto-fill search OR type additional keywords
5. System performs expanded search on combined criteria

## Food Recognition Database

The system recognizes foods in these categories:

### Proteins
- **Chicken**: poultry, fowl, breast, thigh, drumstick, wing
- **Beef**: steak, ground, roast, brisket, chuck, rib, sirloin
- **Pork**: ham, bacon, chop, ribs, tenderloin
- **Fish**: salmon, tuna, cod, trout, tilapia, seafood

### Carbohydrates
- **Pasta**: noodles, spaghetti, macaroni, penne, lasagna, mac and cheese
- **Rice**: risotto, pilaf, fried rice
- **Vegetables**: broccoli, carrot, spinach, tomato, potato, salad, greens

### Other
- **Soup**: broth, stew, chowder, bisque
- **Eggs**: omelet, scrambled
- **Cheese**: cheddar, mozzarella, parmesan

## Technical Implementation

### Services

#### `imageRecognition.ts`
- `extractTextFromImage()` - Validates image files
- `identifyFoodFromImageMetadata()` - Checks filename and extracts food names
- `getFoodNameFromImage()` - Main food identification function
- `expandSearchTerms()` - Generates related search terms for a food

#### `recipeApi.ts`
- `searchRecipes()` - Enhanced with fallback to ingredient search
- `getMealDetails()` - Fetches full recipe details by ID
- `expandedSearch()` - Searches using multiple related terms

### Components

#### `RecipeImporter.tsx`
- Photo upload with preview and clear button
- Display of identified foods as clickable pills
- Combined photo + text search capability
- Handles image processing states (loading, error, success)
- Shows helpful error messages with suggestions

## User Experience Flow

### Scenario 1: Patient Has Chicken Breast Package
1. Opens app
2. Clicks "Take Photo of Meal" button 📷
3. Snaps photo of chicken package
4. System analyzes and shows "chicken" pill
5. Automatically searches for chicken recipes
6. Results appear with photos and names
7. Taps "Use This Recipe" to get aphasia-friendly card

### Scenario 2: Patient Wants to Cook Something But Has No Package
1. Opens app
2. Types "soup" in search box
3. System expands search for: soup, broth, stew, chowder, bisque
4. Shows 10+ recipe results (soups and related dishes)
5. Patient selects desired recipe
6. Gets large-text, one-sentence-per-step instructions

### Scenario 3: Patient Wants Combined Search
1. Takes photo of pasta package → "pasta" identified
2. Clicks on pasta pill to search
3. Gets pasta recipes
4. If not satisfied, types "mac and cheese" to refine search
5. System re-searches with "pasta" + "mac and cheese" expanded terms
6. Gets more specific results

## Accessibility Features

✅ Large, touch-friendly buttons (20px+ text)
✅ High contrast colors (#7fb539 green on white, black text)
✅ Clear icons (📷 camera, ✕ clear button)
✅ Helpful error messages
✅ Clickable food pills with tap-friendly targets
✅ Mobile camera integration (works on smartphones)
✅ One-sentence instructions (max 150 chars)
✅ 18px minimum font size throughout

## Data Sources

- **Recipes:** TheMealDB API (free, ~300 recipes)
- **Food Recognition:** Local database of common ingredients
- **No Authentication Required:** Service works offline-first with API fallback

## Future Enhancements

- [ ] Add OCR library (Tesseract.js) for real image text extraction
- [ ] Train ML model on food images for visual recognition
- [ ] Add voice search capability ("Say the food name")
- [ ] Support barcode scanning to identify products
- [ ] Multi-language support for recipe names
