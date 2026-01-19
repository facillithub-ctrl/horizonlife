import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";

export default function ModalScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <Text className="font-poppins text-[20px] text-black mb-4">
        Configurações
      </Text>

      <View className="w-full bg-[#F2F2F2] h-[1px] my-4" />

      <Text className="font-inter text-[#A3A3A3] text-center mb-8">
        Ajustes do Sistema Operativo Social.
      </Text>

      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-[#B6192E] px-6 py-3 rounded-[12px]"
      >
        <Text className="text-white font-inter font-bold">Fechar</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}
