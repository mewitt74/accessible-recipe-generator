# Quick Testing Walkthrough

## Start the App

```bash
cd /workspaces/accessible-recipe-generator
npm run dev
```

Open browser to: **http://localhost:5174/**

## Test Scenario 1: Photo-Based Search (TBI/Aphasia Patient)

**Scenario:** Patient has a box of Mac & Cheese in front of them

### Steps:
1. Click big green button: **"📷 Take Photo of Meal"**
2. Either:
   - Upload image file (test image: any photo of food/package)
   - Or take phone camera photo if on mobile
3. Image preview appears
4. System identifies "pasta" or "macaroni" from image
5. Click the food pill that appears
6. **Results:** 3-5 pasta/mac recipes appear with photos
7. Click **"Use This Recipe"** on any recipe
8. **Card displays:**
   - **Front:** Green header with recipe name, ingredient grid, green footer
   - **Back:** Equipment list, numbered steps with green circles, tips
9. Click **Print** button (Ctrl+P) to test print layout

### Expected UI:
- Large text (18px+)
- High contrast (green #7fb539, white, dark gray)
- Simple one-sentence instructions
- No complex language

---

## Test Scenario 2: Text Search

**Scenario:** Patient wants to search for chicken recipes

### Steps:
1. Type **"chicken"** in search box
2. Click **Search** or press Enter
3. Wait 2-3 seconds
4. **Results:** 5-10 chicken recipes appear
5. Select any recipe
6. Verify card displays (same as Scenario 1)

### Try These Searches:
- "chicken" → chicken recipes
- "beef" → beef/steak recipes
- "pasta" → pasta/noodle recipes
- "soup" → soups and stews
- "fish" → fish recipes
- "rice" → rice dishes

---

## Test Scenario 3: Manual Recipe Entry

**Scenario:** Patient creates custom recipe

### Steps:
1. Click **"Form"** tab at top
2. Enter:
   - Title: "My Simple Recipe"
   - Ingredients: "2 cups flour", "1 egg", etc.
   - Steps: Click "Add Step", enter instructions
3. Click **Save Recipe**
4. Switch to **"Cards"** tab
5. Verify recipe appears with proper formatting
6. Print to test layout

---

## Test Scenario 4: Hybrid Search (Photo + Text)

### Steps:
1. Upload photo of chicken package → identifies "chicken"
2. Click the "chicken" pill
3. Gets chicken recipes
4. Not satisfied? Type **"chicken wings"** to refine
5. Click Search
6. Gets chicken wing recipes
7. Select recipe
8. Verify card quality

---

## Accessibility Checks

### Typography
- [ ] All text readable and not tiny
- [ ] Title is large (28-32px) and bold
- [ ] Instructions are 18px
- [ ] Good line-height spacing (1.6-1.8)

### Colors
- [ ] Green header/footer is visible and accessible
- [ ] Text contrast is good (dark on light, white on green)
- [ ] No important info conveyed by color alone

### Simplicity
- [ ] Each step is one sentence
- [ ] No compound sentences ("first... then... also..." style)
- [ ] Instructions are in simple, active voice
- [ ] No technical jargon

### Usability
- [ ] Large buttons (easy to tap on mobile)
- [ ] Clear error messages
- [ ] No confusing navigation
- [ ] Photos/images load properly

---

## Print Test

### Steps:
1. Display a recipe card
2. Press **Ctrl+P** (Windows/Linux) or **Cmd+P** (Mac)
3. Print Preview should show:
   - Card dimensions: 8.5" × 11" (portrait)
   - Two pages total (front & back)
   - Colors print correctly
   - Text is sharp and readable
   - Green (#7fb539) header/footer visible
   - Circles and decorative elements visible
4. Print to PDF or paper to test

### Expected Output:
- Professional looking recipe card
- All text readable at print size
- Proper page breaks (no content split across pages)
- Colors and styling intact

---

## Mobile Testing

### Steps:
1. Open browser on smartphone (iPhone/Android)
2. Go to: **http://10.0.0.158:5174/** (or machine's IP:5174)
3. Test photo upload:
   - Click camera button
   - Tap to open phone camera
   - Take photo of food
   - Verify image preview
   - Check food identification
4. Test search:
   - Type food name
   - Verify results on small screen
   - Tap recipe to view
5. Test print:
   - Tap Menu → Print (or share as PDF)
   - Verify mobile print layout

### Expected:
- Touch-friendly buttons
- Readable text on 6" screen
- No horizontal scrolling
- Cards scale properly to screen width

---

## Error Handling Tests

### Test 1: Invalid Image
- Upload non-image file (.txt, .pdf)
- Expected: Error message
- Message should be clear and helpful

### Test 2: No Results
- Search for obscure word: "xyzabc123"
- Expected: "No recipes found" message
- Should suggest trying other foods

### Test 3: Poor Internet
- Throttle network in DevTools (Network tab → Slow 3G)
- Do a search
- Should see loading spinner
- Results should eventually load
- No crashes or hangs

### Test 4: Large Image
- Upload very large image file (>10MB)
- Expected: Error saying file too large
- Should ask for smaller image

---

## Feature Test Summary

| Feature | Test Method | Expected Result |
|---------|------------|-----------------|
| Photo Upload | Click 📷, upload image | Image appears, food identified |
| Text Search | Type "chicken", Search | Results in 2-3 sec |
| Hybrid Search | Photo + type text | Combined search results |
| Card Display | Select recipe | Front/back cards show properly |
| Typography | View text | 18px+, readable, high contrast |
| Print | Ctrl+P on card | Professional 8.5x11 layout |
| Mobile | Open on phone | Touch-friendly, scales well |
| Form | Create recipe | Card displays correctly |

---

## Success Criteria

✅ **App is ready for deployment if:**
1. Photo upload works (browser accepts images)
2. Search finds recipes (TheMealDB API working)
3. Recipe cards display with proper styling
4. Print layout looks professional
5. Mobile interface is usable
6. Text is 18px+ and readable
7. Colors meet accessibility standards
8. No console errors
9. Load time < 3 seconds
10. Bundle size < 70KB gzipped

---

## Troubleshooting

**App won't start:**
```bash
npm install
npm run dev
```

**Port 5174 in use:**
```bash
npm run dev -- --port 3000
```

**Build fails:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

**Image upload not working:**
- Check browser console (F12) for errors
- Test with different image formats (jpg, png)
- Clear browser cache and reload
- Try different browser (Chrome > Firefox > Safari)

**Search returns no results:**
- Check TheMealDB API: https://www.themealdb.com/api.php
- Try simpler search terms
- Check internet connection

**Print looks bad:**
- Use Chrome (best print support)
- Ensure "Background graphics" enabled in print settings
- Test print preview before printing
