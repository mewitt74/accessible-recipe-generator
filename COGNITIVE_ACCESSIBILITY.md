# Cognitive Accessibility Guide

## 🧠 What is Cognitive Accessibility?

This recipe app includes a **Cognitive Accessibility Recipe Viewer** specifically designed for patients with:

- **TBI** (Traumatic Brain Injury)
- **Aphasia** (language processing difficulties)
- **Dementia** (memory, attention)
- **Intellectual disabilities**
- **Other cognitive conditions**

## 🎯 Design Principles

The cognitive-accessible cooking interface follows these principles:

### 1. **Visual First** 
- Large icons and emojis (120px)
- Minimal text
- Photos and visual cues preferred over written instructions
- Color-coded sections

### 2. **One Task at a Time**
- Full-screen display of current cooking step
- Remove decision fatigue
- No multiple options per step
- Linear progression through steps

### 3. **Voice Guidance**
- Text-to-speech for all instructions
- Button to repeat instruction aloud
- Slower speech rate (0.9x) for clarity
- No reading required

### 4. **Minimal Buttons**
- Large tap targets (60px+ buttons)
- Only 2 navigation buttons: NEXT and BACK
- Clear "Ready to Cook?" starting point
- Voice button is optional, not required

### 5. **High Contrast**
- Green (#7fb539) on white for main actions
- Gray (#999999) for secondary actions
- Large text (28px minimum, 42px for instructions)
- Clear section labels

### 6. **No Pressure**
- Can go back to re-read/relisten to previous steps
- Can skip around steps if needed
- Tips available at bottom for reference
- Large "Change Recipe" button if recipe needs to be stopped

## 📱 How It Works

### Step 1: Ingredients Screen
```
Cooking for patient looks like this:
┌─────────────────────────────────────┐
│       🍗 Chicken Pasta 🍝           │
├─────────────────────────────────────┤
│        📋 Get These:                 │
│  2 cups ○ Chicken Breast             │
│  1 box  ○ Pasta Noodles              │
│  3 tbsp ○ Olive Oil                  │
│                                       │
│        🛠️ Tools Needed:               │
│  Large Pot                            │
│  Frying Pan                           │
│                                       │
│   [    Ready to Cook? →   ]           │
└─────────────────────────────────────┘
```

Patient can:
- See large ingredient list
- See required equipment
- Hear ingredients read aloud (optional)
- One button to start: "Ready to Cook?"

### Step 2: Cooking Steps
```
For each step:
┌─────────────────────────────────────┐
│        Step 1 of 5                   │
│                                       │
│            🔪                         │
│                                       │
│        Prep & Cook                   │
│                                       │
│ ┌─────────────────────────────────┐  │
│ │ Cut chicken into 1 inch cubes    │  │
│ │                                  │  │
│ │                                  │  │
│ └─────────────────────────────────┘  │
│                                       │
│     [  🔊 Hear This  ]                │
│                                       │
│     [   Back  ] [ Next →  ]           │
│                                       │
│  💡 Tips:                             │
│  - Wash chicken first                 │
│  - Keep knife sharp                   │
└─────────────────────────────────────┘
```

Patient can:
- See step number (1 of 5)
- See large emoji (120px)
- See section label (Prep, Cook, Finish)
- Read large instruction (42px text)
- Tap 🔊 button to hear it read aloud
- Tap BACK to re-listen to previous step
- Tap NEXT → to continue
- See tips for reference

### Step 3: Finish Screen
Last step button says "✓ Done!" instead of "Next →"

Tapping "Done!" returns to recipe card view.

## 🎨 Visual Elements

### Icons (Section Labels)
```
🔪 Prep          - Prepare ingredients
🍳 Cook Main     - Main cooking process
🥘 Cook Side     - Side dishes
🥄 Make Sauce    - Sauce/dressing
🍽️ Finish & Serve - Plating and serving
```

### Buttons
```
START       [    Ready to Cook? →   ]    - Green, large, clear
NAVIGATE    [   Back  ] [ Next →  ]      - Green for Next, Gray for Back
VOICE       [  🔊 Hear This  ]           - Green, always available
DONE        [   ✓ Done!   ]              - Green, last step only
BACK TO MENU [ ← Change Recipe ]         - Gray, de-emphasized
```

### Colors
```
Primary Action (Green)   : #7fb539  (Next, Start, Voice, Primary)
Secondary Action (Gray)  : #999999  (Back, Change Recipe)
Background               : #ffffff  (Clean, simple)
Highlights               : #f5f5f5  (Ingredient cards)
```

## ♿ Accessibility Features

### For Screen Readers
- Proper ARIA labels on all buttons
- Step counter announced clearly
- Voice button labeled "Hear This Step"
- Navigation buttons have clear intent

### For Motor Disabilities
- Large buttons (70px height minimum)
- No rapid clicking needed
- Touch-optimized spacing (12px gap between buttons)
- Full-screen design, no tiny targets

### For Cognitive Disabilities
- No time pressure
- Clear linear flow
- Minimal decision points
- Can always go back
- Voice narration available
- Large, clear text (28px+)
- One task per screen

### For Visual Disabilities
- High contrast (white/green)
- Large text (42px for instructions)
- Text-to-speech support
- Clear color coding

### For Hearing Disabilities
- Visual instructions still readable
- Step icons for non-readers
- Text always displayed
- No audio required

## 🔧 Technical Details

### Component Location
```
/src/components/CognitiveAccessibleRecipe.tsx
```

### CSS Styling
```
/src/App.css
Lines: Cognitive accessibility section (search for "COGNITIVE ACCESSIBILITY")
```

### Features
- **Web Speech API** for text-to-speech (built-in browser feature)
- **No external dependencies** needed for voice
- **Responsive design** - works on tablet and phone
- **Touch-optimized** - tap targets are large enough

### Browser Support
- Chrome/Edge: Full support (Web Speech API)
- Firefox: Full support (Web Speech API)
- Safari: Full support (Web Speech API)
- Mobile browsers: Full support

## 👤 User Workflow

### For Caregiver Setting Up Recipe
1. Search for recipe (photo or text)
2. Review recipe cards (front & back)
3. Click "Start Cooking" button
4. Hand device to patient

### For Patient Cooking
1. See ingredients list
2. Gather items
3. Tap "Ready to Cook?"
4. For each step:
   - See large icon and instruction
   - Tap 🔊 to hear step (optional)
   - Do the step
   - Tap Next → arrow
5. Last step shows ✓ Done!
6. Done cooking!

## 🎓 Best Practices for Caregivers

### Before Cooking
1. **Pre-check ingredients** - Make sure patient has everything
2. **Pre-check equipment** - Lay out tools in order
3. **Pre-check safety** - Remove hazards (sharp knives, heat sources)
4. **Supervise** - Stay nearby, especially for hot/sharp tasks
5. **Encourage** - Positive feedback is motivating

### During Cooking
1. **Let them lead** - Patient controls the pace
2. **Repeat if needed** - Tap 🔊 button as many times as needed
3. **Go slow** - No rush, use the BACK button freely
4. **Be patient** - Cognitive disabilities affect processing time
5. **Praise steps** - Celebrate each completed step

### Safety Notes
⚠️ **This app assumes caregiver supervision**

Do not:
- Leave patient alone with heat/sharp items
- Assume they remember previous steps
- Rush the process
- Pressure if they want to go back

Do:
- Position device where they can see it (tablet preferred)
- Keep sharp knives out of reach until needed
- Monitor stove/oven use
- Encourage use of BACK button for re-instruction

## 🚀 Accessing the Cognitive Feature

### From Recipe Card View
```
[Standard Recipe Cards - Front & Back]

          [ ← Back to Edit ]
          [ 👉 Start Cooking ]  ← Click this!
          [ Print Cards ]
          [ Save JSON ]
```

### Full Screen Cooking Interface
Once you click "👉 Start Cooking", the app goes full-screen with:
- Large ingredients list
- Simple "Ready to Cook?" button
- Step-by-step instructions (one at a time)
- Voice narration
- Simple navigation

## 🔄 Returning to Recipe

From cooking screen, bottom button:
```
[ ← Change Recipe ]
```

Clicking takes you back to recipe cards (preview mode).

## 📊 Comparison: Regular vs Cognitive-Accessible

| Feature | Regular | Cognitive |
|---------|---------|-----------|
| Text size | 18px | 42px |
| Buttons | Multiple | 2 navigation |
| Voice | No | Yes (optional) |
| Steps visible | All at once | One at a time |
| Decision points | Many | Minimal |
| Reading required | Yes | No |
| Screen size | Normal | Full-screen |
| Icons | Small | Large (120px) |
| Back button | Yes | Yes (larger) |

## 💡 Example Recipes

Good recipes for cognitive testing:
- Simple pasta (few ingredients, clear steps)
- Scrambled eggs (3-5 steps)
- Sandwiches (no cooking, safe)
- Boxed mac & cheese (minimal skills)

Challenging recipes:
- Multi-step sauces
- Recipes with multiple pots
- Recipes with timing coordination
- Recipes with temperature monitoring

## 🎯 Success Metrics

Patient can successfully:
- ✅ Understand ingredient list
- ✅ Proceed through steps at own pace
- ✅ Use BACK button to re-hear instructions
- ✅ Complete recipe without caregiver guidance on each step
- ✅ Enjoy the cooking process

## 📞 Support & Feedback

If cognitive-accessibility features need adjustment:
1. Note which aspect failed (voice? buttons? text size?)
2. Test with different recipes
3. Adjust font sizes in App.css if needed
4. Consider caregiver feedback on patient experience

---

**Remember**: This interface is designed to **empower** patients with cognitive disabilities to participate in cooking safely and enjoyably. The goal is independence with support, not dependence.
