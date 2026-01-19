// src/app/+not-found.tsx
import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!", headerShown: false }} />
      <View className="flex-1 bg-white items-center justify-center p-8">
        <Text className="font-poppins text-[24px] text-black mb-2">404</Text>
        <Text className="font-inter text-[#A3A3A3] text-center mb-8">
          Este Bloco não existe no seu Horizonte.
        </Text>

        <Link href="/" className="bg-[#B6192E] px-6 py-3 rounded-[12px]">
          <Text className="text-white font-inter">Voltar ao Início</Text>
        </Link>
      </View>
    </>
  );
}
