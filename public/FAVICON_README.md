# Favicon Setup Guide

## 📦 Required Files

Place the LevelUp logo in the following sizes in the `/public` directory:

### Standard Favicons
- `favicon.ico` - 32x32 or 16x16 (multi-size ICO)
- `favicon-16x16.png` - 16x16 PNG
- `favicon-32x32.png` - 32x32 PNG

### Apple Touch Icons
- `apple-touch-icon.png` - 180x180 PNG (for iOS home screen)

### Android Chrome Icons
- `android-chrome-192x192.png` - 192x192 PNG
- `android-chrome-512x512.png` - 512x512 PNG

## 🎨 Logo Source

Use the LevelUp logo from:
- `image_0_84ff2985.png` (provided)
- URL: `https://cdn.rmz.gg/store/favicon/49e54ffd864248c79e3389c614d1cecb1d834a2f.png`

## 🔧 How to Generate

### Option 1: Online Tool (Easiest)
1. Visit https://realfavicongenerator.net/
2. Upload the LevelUp logo PNG
3. Download the generated package
4. Extract all files to `/public` directory

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Ubuntu/Debian: sudo apt-get install imagemagick
# macOS: brew install imagemagick

# Generate favicons from source image
convert logo.png -resize 16x16 favicon-16x16.png
convert logo.png -resize 32x32 favicon-32x32.png
convert logo.png -resize 180x180 apple-touch-icon.png
convert logo.png -resize 192x192 android-chrome-192x192.png
convert logo.png -resize 512x512 android-chrome-512x512.png

# Create ICO file
convert logo.png -define icon:auto-resize=16,32,48 favicon.ico
```

### Option 3: Using Sharp (Node.js)
```javascript
const sharp = require('sharp');

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

sizes.forEach(({ size, name }) => {
  sharp('logo.png')
    .resize(size, size)
    .toFile(`public/${name}`, (err, info) => {
      if (err) console.error(err);
      else console.log(`✓ ${name} created`);
    });
});
```

## ✅ Verification

After adding the files, verify they work:
1. Build the project: `npm run build`
2. Check browser tab for favicon
3. Test on mobile by adding to home screen
4. Check manifest at `/site.webmanifest`

## 📱 Mobile Support

The setup includes:
- PWA support via `site.webmanifest`
- iOS home screen icons
- Android adaptive icons
- Theme color for mobile browsers
- Proper viewport settings

## 🎯 Colors Used

- Primary: `#8b5cf6` (Purple)
- Secondary: `#3b82f6` (Blue)
- Based on LevelUp brand colors

