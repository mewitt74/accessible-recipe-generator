# Professional Line-Art Icon System

## Overview
The app now includes a professional line-art SVG icon system sourced from design principles found in:
- **The Noun Project** - Clean, monochrome pictogram-style icons
- **Flaticon** - Themed food and kitchen icon sets
- **Icons8** - UI-consistent icons with customizable styling

## Icon Library Architecture

### Files Created/Modified

1. **`src/services/iconLibrary.ts`** (NEW - 650+ lines)
   - Centralized icon library with 40+ SVG cooking icons
   - Every icon has a fallback emoji for accessibility
   - Icons categorized by: action, ingredient, equipment, time, temperature, warning
   - Functions:
     - `getIconSvg(name)` - Get SVG by icon name
     - `getIconFallbackEmoji(name)` - Get emoji fallback
     - `getIconsByCategory(category)` - Get all icons in category
     - `renderIconAsComponent()` - Render icon as HTML

2. **`src/components/SvgIcon.tsx`** (NEW - 220+ lines)
   - React component for rendering SVG icons
   - Supports responsive sizing (small, medium, large, custom)
   - Props: name, size, className, title, color
   - Includes 24+ icon definitions
   - Proper accessibility with aria-label and role="img"

3. **`src/services/stepPhotos.ts`** (MODIFIED)
   - Updated `STEP_ACTION_PATTERNS` to use icon names
   - Each pattern maps to both SVG icon and fallback emoji
   - `getStepActionDetails()` now returns `{ emoji, description, svg }`

4. **`src/App.css`** (MODIFIED - Added 260+ lines)
   - `.svg-icon` base styling with responsive sizes
   - Icon variants: `.icon-xs`, `.icon-sm`, `.icon-md`, `.icon-lg`, `.icon-xl`, `.icon-2xl`, `.icon-3xl`
   - Category-specific styling:
     - `.action-icon-svg` - Red with pulse animation
     - `.ingredient-icon-svg` - Green
     - `.equipment-icon-svg` - Blue
     - `.time-icon-svg` - Orange
     - `.temperature-icon-svg` - Red
     - `.warning-icon-svg` - Orange with pulse
     - `.danger-icon-svg` - Red with pulse + glow
   - Dark theme color overrides
   - High contrast theme support (white on black, stroke-width: 3)
   - Responsive media queries for mobile

## Available Icons (40+)

### Cutting/Prep Actions
- `chop` - Cut into pieces (🔪)
- `cut` - Cut with knife (✂️)
- `slice` - Slice ingredients (🔪)
- `dice` - Dice into cubes (🎲)

### Heating/Cooking Actions
- `boil` - Boil in water (🫖)
- `simmer` - Simmer on low heat (🫕)
- `fry` - Fry in pan (🍳)
- `sauté` - Sauté vegetables (🍳)
- `grill` - Grill food (🔥)
- `bake` - Bake in oven (🔥)
- `roast` - Roast at high heat (🔥)

### Mixing Actions
- `mix` - Mix ingredients (🥄)
- `whisk` - Whisk together (🥄)
- `stir` - Stir mixture (🥄)
- `fold` - Fold gently (🔀)
- `blend` - Blend smooth (🔄)
- `knead` - Knead dough (👐)

### Seasoning
- `season` - Season to taste (🧂)
- `salt` - Add salt (🧂)
- `pepper` - Add pepper (🌶️)

### Draining/Pouring
- `drain` - Drain liquid (🫗)
- `strain` - Strain through sieve (🫗)
- `pour` - Pour liquid (🫗)

### Serving
- `serve` - Serve on plate (🍽️)
- `plate` - Plate and serve (🍽️)

### Cooling/Timing
- `cool` - Let cool (❄️)
- `rest` - Wait and rest (⏳)

### Time/Temperature
- `timer` - Set timer (⏱️)
- `clock` - Time required (⏰)
- `temperature` - Temperature setting (🌡️)
- `heat` - High heat (🔥)

