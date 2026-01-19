import {
    ChevronDown,
    ChevronUp,
    EyeOff,
    Lock,
    Server,
    ShieldCheck,
} from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, Layout } from "react-native-reanimated";

// [FIX] Correção de caminho: Apenas 3 níveis de profundidade (../../../)
import AccountLogo from "../../../assets/images/subsidiras/account.svg";

export const SecureBadge = ({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) => {
  const [expanded, setExpanded] = useState(false);

  // Estilos dinâmicos baseados na variante
  const bgClass =
    variant === "dark" ? "bg-[#1A1A1A]" : "bg-white border border-gray-200";
  const textClass = variant === "dark" ? "text-white" : "text-black";
  const subTextClass = variant === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <Animated.View
      layout={Layout.springify().damping(15)}
      className="w-full mb-6"
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setExpanded(!expanded)}
        className={`${bgClass} rounded-2xl overflow-hidden p-4 shadow-sm`}
      >
        {/* HEADER DO BADGE (Sempre Visível) */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className={`w-8 h-8 ${variant === "dark" ? "bg-white/10" : "bg-gray-100"} rounded-full items-center justify-center mr-3`}
            >
              <ShieldCheck
                size={16}
                color={variant === "dark" ? "#fff" : "#000"}
              />
            </View>
            <View>
              <View className="flex-row items-center">
                <Text className={`font-poppins text-[14px] ${textClass} mr-2`}>
                  Horizon Account
                </Text>
                <View className="bg-[#B6192E]/20 px-2 py-[2px] rounded-md">
                  <Text className="text-[#B6192E] text-[8px] font-bold uppercase">
                    Seguro
                  </Text>
                </View>
              </View>
              <Text className={`font-inter text-[10px] ${subTextClass}`}>
                Ambiente Criptografado
              </Text>
            </View>
          </View>

          {/* Seta indicando expansão */}
          {expanded ? (
            <ChevronUp size={16} color="#A3A3A3" />
          ) : (
            <ChevronDown size={16} color="#A3A3A3" />
          )}
        </View>

        {/* CONTEÚDO EXPANDIDO (Detalhes) */}
        {expanded && (
          <Animated.View
            entering={FadeIn.duration(300)}
            className="mt-4 pt-4 border-t border-gray-700/20 gap-y-3"
          >
            <View className="flex-row items-center">
              <Lock size={14} color="#B6192E" />
              <Text className={`ml-3 font-inter text-[12px] ${subTextClass}`}>
                <Text className="font-bold">End-to-End Encrypted:</Text> Apenas
                você tem as chaves.
              </Text>
            </View>
            <View className="flex-row items-center">
              <EyeOff size={14} color="#B6192E" />
              <Text className={`ml-3 font-inter text-[12px] ${subTextClass}`}>
                <Text className="font-bold">Zero Trust:</Text> Nós não vemos
                seus dados pessoais.
              </Text>
            </View>
            <View className="flex-row items-center">
              <Server size={14} color="#B6192E" />
              <Text className={`ml-3 font-inter text-[12px] ${subTextClass}`}>
                <Text className="font-bold">Global ID:</Text> Uma identidade
                para todo o ecossistema.
              </Text>
            </View>

            <View className="items-end mt-2">
              <AccountLogo width={60} height={15} />
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
