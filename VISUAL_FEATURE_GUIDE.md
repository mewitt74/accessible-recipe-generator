# Visual Feature Guide - Cognitive Accessibility

## Screen 1: Recipe Selection
```
┌─────────────────────────────────────────┐
│          Recipe Search                  │
├─────────────────────────────────────────┤
│  📷 Take Photo of Meal  OR              │
│  Type: chicken, pasta, soup...          │
│  [Search]                               │
├─────────────────────────────────────────┤
│  Results:                               │
│  ┌──────────┐  ┌──────────┐            │
│  │ 🍗      │  │ 🍝      │            │
│  │Chicken  │  │Pasta    │            │
│  │Parmesan │  │Primavera│            │
│  │[Use]    │  │[Use]    │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

## Screen 2: Recipe Card Preview
```
┌─────────────────────────────────────────┐
│    🍗 CHICKEN PARMESAN 🍝              │
├─────────────────────────────────────────┤
│ Ingredients        │  Instructions      │
│ ────────────────   │  ──────────────   │
│ 2 cups Chicken     │  1. Cut chicken    │
│ 1 cup Parmesan     │  2. Bread it       │
│ 3 tbsp Oil         │  3. Fry golden     │
│ ...more...         │  4. Top with sauce │
│                     │  5. Bake & serve   │
├─────────────────────────────────────────┤
│ [← Back] [👉 Enhanced] [👉 Simple]     │
│         [Print]    [Save JSON]          │
└─────────────────────────────────────────┘
```

## Screen 3: Enhanced Mode - Ingredients Checklist
```
┌─────────────────────────────────────────┐
│   🍗 CHICKEN PARMESAN 🍝               │
├─────────────────────────────────────────┤
│                                         │
│  📋 GET THESE ITEMS:                   │
│                                         │
│  ☐  2 cups       Chicken Breast        │
│  ☐  1 cup        Parmesan Cheese       │
│  ☐  2 cups       Flour                 │
│  ☐  3 eggs       Beaten                │
│  ☐  3 tbsp       Olive Oil             │
│  ☐  2 cups       Marinara Sauce        │
│                                         │
│  🛠️  TOOLS YOU NEED:                    │
│                                         │
│  ☐  Large Cutting Board                │
│  ☐  Sharp Knife                        │
│  ☐  3 Shallow Bowls                    │
│  ☐  Large Frying Pan                   │
│  ☐  Baking Sheet                       │
│  ☐  Oven                               │
│                                         │
│         [ Ready to Cook? → ]            │
│         [ ← Back ]                      │
└─────────────────────────────────────────┘
```

**How it works:**
- Patient taps each checkbox as they gather items
- Green checkmark appears when checked
- Reduces anxiety about forgotten ingredients
- Builds confidence before starting

## Screen 4: Enhanced Mode - Step Display
```
┌─────────────────────────────────────────┐
│  Step 1 of 5                            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ WARNINGS ─────────────────────┐   │
│  │ 🔪 SHARP OBJECTS               │   │
│  │ You will use a sharp knife.    │   │
│  │ Be careful of your fingers!    │   │
│  └────────────────────────────────┘   │
│                                         │
│  ┌─ PHOTO ────────────────────────┐   │
│  │                                │   │
│  │   [REAL COOKING PHOTO HERE]    │   │
│  │   (e.g. diced chicken)         │   │
│  │   Unsplash ▶                   │   │
│  │                                │   │
│  └────────────────────────────────┘   │
│                                         │
│        PREP & COOK                      │
│                                         │
│   Cut chicken into 1 inch cubes        │
│                                         │
│  [ 🔊 Read to Me ]                     │
│                                         │
│  ⏱️ Quick Timers:                       │
│  [ ⏱️ 1 min ] [ ⏱️ 5 min ] [10 min]   │
│                                         │
│  [ ← Back  ] [ Next → ]                │
└─────────────────────────────────────────┘
```

**Features shown:**
- Step counter (1 of 5)
- Safety warning (auto-detected from instruction)
- Real photo from Unsplash (or emoji fallback)
- Section label (Prep & Cook)
- Large instruction text (42px)
- Voice button (🔊)
- Timer buttons (quick-tap)
- Navigation buttons (BACK/NEXT only)

## Screen 5: Enhanced Mode - Timer Active
```
┌─────────────────────────────────────────┐
│  Step 3 of 5                            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ WARNINGS ─────────────────────┐   │
│  │ 🔥 HOT - BE CAREFUL!           │   │
│  │ This step is HOT. Watch your   │   │
│  │ hands carefully.               │   │
│  └────────────────────────────────┘   │
│                                         │
│  ┌─ PHOTO ────────────────────────┐   │
│  │   [FRY PAN WITH CHICKEN PHOTO] │   │
│  └────────────────────────────────┘   │
│                                         │
│        COOK MAIN                        │
│                                         │
│   Fry chicken in hot pan until golden  │
│                                         │
│  ┌──────────────────────────────┐     │
│  │      4:35                    │     │
│  │     (flashing)               │     │
│  └──────────────────────────────┘     │
│                                         │
│  [ ⏹️ Stop Timer ]                     │
│                                         │
│  [ ← Back  ] [ Next → ]                │
└─────────────────────────────────────────┘
```

**Timer features:**
- Large countdown display (32px, red, bold)
- Flashing animation
- Stop button visible
- BACK/NEXT still available
- Audio alert when finished
- Speech confirmation ("Timer finished")

## Screen 6: Enhanced Mode - With Tips
```
┌─────────────────────────────────────────┐
│  Step 5 of 5                            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ PHOTO ────────────────────────┐   │
│  │   [PLATED CHICKEN PARMESAN]    │   │
│  └────────────────────────────────┘   │
│                                         │
│        FINISH & SERVE                   │
│                                         │
│   Top with fresh basil and serve hot   │
│                                         │
│  [ 🔊 Read to Me ]                     │
│                                         │
│  💡 HELPFUL TIPS:                      │
│  • Let cool 5 minutes before serving   │
│  • Pairs well with garlic bread        │
│  • Leftovers reheat in 350°F oven     │
│                                         │
│  [ ← Back  ] [ ✓ Done! ]               │
└─────────────────────────────────────────┘
```

**Final step features:**
- Photo shows finished dish
- Tips provide additional guidance
- "✓ Done!" button instead of "Next"
- Still has BACK option

## Screen 7: Done - Return to Preview
```
┌─────────────────────────────────────────┐
│  🎉 Recipe Complete! 🎉               │
│                                         │
│    Tap to return to Recipe               │
│    [ ← Change Recipe ]                  │
│                                         │
│  You made:                              │
│  🍗 CHICKEN PARMESAN 🍝                │
│                                         │
│  Congratulations! 👏👏👏                │
└─────────────────────────────────────────┘
```

## Safety Warnings - Visual Reference
```
Three levels of warning appear automatically:

