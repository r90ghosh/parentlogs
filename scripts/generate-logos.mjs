/**
 * Generate all logo PNG assets from SVG source.
 * Run: node scripts/generate-logos.mjs
 * Requires: sharp (installed temporarily via npx)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Dynamic import of sharp
const sharp = (await import('sharp')).default

// SVG sources
const iconWithBgSvg = readFileSync(join(root, 'apps/web/public/images/logo-icon.svg'))
const iconTransparentSvg = readFileSync(join(root, 'apps/web/public/images/logo-transparent.svg'))

// Create a splash variant (smaller icon, more padding, with dark bg)
function createSplashSvg(size) {
  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#12100e"/>
  <defs>
    <linearGradient id="parent" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#d4a853"/>
      <stop offset="50%" stop-color="#c4703f"/>
      <stop offset="100%" stop-color="#a85a2a"/>
    </linearGradient>
    <linearGradient id="child" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d4a853"/>
      <stop offset="100%" stop-color="#c4703f"/>
    </linearGradient>
  </defs>
  <g transform="translate(${size/2}, ${size * 0.45}) scale(0.6)">
    <circle cx="-28" cy="-100" r="52" fill="none" stroke="url(#parent)" stroke-width="16"/>
    <path d="M-76 -38 Q-100 80 -52 164 Q-4 240 88 228" fill="none" stroke="url(#parent)" stroke-width="16" stroke-linecap="round"/>
    <circle cx="52" cy="48" r="34" fill="none" stroke="url(#child)" stroke-width="13" opacity="0.85"/>
    <path d="M24 -52 Q76 -12 64 52" fill="none" stroke="url(#parent)" stroke-width="10" stroke-linecap="round" opacity="0.45"/>
    <circle cx="12" cy="-4" r="8" fill="#d4a853" opacity="0.55"/>
  </g>
</svg>`)
}

// Create Android foreground (icon centered with safe zone padding ~30%)
function createAndroidForegroundSvg(size) {
  const padding = size * 0.2
  const innerSize = size - padding * 2
  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="parent" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#d4a853"/>
      <stop offset="50%" stop-color="#c4703f"/>
      <stop offset="100%" stop-color="#a85a2a"/>
    </linearGradient>
    <linearGradient id="child" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d4a853"/>
      <stop offset="100%" stop-color="#c4703f"/>
    </linearGradient>
  </defs>
  <g transform="translate(${size/2}, ${size * 0.45}) scale(${innerSize/512})">
    <circle cx="-28" cy="-100" r="52" fill="none" stroke="url(#parent)" stroke-width="16"/>
    <path d="M-76 -38 Q-100 80 -52 164 Q-4 240 88 228" fill="none" stroke="url(#parent)" stroke-width="16" stroke-linecap="round"/>
    <circle cx="52" cy="48" r="34" fill="none" stroke="url(#child)" stroke-width="13" opacity="0.85"/>
    <path d="M24 -52 Q76 -12 64 52" fill="none" stroke="url(#parent)" stroke-width="10" stroke-linecap="round" opacity="0.45"/>
    <circle cx="12" cy="-4" r="8" fill="#d4a853" opacity="0.55"/>
  </g>
</svg>`)
}

// Android monochrome (white on transparent)
function createMonochromeSvg(size) {
  const padding = size * 0.2
  const innerSize = size - padding * 2
  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${size/2}, ${size * 0.45}) scale(${innerSize/512})">
    <circle cx="-28" cy="-100" r="52" fill="none" stroke="white" stroke-width="16"/>
    <path d="M-76 -38 Q-100 80 -52 164 Q-4 240 88 228" fill="none" stroke="white" stroke-width="16" stroke-linecap="round"/>
    <circle cx="52" cy="48" r="34" fill="none" stroke="white" stroke-width="13" opacity="0.85"/>
    <path d="M24 -52 Q76 -12 64 52" fill="none" stroke="white" stroke-width="10" stroke-linecap="round" opacity="0.45"/>
    <circle cx="12" cy="-4" r="8" fill="white" opacity="0.55"/>
  </g>
</svg>`)
}

async function generate(svg, outputPath, size) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(outputPath)
  console.log(`  ✓ ${outputPath} (${size}x${size})`)
}

async function main() {
  console.log('Generating logo assets from SVG...\n')

  // Web app assets
  console.log('Web app:')
  await generate(iconWithBgSvg, join(root, 'apps/web/public/images/logo.png'), 1024)
  await generate(iconWithBgSvg, join(root, 'apps/web/public/images/logo-512.png'), 512)
  await generate(iconWithBgSvg, join(root, 'apps/web/public/images/logo-192.png'), 192)
  await generate(iconWithBgSvg, join(root, 'apps/web/public/images/logo-180.png'), 180)

  // Favicon (48x48)
  await generate(iconWithBgSvg, join(root, 'apps/web/public/images/favicon.png'), 48)

  // Mobile app assets
  console.log('\nMobile app:')
  await generate(iconWithBgSvg, join(root, 'apps/mobile/assets/images/icon.png'), 1024)
  await generate(createSplashSvg(1024), join(root, 'apps/mobile/assets/images/splash-icon.png'), 1024)
  await generate(iconWithBgSvg, join(root, 'apps/mobile/assets/images/favicon.png'), 48)
  await generate(createAndroidForegroundSvg(1024), join(root, 'apps/mobile/assets/images/android-icon-foreground.png'), 1024)
  await generate(createMonochromeSvg(1024), join(root, 'apps/mobile/assets/images/android-icon-monochrome.png'), 1024)

  // Android background is just a solid color - create a simple dark square
  const androidBg = Buffer.from(`<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><rect width="1024" height="1024" fill="#12100e"/></svg>`)
  await generate(androidBg, join(root, 'apps/mobile/assets/images/android-icon-background.png'), 1024)

  console.log('\n✅ All logo assets generated!')
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
