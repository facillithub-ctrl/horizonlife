import { Text, View } from "react-native";

export default function UniversesScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <Text className="font-poppins text-[20px] text-black">
        Horizon Universes
      </Text>
      <Text className="font-inter text-[#A3A3A3] text-center mt-2">
        Seus módulos de Vida (Book, Cine, Gaming) aparecerão aqui.
      </Text>
    </View>
  );
}
