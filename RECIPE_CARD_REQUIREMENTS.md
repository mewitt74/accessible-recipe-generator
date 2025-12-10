# STANDARDIZED RECIPE CARD REQUIREMENTS
## Design Specifications for Aphasia/TBI Accessible Cooking Cards

---

## 📐 PHYSICAL CARD SPECIFICATIONS

### Card Dimensions
- **Size**: 8.5" x 11" (Letter size) - one card per page
- **Orientation**: Portrait
- **Paper**: Matte finish, non-glossy (reduces glare for visual processing)
- **Weight**: 80-110 lb cardstock (durable, wipeable)
- **Margins**: Minimum 0.75" on all sides (safe print area)

### Print Requirements
- **Color Mode**: Full color with exact color specifications
- **Resolution**: 300 DPI minimum
- **Color Contrast Ratio**: 7:1 minimum (WCAG AAA compliance)
- **Ink**: Matte or non-reflective finish preferred

---

## 🎨 COLOR PALETTE (REQUIRED)

### Primary Colors
- **Accent Green**: #7fb539 (RGB: 127, 181, 57)
  - Use for: Headers, section titles, step numbers, footer
  
- **Dark Gray**: #333333 (RGB: 51, 51, 51)
  - Use for: Body text, borders
  
- **White**: #FFFFFF
  - Use for: Background, text on colored backgrounds
  
- **Light Gray**: #F5F5F5
  - Use for: Ingredient boxes, section backgrounds

### Contrast Requirements
- Dark text on white background: Minimum 15:1 ratio
- White text on green background: Minimum 7:1 ratio
- All text must pass WCAG AAA standards (7:1 for normal text)

---

## 📝 TYPOGRAPHY STANDARDS

### Font Family
- **Required**: Arial or Calibri (sans-serif only)
- **Prohibited**: Serif fonts, decorative fonts, script fonts, italics
- **Reasoning**: Sans-serif improves readability for cognitive impairments

### Font Sizes (MINIMUM REQUIREMENTS)
- **Card Title**: 28-32px (22-24pt) - BOLD
- **Card Subtitle**: 18-20px (14-15pt) - Regular weight
- **Section Headers**: 22-24px (17-18pt) - BOLD, UPPERCASE
- **Body Text**: 18px (14pt) minimum - Regular weight
- **Ingredient Amount**: 20px (15pt) - BOLD
- **Ingredient Name**: 18px (14pt) - Regular
- **Step Number**: 24px (18pt) - BOLD
- **Step Title**: 20px (15pt) - BOLD
- **Step Instruction**: 18px (14pt) - Regular
- **Footer Text**: 16-18px (12-14pt)

### Text Formatting Rules
- **Line Spacing**: 1.6-1.8 (minimum 1.5)
- **Paragraph Spacing**: 16-24px between elements
- **Letter Spacing**: Normal (0) - do not condense
- **Word Spacing**: Normal
- **Text Alignment**: Left-aligned (never justified)
- **Text Transform**: UPPERCASE for headers only
- **Bold**: Use for emphasis, headers, key information
- **Italics**: PROHIBITED (reduces readability)
- **Underline**: PROHIBITED (confusing for readers with aphasia)

---

## 🔲 FRONT CARD LAYOUT REQUIREMENTS

### Structure (Top to Bottom)

#### 1. HEADER SECTION (Green background #7fb539)
**Position**: Top of card, full width
**Padding**: 16-20px all sides
**Content**:
- Recipe Title (white text, 28-32px, BOLD)
- Subtitle (white text, 18-20px, optional)

**Requirements**:
- Title: Maximum 60 characters (2 lines max)
- Subtitle: Maximum 80 characters (2 lines max)
- High contrast white on green (7:1 minimum)

