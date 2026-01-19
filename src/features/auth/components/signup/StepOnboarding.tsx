import { EyeOff, KeyRound, Lock, ShieldCheck } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface StepOnboardingProps {
  horizonId: string;
}

export const StepOnboarding = ({ horizonId }: StepOnboardingProps) => {
  return (
    <Animated.View
      entering={FadeInDown}
      className="flex-1 items-center justify-center pt-4"
    >
      {/* HERO SUCCESS */}
      <View className="w-20 h-20 bg-[#B6192E]/10 rounded-full items-center justify-center mb-6 shadow-sm">
        <ShieldCheck size={40} color="#B6192E" />
      </View>

      <Text className="font-poppins text-[24px] text-black text-center mb-1">
        Bem-vindo, <Text className="text-[#B6192E]">@{horizonId}</Text>!
      </Text>
      <Text className="font-inter text-[#A3A3A3] text-center mb-8 px-8 text-[14px] leading-5">
        Seu ambiente seguro foi provisionado. Antes de começar, revise nossos
        pilares:
      </Text>

      {/* EDUCATIONAL CARDS (Horizontal Scroll) */}
      <View className="h-[140px] mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          {/* Card 1: Zero Trust */}
          <View className="w-[200px] bg-white p-4 rounded-xl mr-3 border border-gray-100 shadow-sm">
            <View className="w-8 h-8 bg-gray-50 rounded-full items-center justify-center mb-3">
              <Lock size={16} color="#B6192E" />
            </View>
            <Text className="font-bold text-[13px] mb-1 font-poppins">
              Zero Trust
            </Text>
            <Text className="text-[11px] text-gray-500 leading-4">
              Seus dados são criptografados. Nós não temos a chave para lê-los.
            </Text>
          </View>

          {/* Card 2: Identity */}
          <View className="w-[200px] bg-white p-4 rounded-xl mr-3 border border-gray-100 shadow-sm">
            <View className="w-8 h-8 bg-gray-50 rounded-full items-center justify-center mb-3">
              <EyeOff size={16} color="#B6192E" />
            </View>
            <Text className="font-bold text-[13px] mb-1 font-poppins">
              Privacidade
            </Text>
            <Text className="text-[11px] text-gray-500 leading-4">
              Nunca compartilhe seu Horizon ID com desconhecidos.
            </Text>
          </View>

          {/* Card 3: Keys */}
          <View className="w-[200px] bg-white p-4 rounded-xl mr-3 border border-gray-100 shadow-sm">
            <View className="w-8 h-8 bg-gray-50 rounded-full items-center justify-center mb-3">
              <KeyRound size={16} color="#B6192E" />
            </View>
            <Text className="font-bold text-[13px] mb-1 font-poppins">
              Recuperação
            </Text>
            <Text className="text-[11px] text-gray-500 leading-4">
              Configure um método de recuperação nas configurações.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};
