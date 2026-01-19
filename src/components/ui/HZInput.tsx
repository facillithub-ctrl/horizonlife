import React, { useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

// Define que o ícone pode ser passado como prop
interface HZInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
}

export const HZInput = ({ label, icon, ...props }: HZInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#F2F2F2", "#B6192E"],
    );
    return { borderColor, borderWidth: 1 };
  });

  const handleFocus = () => {
    setIsFocused(true);
    progress.value = withTiming(1, { duration: 300 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    progress.value = withTiming(0, { duration: 300 });
  };

  return (
    <View className="w-full mb-5">
      <Text
        className={`font-poppins text-[12px] mb-2 uppercase tracking-widest transition-colors ${isFocused ? "text-[#B6192E]" : "text-[#A3A3A3]"}`}
      >
        {label}
      </Text>

      <Animated.View
        style={[
          { borderRadius: 12, backgroundColor: "#FFFFFF" },
          animatedStyle,
        ]}
        className="w-full h-14 flex-row items-center px-4"
      >
        {/* Renderiza o ícone se existir, aplicando opacidade se não estiver focado */}
        {icon && (
          <View className={`mr-3 ${isFocused ? "opacity-100" : "opacity-40"}`}>
            {icon}
          </View>
        )}

        <TextInput
          className="flex-1 font-inter text-[16px] text-black h-full"
          placeholderTextColor="#D4D4D4"
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor="#B6192E"
          {...props}
        />
      </Animated.View>
    </View>
  );
};
