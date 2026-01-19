import { HZButton } from "@/components/ui/HZButton";
import { HZInput } from "@/components/ui/HZInput";
import { useAuthStore } from "@/features/auth/hooks/useAuth";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const { signUp, loading } = useAuthStore();

  const handleSignup = async () => {
    if (password !== confirmPass) {
      Alert.alert("Erro de Validação", "As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Segurança", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      const { error, data } = await signUp(email, password, name);

      if (error) {
        Alert.alert("Erro no Cadastro", error.message);
      } else if (data?.user && !data?.session) {
        Alert.alert(
          "Verifique seu E-mail",
          "Enviamos um link de confirmação para ativar seu HorizonID.",
        );
        router.back(); // Volta para o Login
      } else {
        // Se o autoconfirm estiver ligado no Supabase
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro Crítico", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 32,
          }}
        >
          <View className="mb-8">
            <Text className="font-poppins text-[28px] text-black">
              Crie seu Horizonte
            </Text>
            <Text className="font-inter text-[#A3A3A3] text-[16px]">
              Comece sua jornada de organização digital.
            </Text>
          </View>

          <HZInput label="Nome Completo" value={name} onChangeText={setName} />
          <HZInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <HZInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <HZInput
            label="Confirmar Senha"
            value={confirmPass}
            onChangeText={setConfirmPass}
            secureTextEntry
          />

          <View className="mt-6 gap-y-3">
            <HZButton
              title="Gerar HorizonID"
              onPress={handleSignup}
              loading={loading}
            />
            <HZButton
              title="Já tenho conta"
              variant="secondary"
              onPress={() => router.back()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
