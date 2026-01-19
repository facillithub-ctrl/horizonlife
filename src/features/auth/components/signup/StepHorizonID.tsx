import { HZInput } from "@/components/ui/HZInput";
import { useAuthStore } from "@/features/auth/hooks/useAuth";
import { AtSign, Check, Mail, XCircle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";

export const StepHorizonID = ({
  email,
  setEmail,
  horizonId,
  setHorizonId,
}: any) => {
  const { checkHandleAvailability } = useAuthStore();
  const [status, setStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (horizonId.length > 2) {
        setStatus("checking");
        const available = await checkHandleAvailability(horizonId);
        setStatus(available ? "available" : "taken");
      } else {
        setStatus("idle");
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [horizonId]);

  return (
    <Animated.View entering={SlideInRight} className="flex-1">
      <Text className="font-poppins text-[22px] text-black mb-1">
        Crie sua Identidade
      </Text>
      <Text className="font-inter text-[#A3A3A3] mb-6 text-[13px]">
        Seu handle único no ecossistema.
      </Text>

      <HZInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        icon={<Mail size={20} color="#B6192E" />}
      />

      <View className="mt-2 relative">
        <HZInput
          label="Horizon ID"
          value={horizonId}
          onChangeText={(t: string) =>
            setHorizonId(t.toLowerCase().replace(/[^a-z0-9._]/g, ""))
          }
          autoCapitalize="none"
          icon={<AtSign size={20} color="#B6192E" />}
        />
        <View className="absolute right-4 top-[38px]">
          {status === "checking" && (
            <ActivityIndicator size="small" color="#B6192E" />
          )}
          {status === "available" && <Check size={16} color="green" />}
          {status === "taken" && <XCircle size={16} color="red" />}
        </View>
      </View>
    </Animated.View>
  );
};
