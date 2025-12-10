# Cooking Step Photos Integration Guide

## 🖼️ Overview

The cognitive-accessible recipe viewer currently displays **icons** and **text** for each step. To make it even more accessible for patients with cognitive disabilities, we can add **actual cooking photos** that show what the step should look like.

This guide shows how to integrate photos from multiple sources.

## 🎯 Photo Sources

### Option 1: Unsplash API (Recommended - Free & Simple)

**Pros:**
- Free tier available
- High-quality cooking photos
- No API key required for basic usage
- Reliable service

**Cons:**
- May not match exact recipe steps
- Generic cooking photos
- Network call required

### Option 2: AI Image Generation (DALL-E, Stability AI)

**Pros:**
- Can generate exact step-by-step visuals
- Perfect match to recipe steps
- Very accurate for accessibility

**Cons:**
- Requires API key (paid)
- Slower generation
- API costs money

### Option 3: Placeholder Photos (Fallback)

**Pros:**
- No API calls needed
- Instant loading
- Works offline

**Cons:**
- Generic/not recipe-specific
- Less engaging

### Option 4: Recipe Database Photos (TheMealDB)

**Pros:**
- Already using TheMealDB API
- Recipe-specific photos
- No extra API calls

**Cons:**
- Only full recipe photo available
- Not step-by-step

## 📋 Implementation Steps

### Step 1: Update Recipe Type

First, update the `Step` interface in `types.ts`:

```typescript
interface Step {
  section: 'Prep' | 'Cook Main' | 'Cook Side' | 'Make Sauce' | 'Finish & Serve';
  instruction: string;
  photoUrl?: string;  // Add this field
}
```

### Step 2: Update Recipe API

Modify `src/services/recipeApi.ts` to fetch photos:

```typescript
// Add this function to recipeApi.ts
import axios from 'axios';

async function getStepPhoto(stepInstruction: string, mealTitle: string): Promise<string> {
  try {
    // Try Unsplash API first
    const query = `${mealTitle} ${stepInstruction}`.split(' ').slice(0, 3).join(' ');
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=YOUR_UNSPLASH_KEY`;
    
    const response = await axios.get(unsplashUrl);
    if (response.data.results.length > 0) {
      return response.data.results[0].urls.regular;
    }
  } catch (error) {
    console.log('Photo fetch failed, using fallback');
  }
  
  // Fallback to placeholder
  return `/placeholder-cooking-${Math.floor(Math.random() * 5)}.jpg`;
}

// Update transformToStandardRecipe to include photos
async function transformToStandardRecipe(meal: any): Promise<Recipe> {
  const steps = buildSteps(meal.strInstructions);
  
  // Add photo URLs to each step
  const stepsWithPhotos = await Promise.all(
    steps.map(async (step) => ({
      ...step,
      photoUrl: await getStepPhoto(step.instruction, meal.strMeal)
    }))
  );
  
  return {
    // ... existing fields
    steps: stepsWithPhotos
  };
}
```

### Step 3: Update Cognitive Accessible Component

Modify `src/components/CognitiveAccessibleRecipe.tsx`:

```typescript
// Add this JSX inside the instruction-area div:
{currentStep.photoUrl && (
  <div className="step-photo-container">
    <img 
      src={currentStep.photoUrl} 
      alt={`Step ${currentStepIndex + 1}: ${currentStep.instruction}`}
      className="step-photo"
      loading="lazy"
    />
  </div>
)}
```

### Step 4: Add CSS for Photos

Add to `src/App.css`:

```css
.step-photo-container {
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 20px;
}

.step-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

## 🔑 API Keys Setup

### Unsplash API Key (Free)

1. Go to https://unsplash.com/developers
2. Create a free account
3. Create a new application
4. Copy the **Access Key**
5. Add to your app:

```typescript
// In recipeApi.ts
const UNSPLASH_API_KEY = 'YOUR_KEY_HERE';

// Or use environment variable:
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_KEY;
```

6. Add to `.env`:
```
VITE_UNSPLASH_KEY=your_key_here
```

### DALL-E API Key (Paid)

1. Go to https://platform.openai.com/api-keys
2. Sign up for OpenAI account
3. Create API key
4. Add credits (paid)
5. Store key securely in `.env`

## 📸 Photo Caching

To avoid repeated API calls, cache photos locally:

