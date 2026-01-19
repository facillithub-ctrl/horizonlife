import * as ImagePicker from "expo-image-picker"; // Se não tiver instalado, rode: npx expo install expo-image-picker
import {
    ArrowRight,
    Camera,
    CheckCircle2,
    ShieldCheck,
    UserPlus
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    SlideInRight
} from "react-native-reanimated";

interface StepOnboardingProps {
  horizonId: string;
  userGoal?: string;
  onFinish: () => void; // Callback para encerrar tudo
}

// SUGESTÕES DE CONTAS OFICIAIS
const OFFICIAL_ACCOUNTS = [
  {
    id: "hz_official",
    name: "Horizon Official",
    handle: "@horizon",
    verified: true,
  },
  {
    id: "hz_support",
    name: "Horizon Support",
    handle: "@support",
    verified: true,
  },
  {
    id: "hz_education",
    name: "Horizon Education",
    handle: "@education",
    verified: false,
  },
];

const TOPICS = [
  "Tecnologia",
  "Design",
  "Finanças",
  "Educação",
  "Startup",
  "Música",
  "Saúde",
  "Games",
];

export const StepOnboarding = ({
  horizonId,
  userGoal,
  onFinish,
}: StepOnboardingProps) => {
  // Controle interno de "Fases" do Onboarding Pós-Cadastro
  // 0 = Foto/Bio, 1 = Interesses/Follow, 2 = Welcome Card (Final)
  const [internalStep, setInternalStep] = useState(0);

  // Dados Locais
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  // Função para pegar imagem (Simulada ou Real se tiver expo-image-picker)
  const pickImage = async () => {
    // Exemplo real com expo-image-picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic))
      setSelectedTopics((p) => p.filter((t) => t !== topic));
    else setSelectedTopics((p) => [...p, topic]);
  };

  const toggleFollow = (id: string) => {
    if (following.includes(id)) setFollowing((p) => p.filter((f) => f !== id));
    else setFollowing((p) => [...p, id]);
  };

  const handleNext = () => {
    if (internalStep < 2) setInternalStep((s) => s + 1);
    else onFinish(); // Fim real
  };

  // --- RENDERS ---

  // FASE 1: PERFIL VISUAL
  if (internalStep === 0) {
    return (
      <Animated.View entering={SlideInRight} className="flex-1 pt-4">
        <Text className="font-poppins text-[24px] text-black mb-2">
          Personalize
        </Text>
        <Text className="font-inter text-gray-400 mb-8">
          Adicione um rosto à sua identidade.
        </Text>

        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.8}
            className="relative"
          >
            <View className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg items-center justify-center overflow-hidden">
              {image ? (
                <Image source={{ uri: image }} className="w-full h-full" />
              ) : (
                <UserPlus size={40} color="#D4D4D4" />
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-[#B6192E] p-2 rounded-full border-2 border-white">
              <Camera size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-[#B6192E] font-bold text-[12px] mt-3">
            Alterar Foto
          </Text>
        </View>

        <Text className="font-bold text-gray-700 mb-2 ml-1">Sua Bio</Text>
        <View className="bg-gray-50 p-4 rounded-xl border border-gray-100 h-32">
          <TextInput
            className="flex-1 font-inter text-gray-800"
            placeholder="Conte um pouco sobre você..."
            multiline
            value={bio}
            onChangeText={setBio}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          onPress={handleNext}
          className="mt-auto bg-black h-12 rounded-xl flex-row items-center justify-center mb-4"
        >
          <Text className="text-white font-bold mr-2">Próximo</Text>
          <ArrowRight size={16} color="white" />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // FASE 2: INTERESSES & CONEXÕES
  if (internalStep === 1) {
    return (
      <Animated.View entering={SlideInRight} className="flex-1 pt-4">
        <Text className="font-poppins text-[24px] text-black mb-2">
          Seus Interesses
        </Text>
        <Text className="font-inter text-gray-400 mb-6">
          O que você quer ver no seu horizonte?
        </Text>

        {/* TOPICS */}
        <View className="flex-row flex-wrap mb-8">
          {TOPICS.map((topic) => (
            <TouchableOpacity
              key={topic}
              onPress={() => toggleTopic(topic)}
              className={`mr-2 mb-2 px-4 py-2 rounded-full border ${selectedTopics.includes(topic) ? "bg-[#B6192E] border-[#B6192E]" : "bg-white border-gray-200"}`}
            >
              <Text
                className={`text-[12px] ${selectedTopics.includes(topic) ? "text-white font-bold" : "text-gray-600"}`}
              >
                #{topic}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SUGGESTED ACCOUNTS */}
        <Text className="font-bold text-gray-700 mb-3 ml-1">
          Sugestões para você
        </Text>
        <ScrollView className="flex-1">
          {OFFICIAL_ACCOUNTS.map((acc) => (
            <View
              key={acc.id}
              className="flex-row items-center justify-between p-3 mb-2 bg-gray-50 rounded-xl border border-gray-100"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-200 rounded-full mr-3" />
                <View>
                  <View className="flex-row items-center">
                    <Text className="font-bold text-gray-800 text-[13px]">
                      {acc.name}
                    </Text>
                    {acc.verified && (
                      <CheckCircle2
                        size={10}
                        color="#3B82F6"
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </View>
                  <Text className="text-gray-500 text-[11px]">
                    {acc.handle}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => toggleFollow(acc.id)}
                className={`px-3 py-1.5 rounded-lg ${following.includes(acc.id) ? "bg-black" : "bg-white border border-gray-300"}`}
              >
                <Text
                  className={`text-[10px] font-bold ${following.includes(acc.id) ? "text-white" : "text-black"}`}
                >
                  {following.includes(acc.id) ? "Seguindo" : "Seguir"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={handleNext}
          className="bg-black h-12 rounded-xl flex-row items-center justify-center mt-4 mb-4"
        >
          <Text className="text-white font-bold mr-2">Finalizar Setup</Text>
          <CheckCircle2 size={16} color="white" />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // FASE 3: GRAND FINALE (WELCOME CARD)
  return (
    <Animated.View
      entering={FadeInDown}
      className="flex-1 items-center justify-center pt-8"
    >
      <View className="w-24 h-24 bg-[#B6192E]/10 rounded-full items-center justify-center mb-6 shadow-sm border border-[#B6192E]/20">
        <ShieldCheck size={48} color="#B6192E" />
      </View>

      <Text className="font-poppins text-[28px] text-black text-center mb-1 leading-tight">
        Bem-vindo,
      </Text>
      <Text className="font-poppins text-[28px] text-[#B6192E] text-center mb-4 leading-tight">
        @{horizonId}
      </Text>

      {userGoal && (
        <View className="bg-gray-50 px-4 py-2 rounded-full mb-8 border border-gray-200">
          <Text className="text-gray-500 text-[12px]">
            Objetivo:{" "}
            <Text className="font-bold text-gray-800">{userGoal}</Text>
          </Text>
        </View>
      )}

      <Text className="font-inter text-[#A3A3A3] text-center mb-10 px-8 text-[14px] leading-6">
        Seu Horizon ID está ativo. Você configurou seu perfil e agora está
        pronto para explorar o ecossistema.
      </Text>

      {/* Cartão de Resumo do ID */}
      <View className="w-full bg-[#1A1A1A] p-5 rounded-2xl mb-8 relative overflow-hidden">
        <View className="absolute top-0 right-0 w-32 h-32 bg-[#B6192E] rounded-full opacity-10 transform translate-x-10 -translate-y-10" />
        <Text className="text-white/50 text-[10px] uppercase tracking-widest mb-4">
          Horizon Identity Card
        </Text>
        <Text className="text-white text-[20px] font-mono font-bold mb-1">
          @{horizonId}
        </Text>
        <Text className="text-white/70 text-[12px]">
          Status: <Text className="text-green-400">Ativo & Verificado</Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={onFinish}
        className="w-full bg-[#B6192E] h-14 rounded-xl flex-row items-center justify-center shadow-lg shadow-red-500/30"
      >
        <Text className="text-white font-bold text-[16px] mr-2">
          Ir para o Horizonte
        </Text>
        <ArrowRight size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};
