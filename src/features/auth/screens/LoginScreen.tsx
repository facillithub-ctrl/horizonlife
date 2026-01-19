import { router } from "expo-router";
import { ArrowRight, Lock, Mail, UserPlus } from "lucide-react-native"; // [NEW] Ícones High-Level
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { HZButton } from "@/components/ui/HZButton";
import { HZInput } from "@/components/ui/HZInput";
import { useAuthStore } from "@/features/auth/hooks/useAuth";

// [FIX] Correção dos Assets: Usando os arquivos que REALMENTE existem
import LifeLogo from "@/assets/images/logo/isologo.svg";
import GroupLogo from "@/assets/images/subsidiras/horiziongroup.svg";

// Se o account.svg não existir, usaremos um ícone Lucide como fallback elegante
// import AccountLogo from "@/assets/images/subsidiras/account.svg";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading } = useAuthStore();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Acesso Negado", err.message);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8 relative">
          {/* 1. Header Heroico */}
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="items-center mb-10"
          >
            <View className="w-24 h-24 mb-4">
              {/* Logo Corrigido */}
              <LifeLogo width={100} height={100} />
            </View>
            <Text className="font-poppins text-[32px] text-black text-center leading-tight">
              Horizon Life
            </Text>
            <Text className="font-inter text-[#A3A3A3] text-[14px] mt-2 tracking-wide text-center">
              Seu Sistema Operativo Social
            </Text>
          </Animated.View>

          {/* 2. Formulário Interativo com Ícones Lucide */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            className="w-full"
          >
            <HZInput
              label="E-mail de Acesso"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="seu@horizon.com"
              // Ícone injetado: Vermelho quando focado (controlado pelo HZInput)
              icon={<Mail size={20} color="#B6192E" />}
            />

            <HZInput
              label="Senha Mestra"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              icon={<Lock size={20} color="#B6192E" />}
            />

            <TouchableOpacity className="self-end mb-8 mt-[-10px]">
              <Text className="font-inter text-[#B6192E] text-[12px] font-bold">
                Recuperar Acesso
              </Text>
            </TouchableOpacity>

            <View className="gap-y-4">
              <HZButton
                title="Iniciar Sessão"
                onPress={handleLogin}
                loading={loading}
              />

              {/* Botão Secundário High-Level */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/auth/signup")}
                className="h-14 flex-row items-center justify-center bg-[#FAFAFA] rounded-[12px] border border-[#F2F2F2]"
              >
                <View className="mr-3">
                  <UserPlus size={20} color="#000000" />
                </View>
                <Text className="font-inter font-bold text-black text-[14px]">
                  Criar Horizon ID
                </Text>
                <View className="absolute right-4 opacity-30">
                  <ArrowRight size={16} color="#000" />
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* 3. Rodapé Institucional */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(1000)}
          className="absolute bottom-10 w-full items-center opacity-50"
        >
          <Text className="font-inter text-[10px] text-[#A3A3A3] mb-2 uppercase tracking-widest">
            Powered by
          </Text>
          <GroupLogo width={100} height={20} />
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
