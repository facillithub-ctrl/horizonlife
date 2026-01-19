import { router } from "expo-router";
import {
    ArrowLeft,
    ArrowUpRight,
    Fingerprint,
    Lock,
    Mail,
    UserPlus,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// Componentes UI
import { HZButton } from "@/components/ui/HZButton";
import { HZCheckbox } from "@/components/ui/HZCheckbox";
import { HZInput } from "@/components/ui/HZInput";
import { SecureBadge } from "@/components/ui/SecureBadge"; // Badge de Segurança

// Logic & Config
import { mapErrorToHz } from "@/core/error-library/codes";
import { useAuthStore } from "@/features/auth/hooks/useAuth";

// Assets
import IsoLogo from "../../../../assets/images/logo/isologo.svg";
import LifeLogo from "../../../../assets/images/logo/life.svg";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSession, setKeepSession] = useState(true);

  const { signIn, loading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert(
        "Acesso",
        "Por favor, preencha sua Identidade e Chave.",
      );
    }

    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      const error = mapErrorToHz(err);
      Alert.alert(error.title, error.message);
    }
  };

  return (
    <View className="flex-1 bg-white relative">
      {/* Background Atmosphere (Marca d'água) */}
      <View
        className="absolute -top-[15%] -right-[30%] opacity-[0.03]"
        style={{ transform: [{ rotate: "15deg" }] }}
      >
        <IsoLogo width={width * 1.3} height={width * 1.3} color="#000" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Container Principal: justify-between empurra conteúdo para extremos */}
        <View className="flex-1 px-8 pt-12 pb-8 justify-between">
          {/* 1. HEADER ZONE */}
          <Animated.View entering={FadeInDown.duration(600)}>
            {/* Botão Voltar */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 items-center justify-center mb-6"
            >
              <ArrowLeft size={20} color="#000" />
            </TouchableOpacity>

            {/* Badge de Segurança (Visual Light) */}
            <View className="mb-6">
              <SecureBadge variant="light" />
            </View>

            {/* Identidade Visual */}
            <View className="flex-row items-center gap-x-3 mb-2 opacity-90">
              <LifeLogo width={90} height={35} />
              <View className="h-3 w-[1px] bg-gray-300" />
              <Text className="font-inter text-[#B6192E] text-[10px] font-bold tracking-widest uppercase">
                ID Access
              </Text>
            </View>

            <Text className="font-poppins text-[28px] text-black leading-tight">
              Bem-vindo de volta.
            </Text>
          </Animated.View>

          {/* 2. FORM ZONE (Centro) */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(800).springify()}
            className="w-full"
          >
            <HZInput
              label="Horizon ID / E-mail"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="seu@horizon.com"
              icon={<Mail size={20} color="#B6192E" />}
            />

            <HZInput
              label="Chave de Acesso"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              icon={<Lock size={20} color="#B6192E" />}
            />

            {/* Controles de Sessão */}
            <View className="flex-row justify-between items-center mb-8 mt-[-10px]">
              <HZCheckbox
                label="Manter conectado"
                checked={keepSession}
                onPress={() => setKeepSession(!keepSession)}
              />
              <TouchableOpacity className="flex-row items-center p-2">
                <Text className="font-inter text-[#B6192E] text-[11px] font-bold mr-1">
                  Recuperar
                </Text>
                <ArrowUpRight size={12} color="#B6192E" />
              </TouchableOpacity>
            </View>

            <HZButton
              title="Entrar no Sistema"
              onPress={handleLogin}
              loading={loading}
            />
          </Animated.View>

          {/* 3. FOOTER ZONE (Ações Secundárias) */}
          <Animated.View
            entering={FadeInDown.delay(400)}
            className="w-full gap-y-4"
          >
            {/* Toggle Biometria (Visual) */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-center p-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50"
            >
              <Fingerprint size={18} color="#A3A3A3" />
              <Text className="font-inter text-[12px] text-gray-500 ml-2">
                Usar Biometria (FaceID)
              </Text>
            </TouchableOpacity>

            {/* Link para Cadastro */}
            <View className="flex-row justify-center items-center mt-2">
              <Text className="font-inter text-[12px] text-gray-400">
                Não possui identidade?
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/auth/signup")}
                className="ml-2 flex-row items-center"
              >
                <Text className="font-inter text-[12px] text-[#B6192E] font-bold mr-1">
                  Criar Horizon ID
                </Text>
                <UserPlus size={12} color="#B6192E" />
              </TouchableOpacity>
            </View>

            <Text className="text-center font-inter text-[9px] text-gray-300 mt-2">
              v1.0.0 • Secure Connection
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
