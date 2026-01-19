import { HZInput } from "@/components/ui/HZInput";
import { Check, Fingerprint, Lock, ShieldAlert } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";

interface StepSecurityProps {
  pass: string;
  setPass: (t: string) => void;
  confirm: string;
  setConfirm: (t: string) => void;
  is2FA: boolean;
  set2FA: (v: boolean) => void;
}

export const StepSecurity = ({
  pass,
  setPass,
  confirm,
  setConfirm,
  is2FA,
  set2FA,
}: StepSecurityProps) => {
  return (
    <Animated.View entering={SlideInRight} className="flex-1">
      <Text className="font-poppins text-[22px] text-black mb-1">
        Segurança
      </Text>
      <Text className="font-inter text-[#A3A3A3] mb-6 text-[13px]">
        Defina suas credenciais de acesso.
      </Text>

      <HZInput
        label="Senha Mestra"
        value={pass}
        onChangeText={setPass}
        secureTextEntry
        placeholder="Mínimo 6 caracteres"
        icon={<Lock size={20} color="#B6192E" />}
      />

      <HZInput
        label="Confirmar Senha"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        placeholder="Repita a senha"
        icon={
          <Check
            size={20}
            color={pass === confirm && pass.length > 0 ? "#B6192E" : "#D4D4D4"}
          />
        }
      />

      {/* 2FA Card */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => set2FA(!is2FA)}
        className={`mt-2 p-4 rounded-xl border flex-row items-center justify-between ${is2FA ? "bg-[#B6192E]/5 border-[#B6192E]" : "bg-white border-[#F2F2F2]"}`}
      >
        <View className="flex-row items-center flex-1 pr-4">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${is2FA ? "bg-[#B6192E]/10" : "bg-gray-100"}`}
          >
            <Fingerprint size={20} color={is2FA ? "#B6192E" : "#A3A3A3"} />
          </View>
          <View>
            <Text
              className={`font-bold text-[13px] ${is2FA ? "text-[#B6192E]" : "text-gray-600"}`}
            >
              Ativar 2FA
            </Text>
            <Text className="text-[10px] text-gray-400 leading-3 mt-1">
              Adiciona uma camada extra via App Autenticador.
            </Text>
          </View>
        </View>
        <View
          className={`w-5 h-5 rounded-full border items-center justify-center ${is2FA ? "bg-[#B6192E] border-[#B6192E]" : "border-gray-300"}`}
        >
          {is2FA && <Check size={12} color="white" />}
        </View>
      </TouchableOpacity>

      <View className="flex-row items-center mt-6 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
        <ShieldAlert size={16} color="#D97706" />
        <Text className="text-[10px] text-yellow-800 ml-2 flex-1">
          Sua senha será criptografada (hash + salt) antes de ser armazenada.
          Ninguém, nem o Horizon, tem acesso a ela.
        </Text>
      </View>
    </Animated.View>
  );
};
