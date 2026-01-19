import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Animated, { Layout } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { HZButton } from "@/components/ui/HZButton";
import { SecureBadge } from "@/components/ui/SecureBadge";
import { mapErrorToHz } from "@/core/error-library/codes";
import { useAuthStore } from "@/features/auth/hooks/useAuth";

// Steps Modules
import { StepAccountType } from "../components/signup/StepAccountType";
import { StepBasicInfo } from "../components/signup/StepBasicInfo";
import { StepContext } from "../components/signup/StepContext";
import { StepHorizonID } from "../components/signup/StepHorizonID";
import { StepOnboarding } from "../components/signup/StepOnboarding";
import { StepPreferences } from "../components/signup/StepPreferences";
import { StepSecurity } from "../components/signup/StepSecurity";

// Assets
import IsoLogo from "../../../../assets/images/logo/isologo.svg";

const { width } = Dimensions.get("window");

export default function SignupScreen() {
  const [step, setStep] = useState(0);
  const { signUp, loading } = useAuthStore();

  // STATE
  const [formData, setFormData] = useState({
    accountType: "individual",
    name: "",
    phone: "",
    cep: "",
    city: "",
    state: "",
    street: "",
    isAddressConfirmed: false, // [NOVO] Obriga confirmação visual
    termsAccepted: false,

    email: "",
    horizonId: "",
    context: {} as any,
    preferences: { theme: "system", notifications: ["push"] },
    password: "",
    confirmPass: "",
    enable2FA: false,
  });

  // HELPERS
  const updateForm = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateNested = (
    parent: "context" | "preferences",
    key: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value },
    }));
  };

  const updateAddress = (city: string, state: string, street: string) => {
    setFormData((prev) => ({
      ...prev,
      city,
      state,
      street,
      isAddressConfirmed: false,
    })); // Reseta confirmação se mudar dados
  };

  const progress = ((step + 1) / 7) * 100;

  // NAVIGATION LOGIC
  const handleNext = async () => {
    Keyboard.dismiss(); // Fecha teclado ao avançar

    try {
      switch (step) {
        case 1: // Basic Info
          if (formData.name.length < 3)
            throw new Error("Insira seu nome completo.");
          if (formData.phone.length < 10) throw new Error("Telefone inválido.");
          if (!formData.isAddressConfirmed)
            throw new Error(
              "Por favor, confirme se o endereço do CEP está correto.",
            );
          if (!formData.termsAccepted)
            throw new Error(
              "É necessário aceitar os Termos e a Política de Privacidade.",
            );
          break;

        case 2: // ID
          if (!formData.email.includes("@"))
            throw new Error("E-mail inválido.");
          if (formData.horizonId.length < 3) throw new Error("ID muito curto.");
          break;

        case 5: // Security
          if (formData.password.length < 6)
            throw new Error("Senha muito curta (mínimo 6).");
          if (formData.password !== formData.confirmPass)
            throw new Error("Senhas não conferem.");
          await executeSignup();
          return;

        case 6: // Done
          router.replace("/(tabs)");
          return;
      }
      setStep((s) => s + 1);
    } catch (err: any) {
      Alert.alert("Atenção", err.message);
    }
  };

  const handleBack = () => {
    if (step === 0) router.back();
    else setStep((s) => s - 1);
  };

  const executeSignup = async () => {
    try {
      const payload = {
        email: formData.email,
        pass: formData.password,
        fullName: formData.name,
        horizonId: formData.horizonId,
        phone: formData.phone,
        accountType: formData.accountType,
        address: {
          cep: formData.cep,
          city: formData.city,
          state: formData.state,
          street: formData.street,
        },
        termsAccepted: formData.termsAccepted,
        context: formData.context,
        preferences: formData.preferences,
        enable2FA: formData.enable2FA,
      };
      const { error } = await signUp(payload);
      if (error) throw error;
      setStep(6);
    } catch (err: any) {
      const hzError = mapErrorToHz(err);
      Alert.alert(hzError.title, hzError.message);
    }
  };

  // RENDERER
  const renderScene = () => {
    switch (step) {
      case 0:
        return (
          <StepAccountType
            value={formData.accountType}
            onChange={(v: string) => updateForm("accountType", v)}
          />
        );

      case 1:
        return (
          <StepBasicInfo
            name={formData.name}
            setName={(v: string) => updateForm("name", v)}
            phone={formData.phone}
            setPhone={(v: string) => updateForm("phone", v)}
            cep={formData.cep}
            setCep={(v: string) => updateForm("cep", v)}
            addressData={{
              city: formData.city,
              state: formData.state,
              street: formData.street,
            }}
            setAddressData={updateAddress}
            isAddressConfirmed={formData.isAddressConfirmed}
            confirmAddress={() => updateForm("isAddressConfirmed", true)}
            terms={formData.termsAccepted}
            setTerms={(v: boolean) => updateForm("termsAccepted", v)}
          />
        );

      case 2:
        return (
          <StepHorizonID
            email={formData.email}
            setEmail={(v: string) => updateForm("email", v)}
            horizonId={formData.horizonId}
            setHorizonId={(v: string) => updateForm("horizonId", v)}
          />
        );

      case 3:
        return (
          <StepContext
            accountType={formData.accountType}
            data={formData.context}
            updateData={(k: string, v: string) => updateNested("context", k, v)}
          />
        );

      case 4:
        return (
          <StepPreferences
            theme={formData.preferences.theme}
            toggleTheme={() =>
              updateNested(
                "preferences",
                "theme",
                formData.preferences.theme === "dark" ? "light" : "dark",
              )
            }
          />
        );

      case 5:
        return (
          <StepSecurity
            pass={formData.password}
            setPass={(v: string) => updateForm("password", v)}
            confirm={formData.confirmPass}
            setConfirm={(v: string) => updateForm("confirmPass", v)}
            is2FA={formData.enable2FA}
            set2FA={(v: boolean) => updateForm("enable2FA", v)}
          />
        );

      case 6:
        return (
          <StepOnboarding
            horizonId={formData.horizonId}
            userGoal={
              formData.context.goal ||
              formData.context.projectName ||
              "Explorar"
            }
            onFinish={() => router.replace("/(tabs)")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white relative">
      <View
        className="absolute -bottom-[20%] -left-[20%] opacity-[0.03]"
        style={{ transform: [{ rotate: "-15deg" }] }}
      >
        <IsoLogo width={width} height={width} color="#000" />
      </View>
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        {/* Wrap para fechar teclado ao tocar fora */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <View className="flex-1 px-8 pt-2">
              <SecureBadge variant="dark" />

              {step < 6 && (
                <View className="mb-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <TouchableOpacity
                      onPress={handleBack}
                      className="w-8 h-8 items-center justify-center rounded-full bg-gray-50 border border-gray-100"
                    >
                      <ArrowLeft size={16} color="black" />
                    </TouchableOpacity>
                    <Text className="font-inter text-[10px] text-[#A3A3A3] font-bold">
                      ETAPA {step + 1}/7
                    </Text>
                  </View>
                  <View className="w-full h-1 bg-[#F2F2F2] rounded-full overflow-hidden">
                    <Animated.View
                      className="h-full bg-[#B6192E]"
                      layout={Layout.springify()}
                      style={{ width: `${progress}%` }}
                    />
                  </View>
                </View>
              )}

              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {renderScene()}
              </ScrollView>

              <View className="py-4">
                <HZButton
                  title={
                    step === 6
                      ? "Acessar Plataforma"
                      : step === 5
                        ? "Finalizar Cadastro"
                        : "Continuar"
                  }
                  onPress={handleNext}
                  loading={loading}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  );
}
