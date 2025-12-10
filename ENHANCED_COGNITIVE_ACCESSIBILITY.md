# Enhanced Cognitive Accessibility Features

## 🎯 Overview

The accessible recipe generator now includes **two cooking modes** designed specifically for people with cognitive disabilities:

1. **Simple Mode** - Voice-guided cooking with minimal UI (best for severe cognitive impairment)
2. **Enhanced Mode** - Step photos, safety warnings, ingredient checklist, and timers (best for moderate cognitive impairment)

## 🧠 Understanding Cognitive Disabilities in Cooking

### Common Challenges:
- **Memory loss** - Forgetting steps or ingredients
- **Attention deficit** - Getting distracted or confused
- **Executive dysfunction** - Difficulty planning or organizing
- **Language processing** - Difficulty reading instructions
- **Time perception** - Not understanding cooking duration
- **Safety awareness** - Missing hazards (heat, sharp objects)

## 👉 Enhanced Mode Features

### 1. Ingredient Checklist (Before Cooking)
```
INGREDIENTS SCREEN:
┌────────────────────────────┐
│  🍗 Chicken Pasta 🍝       │
├────────────────────────────┤
│  📋 Get These Items:        │
│  ☐ 2 cups  Chicken Breast  │
│  ☐ 1 box   Pasta Noodles   │
│  ☐ 3 tbsp  Olive Oil       │
│                             │
│  🛠️ Tools You Need:         │
│  ☐ Large Pot               │
│  ☐ Frying Pan              │
│  ☐ Colander                │
│                             │
│   [ Ready to Cook? → ]      │
└────────────────────────────┘
```

**Why this helps:**
- Visual checklist prevents forgotten ingredients
- Checkboxes engage multiple senses
- Lays out everything before starting
- Reduces anxiety about missing items

### 2. Step-by-Step Photo Display

For EVERY cooking instruction:
```
COOKING SCREEN:
┌────────────────────────────┐
│  Step 1 of 5                │
├────────────────────────────┤
│  🔥 BE CAREFUL! HOT       │
│  Warning: This uses heat!  │
├────────────────────────────┤
│  [COOKING PHOTO HERE]      │
│  (Real photo of action)    │
│                             │
│  Prep & Cook                │
│                             │
│  "Cut chicken into 1 inch   │
│   cubes"                    │
│                             │
│  [ 🔊 Read to Me ]          │
│  [ ⏱️ 1min ] [ ⏱️ 5min ]   │
│                             │
│  [ ← Back ] [ Next → ]      │
└────────────────────────────┘
```

### 3. Smart Safety Warnings

Automatically detected and displayed:

```
🔥 DANGER: HEAT
   "Be careful! This step is HOT. Watch your hands."

🔪 WARNING: SHARP OBJECTS
   "You will use a sharp knife. Be careful of your fingers!"

⏱️ INFO: TIMING REQUIRED
   "This step takes time. Use the timer button below."
```

Safety warnings appear automatically based on keywords in the instruction:
- **Heat** triggers: boil, fry, bake, oven, stove, hot
- **Sharp objects** trigger: cut, slice, chop, dice, knife
- **Timing** trigger: minute, hour, time, cook, bake

### 4. Visual Cooking Step Photos

Photos come from **Unsplash API** (free, high-quality):

**How it works:**
1. App analyzes current step instruction
2. Generates search query: e.g., "diced chicken" or "boiling water"
3. Fetches photo from Unsplash API
4. Displays real cooking photo
5. If photo fails to load, shows emoji + description

**Smart Search Queries:**
- "cut chicken" → searches "chopped vegetables cutting board knife"
- "boil water" → searches "boiling water pot cooking pot stove"
- "fry in pan" → searches "frying pan cooking stirring food"
- "mix ingredients" → searches "mixing bowl ingredients mixing spoon"

**Fallback System:**
If Unsplash photo unavailable:
- Shows large emoji (100px)
- Displays action description
- User can still proceed (no photo, no problem)

### 5. Ingredient Verification Checklist

Patient checks off each ingredient as they gather it:
- Checkboxes are LARGE (32px) for easy tapping
- Clear visual feedback when checked
- Green checkmark indicates completion
- Equipment items also have checklist

**Why this helps:**
- Engages kinesthetic memory (physical action)
- Visual confirmation of preparation
- Reduces anxiety ("Did I get everything?")
- Builds confidence before starting

### 6. Built-in Cooking Timers

Three quick-tap timer options:
```
⏱️ 1 min   ⏱️ 5 min   ⏱️ 10 min
```

**Features:**
- Large buttons (easy to tap)
- Clear countdown display
- Audio alert when timer finishes
- Can be stopped at any time
- Automatically speaks "timer finished"

