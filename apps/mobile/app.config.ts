import { ExpoConfig } from 'expo/config'

export default (): ExpoConfig => ({
  name: "The Dad Center",
  slug: "thedadcenter",
  version: "1.0.0",
  scheme: "thedadcenter",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "dark",
  backgroundColor: "#12100e",
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#12100e",
  },
  ios: {
    bundleIdentifier: "com.thedadcenter.app",
    supportsTablet: true,
    infoPlist: {
      UIBackgroundModes: ["remote-notification"],
    },
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: "com.thedadcenter.app",
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundColor: "#12100e",
    },
    permissions: ["RECEIVE_BOOT_COMPLETED", "VIBRATE"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-secure-store",
    ["expo-notifications", {
      icon: "./assets/images/icon.png",
      color: "#c4703f",
    }],
  ],
  extra: {
    eas: {
      projectId: "4ae2d850-713c-45fb-9756-4d5cf606299d",
    },
  },
  experiments: {
    typedRoutes: true,
  },
})
