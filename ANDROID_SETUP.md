# Android Location Permissions Setup

## Overview
This setup configures SOS Beacon Pro to properly request and handle location permissions on Android 8–14+.

## What's Been Configured

### 1. AndroidManifest.xml
- ✅ ACCESS_FINE_LOCATION (precise location)
- ✅ ACCESS_COARSE_LOCATION (approximate location)  
- ✅ ACCESS_BACKGROUND_LOCATION (Android 10+ for background access)
- ✅ No READ_CONTACTS permissions (removed as requested)

### 2. MainActivity.java Runtime Permissions
- ✅ Requests permissions on app startup
- ✅ Shows rationale dialog explaining why location is needed
- ✅ Handles permanent denial with Settings navigation
- ✅ Supports Android 8–14+ permission models
- ✅ Background location handled separately for Android 10+

### 3. Capacitor Integration
- ✅ Uses @capacitor/geolocation for native location access
- ✅ Fallback to browser geolocation for web
- ✅ Proper error handling for permission issues

## Build Instructions

### Prerequisites
- Node.js 18+
- Android Studio with SDK 34
- Java 8+

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build Web App
```bash
npm run build
```

### Step 3: Sync Android Platform
```bash
npm run android:sync
```

### Step 4: Open Android Studio
```bash
npm run android:open
```

### Step 5: Build APK in Android Studio
1. Open the project in Android Studio
2. Wait for Gradle sync to complete
3. Build → Build Bundle(s) / APK(s) → Build APK(s)
4. APK will be in `android/app/build/outputs/apk/debug/`

## Permission Flow Testing

### First Launch
1. Install APK on Android device
2. App will immediately request location permissions
3. Grant "Allow all the time" for full SOS functionality
4. If denied, app shows rationale and guides to Settings

### SOS Feature Testing
1. Add an emergency contact
2. Press SOS button → Confirm
3. App should fetch location without errors
4. Send options modal appears with 3-second countdown

### Troubleshooting Permissions

#### Location Not Working
- Check Settings → Apps → SOS Beacon Pro → Permissions → Location
- Set to "Allow all the time" for best experience
- Ensure device location services are enabled

#### Background Location (Android 10+)
- First grant foreground location
- App will then request background location
- Navigate to Settings if needed for "Allow all the time"

#### Permission Dialog Not Showing
- Clear app data and restart
- Check if permissions were permanently denied
- Use Settings → Apps → SOS Beacon Pro → Permissions

## Android Version Compatibility

| Android Version | Location Permission Behavior |
|----------------|------------------------------|
| Android 8-9    | Simple allow/deny dialog |
| Android 10     | Foreground first, then background |
| Android 11+    | Background location requires Settings |
| Android 12+    | Enhanced privacy prompts |
| Android 13+    | Themed permission dialogs |
| Android 14+    | Latest permission models |

## Files Modified/Created

### Core Android Files
- `android/app/src/main/AndroidManifest.xml` - Permissions declaration
- `android/app/src/main/java/com/sosbeacon/pro/MainActivity.java` - Runtime permission handling
- `android/app/build.gradle` - Build configuration
- `android/build.gradle` - Project configuration

### Capacitor Config
- `capacitor.config.ts` - App configuration with Geolocation plugin
- `package.json` - Added Capacitor dependencies and scripts

### Web Integration
- `src/utils/location.ts` - Updated to use Capacitor Geolocation on Android
- `src/types/capacitor.d.ts` - TypeScript declarations
- `vite.config.ts` - Build optimization for Capacitor

## Next Steps

1. Build and test the APK following the instructions above
2. Verify permission flow on different Android versions
3. Test SOS functionality with location access
4. Deploy to Google Play Store when ready

## Support

If you encounter permission issues:
1. Check Android Logcat for permission-related errors
2. Verify all files are correctly placed in the android/ directory
3. Ensure Capacitor CLI is properly installed and synced
4. Test on physical devices (not just emulators) for GPS accuracy