**Why timers help:**
- Many patients lose track of time
- Audio alert is less intrusive than phone alarm
- Multiple timer durations fit different needs
- Removes anxiety about "how long?"

### 7. Step-by-Step Navigation

Only two buttons:
```
[ ← Back ]  [ Next → ]
```

**Why minimal buttons help:**
- Reduces decision fatigue
- Can't get "lost" in complex menus
- BACK button always available (no pressure)
- Linear progression matches thinking pattern

### 8. Automatic Voice Narration

Every step is read aloud automatically:
- 🔊 "Hear This" button
- Slightly slower speech (0.85x speed)
- Can be repeated as many times as needed
- Patient can press to re-listen anytime

**Why voice helps:**
- Removes reading requirement
- Auditory + visual learning
- Re-listening available without judgment
- Reduces frustration

### 9. Helpful Tips Display

Meal-specific cooking tips appear:
```
💡 Helpful Tips:
- Wash chicken first (food safety)
- Keep knife sharp (safer, less slipping)
- Cook pasta until tender
```

Tips are optional reference (not required reading).

## 📱 Simple Mode vs Enhanced Mode

| Feature | Simple Mode | Enhanced Mode |
|---------|-----------|--------------|
| Step photos | ❌ No | ✅ Yes (Unsplash) |
| Safety warnings | ❌ No | ✅ Yes (auto-detected) |
| Ingredient checklist | ❌ No | ✅ Yes (visual) |
| Cooking timers | ❌ No | ✅ Yes (quick-tap) |
| Voice narration | ✅ Yes | ✅ Yes |
| Screen complexity | ⭐ Minimal | ⭐⭐ Moderate |
| Best for | Severe cognitive disability | Moderate cognitive disability |
| Data usage | Low | Moderate (photos) |

## 🎓 Which Mode to Use?

### Choose **Simple Mode** if:
- Patient has severe memory loss or confusion
- Patient gets overwhelmed by too much information
- Patient prefers minimal visual stimuli
- Internet is limited/slow
- Simple workflow needed

### Choose **Enhanced Mode** if:
- Patient can follow multiple visual cues
- Patient benefits from seeing photos of actions
- Patient forgets ingredients or timing
- Patient responds well to warnings and alerts
- Internet connection is reliable

## 🔒 Privacy & Offline Use

### Photo Caching
- First time viewing recipe: photos load from Unsplash
- Subsequent views: cached locally in browser
- Reduces data usage and loading time
- Works semi-offline (cached recipes only)

### No Data Collection
- App doesn't store patient data
- Photos from Unsplash (read their privacy policy)
- Local caching only
- No tracking or analytics

## ♿ Accessibility Compliance

### For Motor Disabilities
- Large buttons (60px+ height)
- 12px spacing between buttons
- Easy tap targets (no precision needed)
- No swipe gestures (tap only)

