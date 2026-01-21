/**
 * Font Setup Script
 * This script helps set up Inter fonts for React Native
 * Run: node scripts/setup-fonts.js
 */

const fs = require('fs');
const path = require('path');

const fontsSourceDir = path.join(__dirname, '../src/assets/fonts/Inter/static');
const androidFontsDir = path.join(__dirname, '../android/app/src/main/assets/fonts');
const reactNativeFontsDir = path.join(__dirname, '../src/assets/fonts/Inter/fonts');

// Font mapping: source file name -> target file name
const fontMapping = {
  'Inter_18pt-Regular.ttf': 'Inter-Regular.ttf',
  'Inter_18pt-Medium.ttf': 'Inter-Medium.ttf',
  'Inter_18pt-SemiBold.ttf': 'Inter-SemiBold.ttf',
  'Inter_18pt-Bold.ttf': 'Inter-Bold.ttf',
  'Inter_18pt-Light.ttf': 'Inter-Light.ttf',
  'Inter_18pt-ExtraLight.ttf': 'Inter-ExtraLight.ttf',
  'Inter_18pt-Thin.ttf': 'Inter-Thin.ttf',
  'Inter_18pt-ExtraBold.ttf': 'Inter-ExtraBold.ttf',
  'Inter_18pt-Black.ttf': 'Inter-Black.ttf',
};

function setupAndroidFonts() {
  console.log('Setting up Android fonts...');
  
  // Create fonts directory if it doesn't exist
  if (!fs.existsSync(androidFontsDir)) {
    fs.mkdirSync(androidFontsDir, { recursive: true });
    console.log(`Created directory: ${androidFontsDir}`);
  }

  // Copy and rename font files
  let copiedCount = 0;
  for (const [sourceFile, targetFile] of Object.entries(fontMapping)) {
    const sourcePath = path.join(fontsSourceDir, sourceFile);
    const targetPath = path.join(androidFontsDir, targetFile);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✓ Copied ${sourceFile} → ${targetFile}`);
      copiedCount++;
    } else {
      console.warn(`⚠ Source file not found: ${sourceFile}`);
    }
  }

  console.log(`\n✓ Android fonts setup complete! Copied ${copiedCount} fonts.`);
  console.log('Next steps:');
  console.log('  1. Rebuild your Android app: npm run android');
}

function setupReactNativeFonts() {
  console.log('\nSetting up React Native fonts directory...');
  
  // Create fonts directory for React Native asset linking
  if (!fs.existsSync(reactNativeFontsDir)) {
    fs.mkdirSync(reactNativeFontsDir, { recursive: true });
    console.log(`Created directory: ${reactNativeFontsDir}`);
  }

  // Copy and rename font files for React Native
  let copiedCount = 0;
  for (const [sourceFile, targetFile] of Object.entries(fontMapping)) {
    const sourcePath = path.join(fontsSourceDir, sourceFile);
    const targetPath = path.join(reactNativeFontsDir, targetFile);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✓ Copied ${sourceFile} → ${targetFile}`);
      copiedCount++;
    } else {
      console.warn(`⚠ Source file not found: ${sourceFile}`);
    }
  }

  console.log(`\n✓ React Native fonts directory setup complete! Copied ${copiedCount} fonts.`);
}

function checkFontFiles() {
  console.log('Checking font files...\n');
  
  const sourceFiles = fs.readdirSync(fontsSourceDir).filter(file => file.endsWith('.ttf'));
  console.log(`Found ${sourceFiles.length} font files in source directory`);
  
  const requiredFonts = Object.keys(fontMapping);
  const missingFonts = requiredFonts.filter(font => !sourceFiles.includes(font));
  
  if (missingFonts.length > 0) {
    console.warn('\n⚠ Missing font files:');
    missingFonts.forEach(font => console.warn(`  - ${font}`));
  } else {
    console.log('✓ All required font files found!');
  }
}

// Main execution
console.log('Inter Font Setup Script\n');
console.log('='.repeat(50));

checkFontFiles();
console.log('\n' + '='.repeat(50));

// Setup React Native fonts directory
setupReactNativeFonts();

// Check if Android directory exists
if (fs.existsSync(path.join(__dirname, '../android'))) {
  setupAndroidFonts();
} else {
  console.log('\n⚠ Android directory not found. Skipping Android font setup.');
}

console.log('\n' + '='.repeat(50));
console.log('\nNote: For iOS, fonts are automatically linked via react-native.config.js');
console.log('Make sure to run: cd ios && pod install && cd ..');
console.log('\n⚠ IMPORTANT: After running this script, you need to:');
console.log('  1. Stop Metro bundler');
console.log('  2. Clean build:');
console.log('     - Android: cd android && ./gradlew clean && cd ..');
console.log('     - iOS: cd ios && rm -rf build && cd ..');
console.log('  3. Rebuild the app completely');
