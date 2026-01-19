import { router } from "expo-router";
import {
    ArrowLeft,
    Building2,
    Check,
    Fingerprint,
    GraduationCap,
    Lock,
    Mail,
    ShieldCheck,
    Smartphone,
    Sparkles,
    User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    FadeInRight,
    FadeOutLeft,
    Layout,
    SlideInRight,
    SlideOutLeft,
} from "react-native-reanimated";

import { HZButton } from "@/components/ui/HZButton";
import { HZInput } from "@/components/ui/HZInput";
import { SecureBadge } from "@/components/ui/SecureBadge"; // [NEW] Badge Reutilizável
import { mapErrorToHz } from "@/core/error-library/codes";
import { useAuthStore } from "@/features/auth/hooks/useAuth";

// Assets
import IsoLogo from "../../../../assets/images/logo/isologo.svg";

const { width } = Dimensions.get("window");

// Tipos de Conta
const ACCOUNT_TYPES = [
  {
    id: "individual",
    title: "Pessoal",
    icon: <User size={24} color="#B6192E" />,
    desc: "Identidade e cotidiano.",
  },
  {
    id: "student",
    title: "Estudante",
    icon: <GraduationCap size={24} color="#B6192E" />,
    desc: "Recursos educacionais.",
  },
  {
    id: "startup",
    title: "Startup",
    icon: <Sparkles size={24} color="#B6192E" />,
    desc: "Crescimento ágil.",
  },
  {
    id: "enterprise",
    title: "Empresarial",
    icon: <Building2 size={24} color="#B6192E" />,
    desc: "Gestão corporativa.",
  },
];

