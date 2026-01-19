import { HZCheckbox } from "@/components/ui/HZCheckbox";
import { HZInput } from "@/components/ui/HZInput";
import {
    CheckCircle2,
    Map,
    MapPin,
    Smartphone,
    User
} from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";

// Links "Fictícios" para demonstração (substitua por URLs reais)
const LINKS = {
  TERMS: "https://horizonlife.com/terms",
  PRIVACY: "https://horizonlife.com/privacy",
};

export const StepBasicInfo = ({
  name,
  setName,
  phone,
  setPhone,
  cep,
  setCep,
  addressData,
  setAddressData,
  isAddressConfirmed,
  confirmAddress,
  terms,
  setTerms,
}: any) => {
  const [loadingCep, setLoadingCep] = useState(false);

  const handleCepBlur = async () => {
    if (cep.length < 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddressData(data.localidade, data.uf, data.logradouro);
      } else {
        Alert.alert("Erro", "CEP não encontrado.");
      }
    } catch (e) {
      Alert.alert("Erro", "Falha ao buscar CEP.");
    } finally {
      setLoadingCep(false);
    }
  };

  const openLink = (url: string) => {
    // Em um app real, use WebBrowser.openBrowserAsync(url) do expo-web-browser
    Alert.alert("Navegador Externo", `Abrindo: ${url}`);
  };

  return (
    <Animated.View entering={SlideInRight} className="flex-1 pb-4">
      <Text className="font-poppins text-[22px] text-black mb-1">
        Dados Básicos
      </Text>
      <Text className="font-inter text-[#A3A3A3] mb-6 text-[13px]">
        Validação legal obrigatória.
      </Text>

      <HZInput
        label="Nome Completo"
        value={name}
        onChangeText={setName}
        placeholder="Nome oficial"
        icon={<User size={20} color="#B6192E" />}
      />
      <HZInput
        label="Celular"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="(00) 00000-0000"
        icon={<Smartphone size={20} color="#B6192E" />}
      />

      {/* SEÇÃO ENDEREÇO */}
      <View className="mb-4">
        <View className="flex-row gap-2 mb-2">
          <View className="flex-1">
            <HZInput
              label="CEP"
              value={cep}
              onChangeText={setCep}
              keyboardType="numeric"
              maxLength={8}
              onBlur={handleCepBlur}
              placeholder="00000000"
              icon={
                loadingCep ? (
                  <ActivityIndicator size="small" color="#B6192E" />
                ) : (
                  <MapPin size={20} color="#B6192E" />
                )
              }
            />
          </View>
        </View>

        {/* CARD DE CONFIRMAÇÃO DE ENDEREÇO */}
        {addressData.city ? (
          <Animated.View
            entering={FadeIn}
            className={`p-4 rounded-xl border ${isAddressConfirmed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
          >
            <View className="flex-row items-start">
              <Map
                size={18}
                color={isAddressConfirmed ? "green" : "#666"}
                style={{ marginTop: 2 }}
              />
              <View className="ml-3 flex-1">
                <Text className="font-bold text-[13px] text-gray-800">
                  {addressData.street || "Rua não identificada"}
                </Text>
                <Text className="text-[12px] text-gray-500">
                  {addressData.city} - {addressData.state}
                </Text>

                {!isAddressConfirmed ? (
                  <TouchableOpacity
                    onPress={confirmAddress}
                    className="mt-3 bg-black py-2 px-4 rounded-lg self-start flex-row items-center"
                  >
                    <Text className="text-white text-[11px] font-bold mr-2">
                      Confirmar Endereço
                    </Text>
                    <CheckCircle2 size={12} color="white" />
                  </TouchableOpacity>
                ) : (
                  <View className="mt-2 flex-row items-center">
                    <CheckCircle2 size={14} color="green" />
                    <Text className="text-green-700 text-[11px] font-bold ml-1">
                      Endereço Confirmado
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
        ) : null}
      </View>

      {/* TERMOS LEGAIS COM LINKS */}
      <View className="mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100 flex-row items-start">
        <HZCheckbox
          label="" // Label vazio pois faremos customizado
          checked={terms}
          onPress={() => setTerms(!terms)}
        />
        <View className="flex-1 ml-[-10px] mt-[2px]">
          <Text className="font-inter text-[12px] text-gray-600 leading-5">
            Li e concordo com os{" "}
            <Text
              onPress={() => openLink(LINKS.TERMS)}
              className="text-[#B6192E] font-bold underline"
            >
              Termos de Uso
            </Text>{" "}
            e a{" "}
            <Text
              onPress={() => openLink(LINKS.PRIVACY)}
              className="text-[#B6192E] font-bold underline"
            >
              Política de Privacidade
            </Text>{" "}
            do Horizon Codex.
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};
