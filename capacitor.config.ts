import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.eduportal.app",
  appName: "ET 23-24",
  webDir: "dist-mobile",
  server: {
    // During development, point to Vite dev server for live reload.
    // Comment this out for production builds.
    // url: "http://10.0.2.2:5174",  // Android emulator → host machine
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: "#16a34a",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#16a34a",
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