export default function SignupScreen() {
  // Controle de Etapas: 0=Tipo, 1=Dados, 2=ID, 3=Segurança, 4=Sucesso
  const [step, setStep] = useState(0);

  // Formulário
  const [accountType, setAccountType] = useState("individual");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [enable2FA, setEnable2FA] = useState(false);

  const { signUp, loading } = useAuthStore();
  const progress = ((step + 1) / 5) * 100;

  // Lógica de Navegação do Wizard
  const handleNext = async () => {
    // Validações por etapa
    if (step === 1 && (!name || name.length < 3))
      return Alert.alert("Validação", "Nome completo é obrigatório.");
    if (step === 2 && !email.includes("@"))
      return Alert.alert("Validação", "Insira um e-mail válido.");

    // Etapa de Segurança -> Criação Real
    if (step === 3) {
      if (password.length < 6)
        return Alert.alert(
          "Segurança",
          "A senha deve ter no mínimo 6 caracteres.",
        );
      if (password !== confirmPass)
        return Alert.alert("Segurança", "As senhas não conferem.");

      await executeSignup();
      return;
    }

    // Etapa Final -> Redirecionar
    if (step === 4) {
      router.replace("/(tabs)");
      return;
    }

    // Avança passo local
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 0) router.back();
    else setStep((s) => s - 1);
  };

  const executeSignup = async () => {
    try {
      // Chama o hook passando todos os metadados coletados no Wizard
      const { error } = await signUp(
        email,
        password,
        name,
        phone,
        accountType,
        enable2FA,
      );

      if (error) throw error;

      // Sucesso: Vai para etapa 4 (Manifesto/Onboarding)
      setStep(4);
    } catch (err: any) {
      const hzError = mapErrorToHz(err);
      Alert.alert(hzError.title, hzError.message);
    }
  };

  // Renderizadores de cada cena
  const renderStepContent = () => {
    switch (step) {
      case 0: // TIPO DE CONTA
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            className="flex-1"
          >
            <Text className="font-poppins text-[22px] text-black mb-1">
              Qual seu perfil?
            </Text>
            <Text className="font-inter text-[#A3A3A3] mb-6 text-[13px]">
              Personalize sua experiência Horizon.
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {ACCOUNT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  activeOpacity={0.8}
                  onPress={() => setAccountType(type.id)}
                  className={`w-[48%] mb-3 p-3 rounded-xl border transition-all ${accountType === type.id ? "bg-[#B6192E]/5 border-[#B6192E]" : "bg-[#FAFAFA] border-[#F2F2F2]"}`}
                >
                  <View className="mb-2">{type.icon}</View>
                  <Text
                    className={`font-poppins font-bold text-[13px] ${accountType === type.id ? "text-[#B6192E]" : "text-black"}`}
                  >
                    {type.title}
                  </Text>
                  <Text className="font-inter text-[10px] text-[#A3A3A3] mt-1 leading-3">
                    {type.desc}
                  </Text>
                  {accountType === type.id && (
                    <View className="absolute top-2 right-2">
                      <Check size={14} color="#B6192E" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );

      case 1: // DADOS PESSOAIS
        return (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            className="flex-1"
          >
            <Text className="font-poppins text-[22px] text-black mb-1">
              Quem é você?
            </Text>
            <Text className="font-inter text-[#A3A3A3] mb-6 text-[13px]">
              Dados essenciais para sua cidadania.
            </Text>
            <HZInput
              label="Nome Completo"
              value={name}
              onChangeText={setName}
              placeholder="Seu nome oficial"
              icon={<User size={20} color="#B6192E" />}
            />
            <HZInput
              label="Celular (Recuperação)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="(00) 00000-0000"
              icon={<Smartphone size={20} color="#B6192E" />}
            />
          </Animated.View>
        );

      case 2: // HORIZON ID
        return (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            className="flex-1"
          >
            <Text className="font-poppins text-[22px] text-black mb-1">
              Seu Horizon ID
            </Text>
            <Text className="font-inter text-[#A3A3A3] mb-6 text-[13px]">
              Identidade única para o ecossistema.
            </Text>
            <HZInput
              label="E-mail Principal"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="voce@horizon.com"
              icon={<Mail size={20} color="#B6192E" />}
            />

            {/* ID Generator Preview */}
            {email.length > 3 && (
              <Animated.View
                entering={FadeInDown}
                className="mt-2 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 items-center"
              >
                <Text className="font-inter text-[10px] text-[#A3A3A3] uppercase mb-1">
                  Handle Universal
                </Text>
                <Text className="font-mono text-[14px] text-[#B6192E] font-bold">
                  @
                  {email
                    .split("@")[0]
                    .toLowerCase()
                    .replace(/[^a-z0-9._]/g, "")}
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        );

      case 3: // SEGURANÇA
        return (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            className="flex-1"
          >
            <Text className="font-poppins text-[22px] text-black mb-1">
              Segurança
            </Text>
            <Text className="font-inter text-[#A3A3A3] mb-6 text-[13px]">
              Proteja seu patrimônio digital.
            </Text>
            <HZInput
              label="Senha Mestra"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Mínimo 6 caracteres"
              icon={<Lock size={20} color="#B6192E" />}
            />
            <HZInput
              label="Confirmar"
              value={confirmPass}
              onChangeText={setConfirmPass}
              secureTextEntry
              placeholder="Repita a senha"
              icon={
                <Check
                  size={20}
                  color={
                    password === confirmPass && password.length > 0
                      ? "#B6192E"
                      : "#D4D4D4"
                  }
                />
              }
            />

            {/* 2FA Toggle Visual */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setEnable2FA(!enable2FA)}
              className={`mt-2 p-3 rounded-xl border flex-row items-center justify-between ${enable2FA ? "bg-[#B6192E]/5 border-[#B6192E]" : "bg-white border-[#F2F2F2]"}`}
            >
              <View className="flex-row items-center flex-1 pr-4">
                <Fingerprint
                  size={20}
                  color={enable2FA ? "#B6192E" : "#A3A3A3"}
                />
                <View className="ml-3">
                  <Text
                    className={`font-bold text-[12px] ${enable2FA ? "text-[#B6192E]" : "text-gray-600"}`}
                  >
                    Ativar 2FA
                  </Text>
                  <Text className="text-[9px] text-gray-400">
                    Camada extra de proteção via App.
                  </Text>
                </View>
              </View>
              <View
                className={`w-5 h-5 rounded-full border items-center justify-center ${enable2FA ? "bg-[#B6192E] border-[#B6192E]" : "border-gray-300"}`}
              >
                {enable2FA && <Check size={12} color="white" />}
              </View>
            </TouchableOpacity>
          </Animated.View>
        );

      case 4: // MANIFESTO / SUCESSO
        return (
          <Animated.View
            entering={FadeInDown}
            className="flex-1 items-center justify-center pt-4"
          >
            <View className="w-16 h-16 bg-[#B6192E]/10 rounded-full items-center justify-center mb-4">
              <ShieldCheck size={32} color="#B6192E" />
            </View>
            <Text className="font-poppins text-[22px] text-black text-center mb-1">
              Horizonte Criado!
            </Text>
            <Text className="font-inter text-[#A3A3A3] text-center mb-6 px-4 text-[13px]">
              Bem-vindo ao sistema. Lembre-se:
            </Text>
            <View className="w-full gap-y-3 mb-6">
              <View className="flex-row items-center bg-gray-50 p-2 rounded-lg">
                <Check size={14} color="#B6192E" />
                <Text className="ml-3 font-inter text-[12px] text-gray-700">
                  Nunca compartilhe seu ID e Senha.
                </Text>
              </View>
              <View className="flex-row items-center bg-gray-50 p-2 rounded-lg">
                <Check size={14} color="#B6192E" />
                <Text className="ml-3 font-inter text-[12px] text-gray-700">
                  Seus dados são seus (Zero Trust).
                </Text>
              </View>
              <View className="flex-row items-center bg-gray-50 p-2 rounded-lg">
                <Check size={14} color="#B6192E" />
                <Text className="ml-3 font-inter text-[12px] text-gray-700">
                  Ative o 2FA nas configurações.
                </Text>
              </View>
            </View>
          </Animated.View>
        );
    }
  };

  return (
    <View className="flex-1 bg-white relative">
      {/* Background Decorativo */}
      <View
        className="absolute -bottom-[20%] -left-[20%] opacity-[0.03]"
        style={{ transform: [{ rotate: "-15deg" }] }}
      >
        <IsoLogo width={width} height={width} color="#000" />
      </View>

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 px-8 pt-2">
            {/* NOVO COMPONENTE REUTILIZÁVEL: SecureBadge */}
            <SecureBadge variant="dark" />

            {/* HEADER NAV (Esconde na etapa final) */}
            {step < 4 && (
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <TouchableOpacity
                    onPress={handleBack}
                    className="w-8 h-8 items-center justify-center rounded-full bg-gray-50 border border-gray-100"
                  >
                    <ArrowLeft size={16} color="black" />
                  </TouchableOpacity>
                  <Text className="font-inter text-[10px] text-[#A3A3A3] font-bold">
                    ETAPA {step + 1}/5
                  </Text>
                </View>
                {/* Barra de Progresso */}
                <View className="w-full h-1 bg-[#F2F2F2] rounded-full overflow-hidden">
                  <Animated.View
                    className="h-full bg-[#B6192E]"
                    layout={Layout.springify()}
                    style={{ width: `${progress}%` }}
                  />
                </View>
              </View>
            )}

            {/* CONTEÚDO DINÂMICO */}
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {renderStepContent()}
            </ScrollView>

            {/* FOOTER ACTIONS */}
            <View className="py-4">
              <HZButton
                title={
                  step === 4
                    ? "Acessar Plataforma"
                    : step === 3
                      ? "Finalizar Cadastro"
                      : "Continuar"
                }
                onPress={handleNext}
                loading={loading}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