🔥 DANGER (Red background)
"Be careful! This step is HOT. 
 Watch your hands."
 
├─ Triggers: boil, fry, bake, oven, 
              stove, heat, hot


🔪 WARNING (Yellow background)
"You will use a sharp knife. 
 Be careful of your fingers!"
 
├─ Triggers: cut, slice, chop, dice, knife


⏱️ INFO (Blue background)
"This step takes time. 
 Use the timer button below."
 
├─ Triggers: minute, hour, time, cook, bake
```

## Photo System - Flow Diagram
```
Step displayed on screen
         ↓
Analysis of instruction text
(Look for cooking action keywords)
         ↓
Generate smart search query
Examples:
- "cut" → "chopped vegetables cutting board"
- "fry" → "frying pan cooking"
- "bake" → "oven baking tray"
         ↓
Request from Unsplash API
(with 3-second timeout)
         ↓
    Did it work?
    /            \
   YES            NO
   ↓              ↓
Display         Show emoji +
photo           description
   ↓              ↓
Cache for       (Still can
future use      proceed!)
```

## Voice System - Flow Diagram
```
Step loads on screen
         ↓
Auto-speak instruction
(slower: 0.85x speed)
         ↓
User hears narration
         ↓
If they need to hear again:
Press 🔊 "Read to Me" button
         ↓
Speaks again (no judgment)
         ↓
Can press button as many times
as needed
         ↓
Instruction remains readable
(user can read + listen)
```

## Simple Mode - Comparison
```
SIMPLE MODE (Text-to-Speech Only)
┌─────────────────────────────────────────┐
│  Step 1 of 5                            │
├─────────────────────────────────────────┤
│                                         │
│                 👉                      │
│                                         │
│        PREP & COOK                      │
│                                         │
│   Cut chicken into 1 inch cubes        │
│                                         │
│  [ 🔊 Hear This ]                      │
│                                         │
│  [ ← Back ] [ Next → ]                 │
│                                         │
│  Tips:                                  │
│  - Wash chicken first                  │
│  - Keep knife sharp                    │
└─────────────────────────────────────────┘

DIFFERENCES FROM ENHANCED:
✗ No photo (just emoji)
✗ No safety warnings
✗ No timers
✗ No checklist
✓ Minimal screen (less overwhelming)
✓ Works offline (except voice)
✓ Faster loading
```

## Accessibility Features - Visual
```
LARGE TEXT:
Title: 🔤🔤🔤🔤 48px
Instructions: 🔤🔤🔤 42px
Regular text: 🔤🔤 28px

HIGH CONTRAST:
White #FFFFFF on Green #7fb539
Contrast ratio: 13:1
(WCAG AAA standard: 7:1 minimum)

LARGE BUTTONS:
┌──────────────────┐
│   Next →         │
│  60px tall,      │
│  100% width      │
│  Easy to tap     │
│  12px spacing    │
└──────────────────┘

ICON + TEXT (No color-only):
🔥 DANGER (icon + word + description)
Not just: [Red button]
```

## Mobile/Tablet Optimization
```
PHONE LAYOUT (vertical):
┌─────────────┐
│  Step counter
│
│  Photo
│  (high priority)
│
│  Instruction
│
│  Voice button
│
│  Timer buttons
│
│  Nav buttons
│  (BACK/NEXT)
└─────────────┘

TABLET LAYOUT (landscape):
┌─────────────────────────┐
│  Step counter            │
│  Photo (left) | Text     │
│               | (right)  │
│               | Voice    │
│               | Timer    │
│               | Nav      │
└─────────────────────────┘

TARGET SIZES:
Phone: 60px × 60px minimum
Tablet: 70px × 70px minimum
Spacing: 12px between elements
```

---

This visual guide helps caregivers and patients understand exactly what to expect when using the Enhanced Cognitive Accessibility mode.