#### 2. INGREDIENTS SECTION
**Position**: Below header
**Padding**: 24px all sides
**Content**:
- Section Header: "INGREDIENTS" (22px, BOLD, green #7fb539, UPPERCASE)
- Serving Info: "2 PERSON | SERVES 2" (14px, gray #666)
- Ingredient Grid: 2-3 columns, responsive

**Ingredient Item Specifications**:
- Container: Light gray background #F5F5F5
- Border: 1px solid #CCCCCC
- Padding: 12px
- Spacing: 16px between items
- Layout per item:
  - Amount (20px, BOLD, dark gray)
  - Name (18px, regular, dark gray)
  - Note (14px, italic, gray #666, optional)

**Requirements**:
- Minimum 1 ingredient, maximum 15 ingredients
- Each ingredient on separate card/box
- Amount always displayed first
- Use standard measurements (cups, oz, tbsp, etc.)

#### 3. FOOTER SECTION (Green background #7fb539)
**Position**: Bottom of card, full width
**Padding**: 16px all sides
**Content Layout**: 3 equal columns
- Column 1: "PREP: XX MIN"
- Column 2: "COOK: XX MIN"
- Column 3: "CALORIES: XXX" (optional)

**Requirements**:
- White text on green background
- Label text: 16px, BOLD
- Value text: 24px, BOLD
- Center-aligned in each column

---

## 🔳 BACK CARD LAYOUT REQUIREMENTS

### Structure (Top to Bottom)

#### 1. HEADER SECTION (Green background #7fb539)
**Position**: Top of card, full width
**Padding**: 16-20px
**Content**:
- Recipe Title only (white text, 28-32px, BOLD)

#### 2. EQUIPMENT SECTION (OPTIONAL)
**Position**: Below header, if present
**Padding**: 24px horizontal, 16px vertical
**Content**:
- Section Header: "EQUIPMENT" (22px, BOLD, green, UPPERCASE)
- Bulleted list with checkmarks (✓)

**Equipment Item Specifications**:
- Font: 18px, regular, dark gray
- Line height: 1.8
- Bullet: Green checkmark (✓) 20px, positioned left
- Padding: 8px between items
- Maximum: 10 items

#### 3. INSTRUCTIONS SECTION (REQUIRED)
**Position**: Main content area
**Padding**: 24px all sides
**Content**:
- Section Header: "INSTRUCTIONS" (22px, BOLD, green, UPPERCASE)
- Numbered steps with visual hierarchy

**Step Item Specifications** (CRITICAL):
- **Step Number Circle**:
  - Background: Green #7fb539
  - Size: 50px diameter
  - Font: 24px, white, BOLD, centered
  - Position: Left-aligned, fixed width

- **Step Content Area**:
  - Section Label: 14px, BOLD, green, UPPERCASE (e.g., "PREP", "COOK MAIN")
  - Step Title: 20px, BOLD, dark gray (short, 3-5 words max)
  - Instruction Text: 18px, regular, dark gray, line height 1.8

- **Step Spacing**:
  - Between number and content: 16px
  - Between steps: 24px
  - Bottom border: 1px solid #CCCCCC (except last step)

**INSTRUCTION RULES (ENFORCED)**:
1. **ONE sentence per step** - MANDATORY
2. Maximum 150 characters per instruction
3. Simple, active voice (e.g., "Cut potatoes into cubes.")
4. No compound sentences (no semicolons, no "and then")
5. Avoid pronouns - use specific nouns
6. Use everyday words only
7. Minimum 3 steps, maximum 12 steps per recipe

**Section Categories** (standardized):
- Prep
- Cook Main
- Cook Side
- Make Sauce
- Finish & Serve

#### 4. TIPS SECTION (OPTIONAL)
**Position**: Bottom of instructions
**Background**: Light yellow #FFFBEA
**Border**: 4px left border, gold #FFC107
**Padding**: 16px
**Content**:
- Section Header: "TIPS" (22px, BOLD, green, UPPERCASE)
- Bulleted list with checkmarks

**Tip Specifications**:
- Font: 18px, regular
- Maximum 3 tips
- Maximum 100 characters per tip

---

## 📏 SPACING & LAYOUT STANDARDS

### White Space Requirements
- **Between sections**: 24-32px minimum
- **Around text blocks**: 16px minimum
- **Between list items**: 12px minimum
- **Card edges to content**: 24px minimum (inside margins)
- **Never crowd**: If space is limited, reduce content, not spacing

### Visual Hierarchy Rules
1. Headers always in green
2. Numbers/quantities always in BOLD
3. Consistent use of size to show importance
4. Generous white space around all elements
5. Clear visual separation between sections

---

## ♿ ACCESSIBILITY COMPLIANCE

### Cognitive Accessibility Standards
✅ **Sentence Simplicity**:
- One idea per sentence
- Maximum 15 words per sentence preferred
- Active voice only
- Present tense preferred

✅ **Language Requirements**:
- 6th grade reading level maximum
- Everyday words only
- Avoid jargon, abbreviations
- Spell out measurements first use

✅ **Visual Clarity**:
- High contrast (WCAG AAA 7:1)
- Large, clear fonts (18px minimum)
- Ample white space
- No background patterns or textures
- Matte finish to reduce glare

✅ **Consistency**:
- Same layout every recipe
- Same colors every time
- Same section order always
- Same typography throughout
- Predictable structure aids learning

### Section 508 Compliance
- Sans-serif fonts required
- Minimum 4.8mm character height for critical info
- Contrast ratios exceed requirements
- Content reflows without horizontal scrolling
- Text spacing adjustable without loss of content

---

## 🚫 PROHIBITED ELEMENTS

### Visual Prohibitions
❌ Decorative fonts or script
❌ Italic text (reduces clarity)
❌ Underlined text (confusing)
❌ ALL CAPS for body text (hard to read)
❌ Colored text on colored backgrounds
❌ Low contrast combinations
❌ Background images or patterns
❌ Glossy paper finish
❌ Text over photos
❌ Multiple columns for instructions
❌ Centered or justified text alignment

### Content Prohibitions
❌ Compound sentences in instructions
❌ Complex vocabulary or jargon
❌ Abbreviations without definition
❌ Pronoun references ("it", "them")
❌ Multi-step instructions in one line
❌ Passive voice constructions
❌ More than 12 steps total
❌ Steps longer than 150 characters

---

## ✅ VALIDATION CHECKLIST

Before finalizing any recipe card, verify:

### Front Card
- [ ] Title under 60 characters
- [ ] All fonts are Arial/Calibri
- [ ] Ingredient amounts are BOLD
- [ ] Text size minimum 18px
- [ ] Green header and footer exact color match
- [ ] White background, no patterns
- [ ] Contrast ratio 7:1 or higher
- [ ] All text left-aligned
- [ ] Adequate white space (24px minimum)
- [ ] Print-safe margins (0.75" minimum)

### Back Card
- [ ] Each instruction is ONE sentence only
- [ ] No instruction exceeds 150 characters
- [ ] Step numbers in green circles
- [ ] Font sizes meet minimums
- [ ] Section labels are uppercase
- [ ] Line spacing 1.6-1.8
- [ ] Active voice used throughout
- [ ] Simple, everyday words only
- [ ] Steps have clear section categories
- [ ] Visual hierarchy is consistent

### Accessibility
- [ ] WCAG AAA contrast (7:1) achieved
- [ ] No italics used anywhere
- [ ] Sans-serif font throughout
- [ ] Matte paper specified
- [ ] Text spacing minimum 1.5
- [ ] Consistent layout matches template
- [ ] One idea per sentence
- [ ] 6th grade reading level or below

---

## 📊 SAMPLE MEASUREMENTS REFERENCE

### Standardized Units
Use these consistently:
- **Volume**: cup, tbsp, tsp, oz, ml
- **Weight**: oz, lb, g, kg
- **Temperature**: °F (spell out "degrees" on first use)
- **Time**: minutes (spell out on first use)
- **Size**: inch, cm (for cutting dimensions)

### Number Format
- Use numerals for all quantities: "2 cups" not "two cups"
- Spell out fractions: "1/2 cup" or "½ cup"
- Include spaces: "12 oz" not "12oz"

---

## 🎯 QUALITY ASSURANCE

### Testing Requirements
Each card must be tested with:
1. **Readability test**: 6th grade level or below
2. **Contrast checker**: WCAG AAA compliance
3. **Print preview**: Verify at actual size
4. **User testing**: Person with aphasia reviews if possible

### Revision Criteria
Revise if:
- Any sentence exceeds one complete thought
- Reading level above 6th grade
- Contrast ratio below 7:1
- Font size below 18px anywhere
- White space insufficient
- Colors don't match specifications
- Layout inconsistent with template

---

## 📦 DELIVERABLE FORMAT

### Digital Files
- **Format**: PDF/A (archival quality)
- **Resolution**: 300 DPI
- **Color Space**: RGB for screen, CMYK for print
- **Fonts**: Embedded
- **File Naming**: `recipe-name-front.pdf` and `recipe-name-back.pdf`

### Print-Ready Specifications
- Bleed: 0.125" if full-bleed design
- Crop marks: Optional
- Color profile: sRGB or Adobe RGB
- PDF version: 1.7 or higher

---

## 📚 REFERENCES

These requirements are based on:
- WCAG 2.1 AAA Accessibility Guidelines
- Section 508 Standards
- Aphasia-Friendly Print Material Guidelines (Stroke Association)
- UNC Aphasia-Friendly Printed Material Guidelines
- Cognitive Accessibility Best Practices
- Research on TBI and aphasia rehabilitation materials

---

**Document Version**: 1.0
**Last Updated**: December 2025
**Purpose**: Standardized recipe card generation for aphasia/TBI patients
**Compliance**: WCAG AAA, Section 508, Aphasia-friendly design standards
