# Font Setup Guide

This project uses the Inter font family. Follow these steps to ensure fonts are properly loaded:

## Quick Setup

Run the font setup script to automatically configure fonts:

```bash
npm run setup-fonts
```

Then rebuild your app:
```bash
# For Android
npm run android

# For iOS
cd ios && pod install && cd ..
npm run ios
```

## How It Works

1. **react-native.config.js** - Configures font assets for automatic linking
2. **setup-fonts script** - Copies and renames font files for Android
3. **iOS** - Fonts are automatically linked via React Native's asset system

## Font Names Used in Code

The app uses these font family names (mapped from Inter_18pt-*.ttf files):
- `Inter-Regular`
- `Inter-Medium`
- `Inter-SemiBold`
- `Inter-Bold`
- `Inter-Light`
- `Inter-ExtraLight`
- `Inter-Thin`
- `Inter-ExtraBold`
- `Inter-Black`

## Manual Setup (If automatic doesn't work)

### Android

1. Create `android/app/src/main/assets/fonts/` directory if it doesn't exist
2. Copy font files from `src/assets/fonts/Inter/static/` and rename them:
   - Inter_18pt-Regular.ttf → Inter-Regular.ttf
   - Inter_18pt-Medium.ttf → Inter-Medium.ttf
   - Inter_18pt-SemiBold.ttf → Inter-SemiBold.ttf
   - Inter_18pt-Bold.ttf → Inter-Bold.ttf
   - Inter_18pt-Light.ttf → Inter-Light.ttf
   - Inter_18pt-ExtraLight.ttf → Inter-ExtraLight.ttf
   - Inter_18pt-Thin.ttf → Inter-Thin.ttf
   - Inter_18pt-ExtraBold.ttf → Inter-ExtraBold.ttf
   - Inter_18pt-Black.ttf → Inter-Black.ttf

3. Rebuild the app: `npm run android`

### iOS

Fonts are automatically linked via `react-native.config.js`. If needed:

1. Open `ios/GiftManagement.xcworkspace` in Xcode
2. Right-click on the project → "Add Files to GiftManagement"
3. Navigate to `src/assets/fonts/Inter/static/` and select all font files
4. Make sure "Copy items if needed" is checked
5. Rebuild: `npm run ios`

## Troubleshooting

If fonts don't appear:

1. **Run the setup script**: `npm run setup-fonts`
2. **Clear Metro cache**: `npm start -- --reset-cache`
3. **Clean build folders**:
   - Android: `cd android && ./gradlew clean && cd ..`
   - iOS: `cd ios && rm -rf build && cd ..`
4. **Rebuild completely**: `npm run android` or `npm run ios`

## Testing

Run the app and check `App.tsx` - it contains a comprehensive font demo showing all available weights and styles.
