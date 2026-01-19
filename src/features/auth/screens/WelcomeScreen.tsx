import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { OnboardingItem } from "@/components/ui/OnboardingItem";
import IsoLogo from "../../../../assets/images/logo/isologo.svg";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "A vida ao seu alcance,\nNo horizonte.",
    description:
      "Mais que uma rede social, uma nova forma de viver e compartilhar os melhos momentos.",
    iconType: "life" as const,
  },
  {
    id: "2",
    title: "Identidade\nUniversal.",
    description:
      "Um único Horizon ID para acessar serviços, aplicativos e educação sem fronteiras.",
    iconType: "account" as const,
  },
  {
    id: "3",
    title: "Conexão\nSem Limites.",
    description:
      "Faça parte de um ecossistema global que valoriza quem você realmente é.",
    iconType: "group" as const,
  },
];

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Atualiza o índice atual baseado no scroll
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(currentIndex);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push("/auth/signup");
    }
  };

  const handleSkip = () => {
    router.push("/auth/login");
  };

  return (
    <View className="flex-1 bg-white relative">
      {/* Background Decorativo Estático */}
      <View
        className="absolute -top-[10%] -right-[20%] opacity-[0.03]"
        style={{ transform: [{ rotate: "45deg" }] }}
      >
        <IsoLogo width={width} height={width} color="#000" />
      </View>

      {/* Carrossel */}
      <View className="flex-1 pt-20">
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={({ item, index }) => (
            <OnboardingItem index={index} {...item} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={32}
        />
      </View>

      {/* Controles Inferiores (Fixo) */}
      <View className="px-8 pb-12 w-full">
        {/* Indicadores de Página (Bolinhas) */}
        <View className="flex-row justify-center gap-2 mb-8">
          {SLIDES.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "w-8 bg-[#B6192E]" : "w-2 bg-[#E5E5E5]"
              }`}
            />
          ))}
        </View>

        {/* Botão de Ação Dinâmico */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleNext}
          className="w-full h-14 bg-[#B6192E] rounded-[16px] flex-row items-center justify-center shadow-lg shadow-red-200"
        >
          <Text className="font-poppins text-white text-[16px] font-semibold mr-2">
            {currentIndex === SLIDES.length - 1
              ? "Criar meu Horizonte"
              : "Continuar"}
          </Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>

        {/* Link Secundário */}
        <TouchableOpacity
          onPress={handleSkip}
          className="mt-6 items-center py-2"
        >
          <Text className="font-inter text-[#A3A3A3] text-[14px] font-medium">
            {currentIndex === SLIDES.length - 1
              ? "Já tenho uma conta"
              : "Pular introdução"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
