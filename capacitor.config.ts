import type { CapacitorConfig } from '@capacitor/cli';

// Placeholder bundle id (com.habitus.app) chosen for development while no
// Apple/Google developer account exists yet. Swap it for a real reverse-domain
// id before the first store submission — see MOBILE_SETUP.md.
const config: CapacitorConfig = {
  appId: 'com.habitus.app',
  appName: 'Habitus',
  webDir: 'dist',
  backgroundColor: '#F2F8F8',
};

export default config;
