import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c5a9ee4350904c94affbdada429507e0',
  appName: 'MyFarm',
  webDir: 'dist',
  server: {
    url: 'https://c5a9ee43-5090-4c94-affb-dada429507e0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;