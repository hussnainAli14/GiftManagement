const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../node_modules/react-native-vector-icons/Fonts');
const androidDestDir = path.join(__dirname, '../android/app/src/main/assets/fonts');
const iosDestDir = path.join(__dirname, '../ios/GiftManagement');

// Ensure destination directories exist
if (!fs.existsSync(androidDestDir)) {
  fs.mkdirSync(androidDestDir, { recursive: true });
}

// Copy fonts to Android
if (fs.existsSync(sourceDir)) {
  const fontFiles = fs.readdirSync(sourceDir).filter(file => file.endsWith('.ttf'));
  
  console.log('Copying vector icon fonts to Android...');
  fontFiles.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(androidDestDir, file);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`  ✓ Copied ${file}`);
  });
  console.log(`Successfully copied ${fontFiles.length} font files to Android`);
} else {
  console.error('Source directory not found:', sourceDir);
  console.error('Please run: npm install');
  process.exit(1);
}

console.log('\nSetup complete!');
console.log('Next steps:');
console.log('1. For iOS: Run "cd ios && pod install"');
console.log('2. Rebuild your app');
