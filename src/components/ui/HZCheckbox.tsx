import { CheckCircle2, Circle } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HZCheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

export const HZCheckbox = ({ label, checked, onPress }: HZCheckboxProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center py-2"
    >
      <View className="mr-2">
        {checked ? (
          <CheckCircle2 size={20} color="#B6192E" />
        ) : (
          <Circle size={20} color="#D4D4D4" />
        )}
      </View>
      <Text
        className={`font-inter text-[12px] ${checked ? "text-black font-bold" : "text-[#A3A3A3]"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
