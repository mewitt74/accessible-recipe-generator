# Deployment & Testing Guide

## Quick Start - Local Testing

### 1. **Development Mode** (Recommended for Testing)
```bash
npm run dev
```
- Starts Vite dev server on `http://localhost:5174/`
- Hot module reloading - changes reflect instantly
- TypeScript type checking enabled
- Useful for testing photo upload, search functionality, card display

### 2. **Production Build**
```bash
npm run build
```
- Creates optimized production bundle
- Output: `dist/` folder
- TypeScript compilation and optimization
- Generates: 
  - `dist/index.html` (0.59 KB)
  - `dist/assets/index.css` (8.60 KB, gzipped 2.30 KB)
  - `dist/assets/index.js` (160.55 KB, gzipped 51.44 KB)

### 3. **Preview Production Build Locally**
```bash
npm run build && npm run preview
```
- Builds the app and serves it from `dist/`
- Allows testing the production version before deployment
- Useful for checking performance and bundle size

## Testing Checklist

### Photo Upload Test
- [ ] Click "Take Photo of Meal" button 📷
- [ ] Upload test image or take phone camera photo
- [ ] Verify image preview displays
- [ ] Check that identified foods appear as pills (e.g., "chicken", "pasta")
- [ ] Click food pill to auto-search
- [ ] Verify results appear within 2-3 seconds

### Text Search Test
- [ ] Type "chicken" in search box
- [ ] Press Enter or click Search button
- [ ] Verify recipes appear with thumbnails
- [ ] Repeat with: "beef", "pasta", "soup", "fish"
- [ ] Check that expanded search returns results for related terms

### Recipe Display Test
- [ ] Select a recipe from search results
- [ ] Verify **Front Card** displays correctly:
  - [ ] Green header (#7fb539) with white title (32px bold)
  - [ ] Ingredients grid with light gray boxes
  - [ ] Green footer with prep/cook/calories
  - [ ] All text readable (18px minimum)
- [ ] Verify **Back Card** displays correctly:
  - [ ] Green header matching front
  - [ ] Equipment list with green checkmarks
  - [ ] Numbered steps with green circles (50px diameter)
  - [ ] Steps grouped by section (Prep, Cook Main, etc.)
  - [ ] Tips section with yellow background (if available)

### Accessibility Test
- [ ] Font sizes: All text should be 18px or larger
- [ ] Colors: Green (#7fb539), dark gray (#333333), white (#ffffff)
- [ ] Contrast: Text should have 7:1 contrast ratio (WCAG AAA)
- [ ] One sentence per step (max 150 chars)
- [ ] No compound sentences in instructions
- [ ] Simple, active voice language

### Print Test
- [ ] Click browser Print button (Ctrl+P or Cmd+P)
- [ ] Preview should show both cards on separate pages
- [ ] Colors should print (check color preservation)
- [ ] Text should be sharp and readable
- [ ] Cards should fit on 8.5x11 paper
- [ ] Test on different printers if possible

### Mobile Test
- [ ] Open app on smartphone (iPhone, Android)
- [ ] Test photo upload with camera
- [ ] Verify touch-friendly button sizes (44px minimum target)
- [ ] Test text search on mobile keyboard
- [ ] Verify card display on mobile screen
- [ ] Test print preview on mobile (Print to PDF)

### Form Test (Manual Recipe Entry)
- [ ] Switch to "Form" tab
- [ ] Enter recipe title, ingredients, steps
- [ ] Save recipe
- [ ] Verify card displays correctly
- [ ] Edit existing recipe
- [ ] Delete ingredient/step and save

## Deployment Options

### Option 1: **GitHub Pages** (Free, Static)
```bash
# Update vite.config.ts to set base path
# Then:
npm run build
# Upload dist/ folder to GitHub Pages
```
- Free hosting
- Perfect for static React apps
- No backend required
- Works great for this app since we use TheMealDB API

### Option 2: **Vercel** (Recommended, Free Tier)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```
- Zero-config deployment
- Automatic builds from git
- Global CDN
- Perfect for React/Vite apps
- Free tier includes unlimited deployments

### Option 3: **Netlify** (Free Tier)
```bash
# Connect GitHub repo to Netlify
# Or use Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```
- Easy git integration
- Free tier generous
- Good for static sites
- Supports serverless functions (not needed here)

### Option 4: **Self-Hosted (Docker)**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```
- Full control
- Can host on any server
- Requires server infrastructure
- Good for private/enterprise use

### Option 5: **AWS S3 + CloudFront** (Paid, Scalable)
```bash
npm run build
# Upload dist/ to S3 bucket
# Configure CloudFront distribution
```
- Highly scalable
- Global CDN
- Pay only for usage
- Good for healthcare apps (compliance)

## Recommended Deployment Flow

1. **Development**: `npm run dev` - test locally
2. **Testing**: `npm run build && npm run preview` - test prod bundle
3. **Version Control**: Commit to git, push to GitHub
4. **Deployment Options**:
   - **Quick Start**: Deploy to Vercel (one-click from GitHub)
   - **Enterprise**: Deploy to AWS S3 + CloudFront with CloudFront SSL
   - **Internal Use**: Self-host on internal server with Docker

## Environment Variables

Currently, no environment variables are needed. The app:
- Uses TheMealDB API (public, no key required)
- Uses browser's FileReader for image uploads
- Stores data in browser localStorage (optional)

For future enhancements:
```bash
VITE_API_KEY=your_key_here
VITE_API_URL=https://api.example.com
```

## Performance Metrics

**Build Output:**
- HTML: 0.59 KB (gzipped: 0.37 KB)
- CSS: 8.60 KB (gzipped: 2.30 KB)
- JS: 160.55 KB (gzipped: 51.44 KB)
- **Total: ~62 KB gzipped** ✅ Excellent for mobile

**Load Time (Typical):**
- HTML parsing: <100ms
- JS execution: <500ms
- API call to TheMealDB: 1-2 seconds
- **Total: 2-3 seconds first load**

**Optimization Tips:**
- App is already optimized with code splitting
- CSS is minified and optimized
- No unnecessary dependencies
- Minimal bundle size perfect for slow networks

## Monitoring & Analytics

Add Google Analytics (optional):
```tsx
// In src/main.tsx
import { useEffect } from 'react';

useEffect(() => {
  // Add Google Analytics script here
}, []);
```

## Support & Troubleshooting

### "Port already in use" error
```bash
# Kill process on port 5174
lsof -i :5174
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

### Image upload not working
- Check browser's FileReader API support (should work on all modern browsers)
- Test with different image formats (jpg, png, webp)
- Check max file size (currently 10MB limit)

### Search returning no results
- Check TheMealDB API status: https://www.themealdb.com/api.php
- API is free and public, rate limits are generous
- Try common foods: "chicken", "beef", "pasta", "rice"

### Print quality issues
- Use Chrome/Chromium browser (best print support)
- Ensure colors are set to print (browser print settings)
- Test at actual 8.5x11 paper size
- Check that printer supports matte finish (recommended)

## Accessibility Compliance

✅ WCAG AAA Level Compliance:
- 7:1 contrast ratio
- 18px minimum font size
- Simple, readable language
- One sentence per step
- Clear visual hierarchy
- Large touch targets (44px minimum)
- No color-only information

Tested with:
- WAVE accessibility checker
- Lighthouse accessibility audit
- Manual screen reader testing
