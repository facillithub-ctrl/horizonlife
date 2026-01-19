import { Bell, Check, Mail, Moon, Smartphone, Sun } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";

interface StepPreferencesProps {
  theme: string;
  toggleTheme: () => void;
}

export const StepPreferences = ({
  theme,
  toggleTheme,
}: StepPreferencesProps) => {
  return (
    <Animated.View entering={SlideInRight} className="flex-1">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="font-poppins text-[22px] text-black">
          Preferências
        </Text>
        <Text className="text-[10px] text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded">
          Config
        </Text>
      </View>
      <Text className="font-inter text-[#A3A3A3] mb-6 text-[13px]">
        Configure seu ambiente inicial.
      </Text>

      {/* TEMA */}
      <TouchableOpacity
        onPress={toggleTheme}
        activeOpacity={0.8}
        className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100"
      >
        <View className="flex-row items-center">
          {theme === "dark" ? (
            <Moon size={20} color="#B6192E" />
          ) : (
            <Sun size={20} color="#B6192E" />
          )}
          <View className="ml-3">
            <Text className="font-inter font-bold text-gray-700 text-[13px]">
              Aparência do App
            </Text>
            <Text className="text-[10px] text-gray-400">
              {theme === "dark" ? "Modo Escuro Ativo" : "Modo Claro Ativo"}
            </Text>
          </View>
        </View>
        <View
          className={`w-10 h-6 rounded-full ${theme === "dark" ? "bg-[#B6192E]" : "bg-gray-300"} justify-center px-1`}
        >
          <View
            className={`w-4 h-4 bg-white rounded-full ${theme === "dark" ? "self-end" : "self-start"}`}
          />
        </View>
      </TouchableOpacity>

      {/* NOTIFICAÇÕES (Visual Only por enquanto) */}
      <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
        <View className="flex-row items-center">
          <Bell size={20} color="#B6192E" />
          <Text className="ml-3 font-inter font-bold text-gray-700 text-[13px]">
            Alertas Importantes
          </Text>
        </View>
        <Check size={20} color="#B6192E" />
      </View>

      {/* COMUNICAÇÃO */}
      <View className="flex-row gap-2">
        <View className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100 items-center opacity-50">
          <Mail size={16} color="gray" />
          <Text className="text-[10px] mt-1">E-mail</Text>
        </View>
        <View className="flex-1 bg-[#B6192E]/5 p-3 rounded-xl border border-[#B6192E] items-center">
          <Smartphone size={16} color="#B6192E" />
          <Text className="text-[10px] mt-1 text-[#B6192E] font-bold">
            Push
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};
