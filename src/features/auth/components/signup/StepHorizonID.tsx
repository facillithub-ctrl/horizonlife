import { HZInput } from "@/components/ui/HZInput";
import { useAuthStore } from "@/features/auth/hooks/useAuth";
import { AtSign, Check, Mail, Sparkles, XCircle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";

export const StepHorizonID = ({
  email,
  setEmail,
  horizonId,
  setHorizonId,
}: any) => {
  const { checkHandleAvailability, checkEmailAvailability } = useAuthStore();

  // Status States
  const [idStatus, setIdStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");

  // Feedback Messages
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Debounce ID
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (horizonId.length > 2) {
        setIdStatus("checking");
        const available = await checkHandleAvailability(horizonId);
        setIdStatus(available ? "available" : "taken");

        // Easter eggs de feedback
        if (available) {
          const msgs = [
            "Nome dahora!",
            "Curti esse ID.",
            "Autêntico.",
            "Esse é raro!",
            "Tudo certo.",
          ];
          setFeedbackMsg(msgs[Math.floor(Math.random() * msgs.length)]);
        }
      } else {
        setIdStatus("idle");
        setFeedbackMsg("");
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [horizonId]);

  // Debounce Email
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (email.includes("@") && email.length > 5) {
        setEmailStatus("checking");
        const valid = await checkEmailAvailability(email);
        setEmailStatus(valid ? "valid" : "invalid");
      } else {
        setEmailStatus("idle");
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [email]);

  return (
    <Animated.View entering={SlideInRight} className="flex-1">
      <Text className="font-poppins text-[22px] text-black mb-1">
        Crie sua Identidade
      </Text>
      <Text className="font-inter text-[#A3A3A3] mb-6 text-[13px]">
        Como você será reconhecido no ecossistema.
      </Text>

      {/* EMAIL INPUT */}
      <View className="mb-2 relative">
        <HZInput
          label="E-mail de Acesso"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          icon={<Mail size={20} color="#B6192E" />}
        />
        <View className="absolute right-4 top-[38px]">
          {emailStatus === "checking" && (
            <ActivityIndicator size="small" color="#B6192E" />
          )}
          {emailStatus === "valid" && <Check size={16} color="green" />}
          {emailStatus === "invalid" && <XCircle size={16} color="red" />}
        </View>
      </View>

      {/* HORIZON ID INPUT */}
      <View className="mt-2 relative">
        <HZInput
          label="Escolha seu Horizon ID"
          value={horizonId}
          onChangeText={(t: string) =>
            setHorizonId(t.toLowerCase().replace(/[^a-z0-9._]/g, ""))
          }
          autoCapitalize="none"
          placeholder="usuario.unico"
          icon={<AtSign size={20} color="#B6192E" />}
        />

        {/* INDICADORES VISUAIS */}
        <View className="absolute right-4 top-[38px]">
          {idStatus === "checking" && (
            <ActivityIndicator size="small" color="#B6192E" />
          )}
          {idStatus === "available" && (
            <Animated.View entering={FadeIn}>
              <Check size={16} color="green" />
            </Animated.View>
          )}
          {idStatus === "taken" && <XCircle size={16} color="red" />}
        </View>

        {/* MENSAGEM DE FEEDBACK DIVERTIDA */}
        {idStatus === "available" && (
          <Animated.View
            entering={FadeIn}
            className="flex-row items-center mt-[-8px] ml-1"
          >
            <Sparkles size={12} color="#B6192E" />
            <Text className="text-[11px] text-[#B6192E] font-bold ml-1">
              {feedbackMsg}
            </Text>
          </Animated.View>
        )}

        {idStatus === "taken" && (
          <Text className="text-[11px] text-red-500 font-bold ml-1 mt-[-8px]">
            Esse ID já está sendo usado.
          </Text>
        )}
      </View>
    </Animated.View>
  );
};
