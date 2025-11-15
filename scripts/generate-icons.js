#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 *
 * This script helps you generate PWA icons from a source image.
 *
 * Usage:
 * 1. Install sharp: npm install sharp --save-dev
 * 2. Place your source icon (512x512 or larger) at public/icon-source.png
 * 3. Run: node scripts/generate-icons.js
 *
 * This will generate:
 * - icon-192x192.png
 * - icon-512x512.png
 * - apple-touch-icon.png (180x180)
 * - favicon.ico (32x32)
 */

const fs = require('fs');
const path = require('path');

console.log('📱 PWA Icon Generator\n');

// Check if sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.log('❌ Error: sharp is not installed');
  console.log('\n💡 Install it with: npm install sharp --save-dev\n');
  process.exit(1);
}

const sharp = require('sharp');

const SIZES = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon.ico', size: 32 }
];

const SOURCE_PATH = path.join(__dirname, '../public/icon-source.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

// Check if source file exists
if (!fs.existsSync(SOURCE_PATH)) {
  console.log('❌ Error: Source icon not found');
  console.log(`\n💡 Please add a 512x512px PNG image at:\n   ${SOURCE_PATH}\n`);

  // Create a simple placeholder
  console.log('📝 Creating placeholder icons...\n');
  createPlaceholderIcons();
  process.exit(0);
}

// Generate icons
async function generateIcons() {
  try {
    console.log('🎨 Generating icons from source image...\n');

    for (const { name, size } of SIZES) {
      const outputPath = path.join(OUTPUT_DIR, name);

      await sharp(SOURCE_PATH)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 37, g: 99, b: 235, alpha: 1 } // Primary color
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${name} (${size}x${size})`);
    }

    console.log('\n🎉 All icons generated successfully!\n');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

/**
 * Create simple SVG placeholder icons
 */
function createPlaceholderIcons() {
  const sizes = [
    { file: 'icon-192x192.png', size: 192 },
    { file: 'icon-512x512.png', size: 512 },
    { file: 'apple-touch-icon.png', size: 180 }
  ];

  // Create a simple colored square as placeholder
  const createSvg = (size) => `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#2563eb" rx="${size * 0.15}"/>
      <path d="M${size * 0.3} ${size * 0.5}L${size * 0.45} ${size * 0.65}L${size * 0.7} ${size * 0.35}"
            stroke="white" stroke-width="${size * 0.08}" stroke-linecap="round"
            stroke-linejoin="round" fill="none"/>
    </svg>
  `.trim();

  // Since we can't easily create PNG without sharp, create SVG versions
  console.log('⚠️  Creating SVG placeholders instead');
  console.log('💡 For production, please generate proper PNG icons\n');

  sizes.forEach(({ file, size }) => {
    const svgFile = file.replace('.png', '.svg');
    const outputPath = path.join(OUTPUT_DIR, svgFile);
    fs.writeFileSync(outputPath, createSvg(size));
    console.log(`✅ Created ${svgFile}`);
  });

  console.log('\n📌 Next steps:');
  console.log('1. Install sharp: npm install sharp --save-dev');
  console.log('2. Add icon-source.png (512x512) to public/');
  console.log('3. Run this script again: node scripts/generate-icons.js\n');
}

// Run the generator
generateIcons();
