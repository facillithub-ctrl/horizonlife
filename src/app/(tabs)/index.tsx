// src/app/(tabs)/index.tsx
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <Text className="font-poppins text-[20px] text-black">Horizon Life</Text>
      <Text className="font-inter text-[#A3A3A3] text-center mt-2">
        Seu Centro de Gravidade Digital está sendo inicializado.
      </Text>
    </View>
  );
}
