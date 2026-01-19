import {
    Building2,
    Check,
    GraduationCap,
    Sparkles,
    User,
} from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

const ACCOUNT_TYPES = [
  {
    id: "individual",
    title: "Pessoal",
    icon: <User size={24} color="#B6192E" />,
    desc: "Identidade e cotidiano.",
  },
  {
    id: "student",
    title: "Estudante",
    icon: <GraduationCap size={24} color="#B6192E" />,
    desc: "Recursos educacionais.",
  },
  {
    id: "startup",
    title: "Startup",
    icon: <Sparkles size={24} color="#B6192E" />,
    desc: "Crescimento ágil.",
  },
  {
    id: "enterprise",
    title: "Empresarial",
    icon: <Building2 size={24} color="#B6192E" />,
    desc: "Gestão corporativa.",
  },
];

export const StepAccountType = ({ value, onChange }: any) => (
  <Animated.View entering={FadeInRight} className="flex-1">
    <Text className="font-poppins text-[22px] text-black mb-1">
      Qual seu perfil?
    </Text>
    <Text className="font-inter text-[#A3A3A3] mb-6 text-[13px]">
      Personalize sua experiência.
    </Text>
    <View className="flex-row flex-wrap justify-between">
      {ACCOUNT_TYPES.map((type) => (
        <TouchableOpacity
          key={type.id}
          activeOpacity={0.8}
          onPress={() => onChange(type.id)}
          className={`w-[48%] mb-3 p-3 rounded-xl border transition-all ${value === type.id ? "bg-[#B6192E]/5 border-[#B6192E]" : "bg-[#FAFAFA] border-[#F2F2F2]"}`}
        >
          <View className="mb-2">{type.icon}</View>
          <Text
            className={`font-poppins font-bold text-[13px] ${value === type.id ? "text-[#B6192E]" : "text-black"}`}
          >
            {type.title}
          </Text>
          <Text className="font-inter text-[10px] text-[#A3A3A3] mt-1 leading-3">
            {type.desc}
          </Text>
          {value === type.id && (
            <View className="absolute top-2 right-2">
              <Check size={14} color="#B6192E" />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  </Animated.View>
);
