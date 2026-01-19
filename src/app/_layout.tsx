// [FIX CRÍTICO] Importação dos estilos globais do NativeWind
import "@/styles/global.css";

import { SplashAnimation } from "@/components/ui/SplashAnimation";
import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [loaded, error]);

  if (!appReady) return null;

  // Renderiza a Splash Animada antes de mostrar o App
  if (!splashFinished) {
    return <SplashAnimation onFinish={() => setSplashFinished(true)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" options={{ presentation: "modal" }} />
    </Stack>
  );
}