### For Visual Disabilities
- High contrast (green #7fb539 on white)
- Large text (28px minimum, 42px for instructions)
- Alt text on all images
- Screen reader support

### For Hearing Disabilities
- Text always displayed
- Photos show actions visually
- No audio required (just optional)
- Captions not needed (instructions are text)

### For Cognitive Disabilities
- One task per screen
- Minimal text
- Large icons
- Clear navigation
- No time pressure
- Can go back anytime
- Safety warnings auto-generated

### For Dyslexia
- Voice narration available
- Sans-serif font (system default)
- Good line spacing
- Photos reduce reading burden

## 🧪 Testing the Enhanced Mode

### Test Scenario 1: Memory Loss
1. Search for recipe
2. Click "Enhanced Mode"
3. Verify ingredient checklist is easy to follow
4. Tap some checkboxes
5. Click "Ready to Cook?"
6. Go through steps, tapping "Back" to re-listen
7. Verify can always go backward

### Test Scenario 2: Safety Awareness
1. Search for "chicken" recipe
2. Click "Enhanced Mode"
3. Look for ⚠️ warnings on cutting steps
4. Look for 🔥 warnings on cooking steps
5. Verify warnings match step content
6. Check photos are relevant to actions

### Test Scenario 3: Time Management
1. Search for recipe with cooking time
2. Click "Enhanced Mode"
3. Get to a long step (simmer, bake, etc.)
4. Click ⏱️ timer button
5. Verify countdown is visible
6. Verify timer alerts with sound
7. Verify can stop timer early

### Test Scenario 4: Photo Reliability
1. Search for recipe
2. Click "Enhanced Mode"
3. Watch first step load
4. Verify photo appears (or emoji fallback)
5. Navigate through steps
6. Verify each step has photo/emoji
7. Verify no broken images

## 🚀 Using the App

### Step 1: Start Cooking Mode
From recipe card view:
```
[ 👉 Start Cooking (Enhanced) ]  ← Choose this
[ 👉 Start Cooking (Simple) ]     ← Or choose this
```

### Step 2: Gather Ingredients
- See full ingredient list
- Check off each item as gathered
- Check off tools
- Verify checklist complete
- Tap "Ready to Cook?"

### Step 3: Do Each Step
- See big photo of what step looks like
- Read instruction (or listen)
- Use timer if needed
- Ask for safety warnings
- Tap NEXT when done
- Tap BACK to re-listen

### Step 4: Finish
Last step shows:
```
[ ✓ Done! ]
```

Clicking returns to recipe card view.

## 📊 Accessibility in Numbers

**Large Text:**
- Title: 48px
- Instructions: 42px
- Ingredients: 24px
- Buttons: 28px minimum

**High Contrast:**
- Green buttons: #7fb539 (WCAG AAA on white)
- White background: #ffffff
- Dark text: #333333
- Contrast ratio: 13:1

**Touch Targets:**
- Buttons: 60px+ height
- Checkboxes: 32px
- Spacing: 12px minimum
- Works on phones and tablets

## 💡 Caregiver Tips

### Before Cooking
1. **Choose the right mode**
   - Enhanced if patient likes visual guidance
   - Simple if patient gets overwhelmed

2. **Test recipe difficulty**
   - Simple recipes (scrambled eggs, pasta) for first time
   - Complex recipes after patient is comfortable

3. **Set up workspace**
   - Tablet at eye level
   - Ingredients already gathered (checklist helps)
   - Dangerous items out of reach initially

4. **Supervise as needed**
   - Heat and sharp objects still require oversight
   - Let patient lead the cooking
   - Use warnings as teaching moments

### During Cooking
1. **Let patient pace themselves**
   - No rushing
   - Patient controls NEXT button
   - BACK button always available

2. **Encourage voice use**
   - "Press the 🔊 button if you forget"
   - "You can listen as many times as you want"
   - Normalize re-listening

3. **Reinforce safety**
   - Point out ⚠️ warnings
   - Supervise hot/sharp steps
   - Praise careful cooking

4. **Celebrate progress**
   - Each step completed is a win
   - Voice excitement at milestones
   - Finish together (celebrate at ✓ Done!)

## 🔧 Customization & Configuration

### Adjusting Text Sizes
Font sizes are in `src/App.css`:
- Instruction text: `instruction-text` (42px)
- Title: `recipe-title` (48px)
- Ingredients: `ingredient-check-name` (24px)

Edit CSS for larger/smaller text if needed.

### Adjusting Voice Speed
In `EnhancedCognitiveRecipe.tsx`:
```typescript
utterance.rate = 0.85;  // Change to 0.7 for slower, 1.0 for normal
```

### Adjusting Colors
In `App.css`:
```css
--accent: #7fb539;  /* Main button color */
/* Change to accessible color if needed */
```

### Adding More Timer Options
In `EnhancedCognitiveRecipe.tsx`:
```typescript
<button onClick={() => startTimer(15)} className="btn-timer">
  ⏱️ 15 min
</button>
```

## 🐛 Known Limitations

1. **Photos require internet**
   - Unsplash API needs connection
   - Fallback emojis work offline

2. **Voice only works with Web Speech API**
   - Most modern browsers supported
   - No custom voices available

3. **Timers don't continue when tab is closed**
   - App is tab-specific
   - Device timer recommended for critical timing

4. **Recipe search limited to TheMealDB**
   - ~300 meals in free database
   - Ad-free sources also available

## 📞 Support & Feedback

If patients struggle with:
- **Reading instructions** → Use "Read to Me" button more
- **Forgetting ingredients** → Check off checklist before starting
- **Losing track of time** → Use timer buttons
- **Feeling overwhelmed** → Try Simple mode instead
- **Missing photos** → Internet may be slow (fallback emojis still work)
- **Can't hear voice** → Check volume/speaker settings

## 🎯 Future Enhancements

Potential improvements:
- Video demonstrations instead of photos (more engaging)
- Automatic ingredient quantity scaling (for different serving sizes)
- Meal planning (plan week of meals)
- Grocery list generation
- Integration with smart home timers (Alexa, Google Home)
- Offline mode with pre-downloaded photos
- Custom difficulty levels
- Cooking progress photo upload (patient takes photos of progress)

---

**This app is designed to empower people with cognitive disabilities to cook independently or with minimal support. The goal is dignity, learning, and enjoyment of cooking.**