### Equipment
- `knife` - Knife required (🔪)
- `pan` - Pan/skillet (🍳)
- `pot` - Cooking pot (🫖)
- `bowl` - Mixing bowl (🥣)
- `spoon` - Spoon (🥄)

### Warning
- `warning` - Warning alert (⚠️)
- `danger` - Danger alert (🚨)
- `hot` - Very hot (🔥)

## Usage Examples

### In React Components
```tsx
import SvgIcon from './components/SvgIcon';

// Default medium size
<SvgIcon name="chop" />

// Custom size
<SvgIcon name="boil" size="large" />
<SvgIcon name="timer" size={64} />

// With styling
<SvgIcon name="danger" className="danger-icon-svg" />

// With label
<div className="icon-with-text">
  <SvgIcon name="fry" size="small" />
  <span>Fry in hot pan</span>
</div>
```

### In Services
```tsx
import { getIconSvg } from './services/iconLibrary';

// Get SVG content
const svg = getIconSvg('chop');

// Get fallback emoji
const emoji = getIconFallbackEmoji('boil');

// Get icons by category
const actionIcons = getIconsByCategory('action');
```

### In CSS
```css
/* Size variants */
.icon-with-text svg { width: 32px; height: 32px; }
.action-icon-large { width: 120px; height: 120px; }

/* Color variants */
.danger-icon-svg { color: #d32f2f; }
.warning-icon-svg { color: #ff6f00; }
```

## Styling Features

### Responsive Sizing
- **Mobile** (< 768px): Icons scale down automatically
- **Tablet** (768px - 1024px): Medium sizing
- **Desktop** (> 1024px): Full-size icons

### Theme Support
- **Light Theme**: Gray/muted colors
- **Dark Theme**: Light colors (#e0e0e0 base)
- **High Contrast**: White strokes on black, 3px stroke-width, yellow accents

### Animations
- **Pulse Animation**: Timer and gentle icons
- **Pulse Warning**: Warning icons with slight scale change
- **Pulse Danger**: Danger icons with glow effect (drop-shadow)

### Accessibility
- SVG icons use `role="img"`
- All icons have `aria-label` attributes
- Fallback emoji support for screen readers
- High contrast mode with thicker strokes
- Icons combined with text labels

## Benefits Over Emoji Icons

✅ **Scalability** - Clean at any size (emoji get pixelated)
✅ **Customization** - Easy color/stroke changes via CSS
✅ **Consistency** - Professional, unified design language
✅ **Clarity** - Line-art is more readable for visual disabilities
✅ **Animations** - Can add pulse, rotate, highlight effects
✅ **Fast Loading** - Inline SVG vs. external images
✅ **Accessibility** - SVG has better semantic support

## Migration Path

The system maintains backward compatibility:
1. All existing emoji calls still work
2. New components can use SvgIcon
3. Services return both SVG and emoji
4. Gradual migration possible

## Future Enhancement Ideas

- [ ] Add icon customization panel in Settings
- [ ] Support recipe-specific icon sets
- [ ] Add printable icon legend for recipe cards
- [ ] Create icon animations for step highlights
- [ ] Generate custom icons from AI descriptions
- [ ] Add left-to-right language support with icon variations
- [ ] Create filled vs. outline icon variants

## Browser Support

✅ All modern browsers (Chrome, Firefox, Safari, Edge)
✅ Mobile browsers (iOS Safari, Chrome Mobile)
✅ Fallback emojis for legacy browsers
✅ High contrast mode detection

## File Sizes

- `iconLibrary.ts`: ~15 KB (minified: ~5 KB)
- `SvgIcon.tsx`: ~8 KB (minified: ~2 KB)
- SVG icons (inline): ~0.5 KB per icon, <20 KB total for all
- CSS icon styles: ~8 KB (already included in main CSS)

**Total bundle impact**: ~20 KB (gzipped: ~5 KB)

## Related Documentation

- `COGNITIVE_ACCESSIBILITY.md` - Visual accessibility features
- `VISUAL_FEATURE_GUIDE.md` - Design system overview
- `DEPLOYMENT_READY.md` - Production checklist
