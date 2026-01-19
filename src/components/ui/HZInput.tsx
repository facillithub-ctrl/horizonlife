import { Text, TextInput, TextInputProps, View } from "react-native";

interface HZInputProps extends TextInputProps {
  label: string;
}

export const HZInput = ({ label, ...props }: HZInputProps) => (
  <View className="w-full mb-4">
    <Text className="font-inter text-[12px] text-black mb-2 uppercase tracking-widest opacity-60">
      {label}
    </Text>
    <TextInput
      style={{ borderRadius: 12 }}
      className="w-full h-12 px-4 bg-white border border-[#F2F2F2] font-inter text-black"
      placeholderTextColor="#A3A3A3"
      {...props}
    />
  </View>
);
