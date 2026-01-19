import { SplashAnimation } from "@/components/ui/SplashAnimation"; // Importe a nova splash
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
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Esconde a splash nativa do celular para mostrar a nossa Splash Animada (React)
      SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [fontsLoaded, fontError]);

  if (!appReady) {
    return null; // Ainda carregando fontes, tela nativa visível
  }

  // Se a animação ainda não acabou, mostre a SplashAnimation sobre o app
  if (!splashAnimationFinished) {
    return (
      <SplashAnimation onFinish={() => setSplashAnimationFinished(true)} />
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth/signup" options={{ presentation: "modal" }} />
    </Stack>
  );
}
