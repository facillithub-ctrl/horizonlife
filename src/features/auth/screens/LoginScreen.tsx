import { HZButton } from "@/components/ui/HZButton";
import { HZInput } from "@/components/ui/HZInput";
import { useAuthStore } from "@/features/auth/hooks/useAuth";
import { router } from "expo-router"; // [FIX] Importação crucial adicionada
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading } = useAuthStore();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      router.replace("/(tabs)"); // Redireciona para o app após login
    } catch (err: any) {
      Alert.alert("Erro de Acesso", err.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-8 justify-center"
      >
        <View className="mb-10">
          <Text className="font-poppins text-[32px] text-black">
            Horazion Life
          </Text>
          <Text className="font-inter text-[#A3A3A3] text-[16px]">
            Acesse seu centro de gravidade digital.
          </Text>
        </View>

        <HZInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <HZInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View className="mt-4 gap-y-3">
          <HZButton title="Entrar" onPress={handleLogin} loading={loading} />
          {/* Navegação para o Signup corrigida */}
          <HZButton
            title="Criar HorazionID"
            variant="secondary"
            onPress={() => router.push("/auth/signup")}
          />
        </View>

        <Text className="text-center mt-8 font-inter text-[12px] text-[#A3A3A3]">
          Ao entrar, você concorda com o Horizion Codex.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