```typescript
// Simple caching in recipeApi.ts
const photoCache = new Map<string, string>();

async function getStepPhotoWithCache(stepInstruction: string, mealTitle: string): Promise<string> {
  const cacheKey = `${mealTitle}:${stepInstruction}`;
  
  if (photoCache.has(cacheKey)) {
    return photoCache.get(cacheKey)!;
  }
  
  const photoUrl = await getStepPhoto(stepInstruction, mealTitle);
  photoCache.set(cacheKey, photoUrl);
  return photoUrl;
}
```

## 🎨 Photo Selection Strategy

### For Cognitive Accessibility, prefer:

1. **Clear, well-lit photos**
2. **Close-up of the step result** (not wide shots)
3. **High contrast** (light backgrounds)
4. **No people** (distraction)
5. **Finished state** (shows what "done" looks like)

Example searches:
- For "cut chicken": Search "diced raw chicken close-up"
- For "boil water": Search "boiling water in pot"
- For "stir sauce": Search "mixing sauce in bowl"

## 🚫 Photo Fallbacks

If no photo available, use:

1. **Step emoji** (already implemented)
2. **Placeholder image** (generic cooking photo)
3. **Text description** (always visible)

## 🔒 Privacy & Performance

### Considerations:

1. **Images load slower** than text
   - Add loading spinners
   - Use `loading="lazy"` for images

2. **Bandwith usage**
   - Cache aggressively
   - Use appropriate image sizes
   - Consider compression

3. **API rate limits**
   - Unsplash: 50 requests/hour (free)
   - DALL-E: Based on credits
   - TheMealDB: 1 request/second

### Solution: Pre-fetch during recipe load

```typescript
// In CognitiveAccessibleRecipe, useEffect:
useEffect(() => {
  // Pre-fetch all photos before cooking starts
  allSteps.forEach(step => {
    if (step.photoUrl) {
      const img = new Image();
      img.src = step.photoUrl;
    }
  });
}, [allSteps]);
```

## 📱 Mobile Optimization

For tablets (primary device):

```css
/* Optimize for tablet */
@media (max-width: 1024px) and (min-height: 600px) {
  .instruction-area {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .step-photo-container {
    max-height: 60vh;
    order: -1; /* Photo first */
  }
  
  .instruction-text {
    font-size: 36px;
  }
}
```

## 🧪 Testing Photos

### Test scenarios:

1. **Photo loads correctly**
   - Opens recipe
   - Navigates to step
   - Photo displays in 2 seconds

2. **Photo is relevant**
   - Shows actual cooking action
   - Matches instruction text
   - High quality/clear

3. **Fallback works**
   - If photo fails to load, icon appears
   - User can still proceed
   - No broken image icons

4. **Performance**
   - Navigation between steps feels smooth
   - No lag when advancing steps
   - Images don't consume excessive memory

## 🚀 Advanced: AI-Generated Photos

For perfect step matching, use AI generation:

```typescript
import axios from 'axios';

async function generateStepPhoto(stepInstruction: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: `Cooking step photo: ${stepInstruction}. Simple, clear, well-lit, close-up view.`,
        n: 1,
        size: '512x512'
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
        }
      }
    );
    return response.data.data[0].url;
  } catch (error) {
    console.error('AI generation failed', error);
    return null;
  }
}
```

## 📊 Implementation Checklist

- [ ] Update `Step` interface with `photoUrl` field
- [ ] Add Unsplash API integration to `recipeApi.ts`
- [ ] Set up environment variable for API key
- [ ] Update `transformToStandardRecipe` to fetch photos
- [ ] Add photo display to `CognitiveAccessibleRecipe.tsx`
- [ ] Add CSS styling for photo containers
- [ ] Implement photo caching
- [ ] Test photo loading on different devices
- [ ] Test fallback when photos unavailable
- [ ] Optimize image sizes for mobile
- [ ] Add loading indicator while photos fetch
- [ ] Test performance with slow network
- [ ] Document photo selection guidelines

## 🎯 Future Enhancement: Step-by-Step Video

For maximum accessibility, consider video instead of photos:

```typescript
interface Step {
  instruction: string;
  photoUrl?: string;
  videoUrl?: string;  // 3-5 second video clip
}
```

Video would show:
- Actual motion (more intuitive)
- Exact hand movements
- Timing of steps
- Audio narration on video

## 📚 Resources

- **Unsplash API**: https://unsplash.com/developers
- **DALL-E**: https://platform.openai.com/docs/guides/images
- **Stability AI**: https://stability.ai/
- **RecipeDB with photos**: https://www.spoonacular.com/food-api
- **Cognitive accessibility**: https://www.w3.org/WAI/cognitive/

---

**Remember**: Photos should enhance, not replace, voice narration. The goal is multiple ways to understand each step.
