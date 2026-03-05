import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sosbeacon.pro',
  appName: 'SOS Beacon Pro',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true
    },
    Geolocation: {
      permissions: ['location', 'coarseLocation']
    }
  }
};

export default config;
