import "@/styles/global.css"; // Importação CRÍTICA do NativeWind

import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

// Componentes e Hooks
import { SplashAnimation } from "@/components/ui/SplashAnimation";
import { useAuthStore } from "@/features/auth/hooks/useAuth";

// Impede que a splash nativa suma antes da hora
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  // Hook de Autenticação
  const { initialize } = useAuthStore();

  // Carregamento de Fontes
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    // Inicializa o Auth (verifica sessão no disco)
    initialize();

    if (fontsLoaded || fontError) {
      // Esconde a splash nativa para mostrar a nossa Splash Animada (React)
      SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [fontsLoaded, fontError]);

  // Enquanto o app não carrega fontes, mostra nada (ou splash nativa segura a onda)
  if (!appReady) {
    return null;
  }

  // Mostra a Animação da Estrela até ela terminar
  if (!splashAnimationFinished) {
    return (
      <SplashAnimation onFinish={() => setSplashAnimationFinished(true)} />
    );
  }

  // App Carregado: Define as Rotas
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Rota Inicial (Welcome) */}
      <Stack.Screen name="index" />

      {/* Área Logada (Tabs) */}
      <Stack.Screen name="(tabs)" />

      {/* Rotas de Autenticação */}
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" options={{ presentation: "modal" }} />

      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
