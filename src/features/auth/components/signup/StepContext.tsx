import { HZInput } from "@/components/ui/HZInput";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";

interface StepContextProps {
  accountType: string;
  data: any;
  updateData: (key: string, value: string) => void;
}

// Componente de Chip Selecionável
const SelectableChip = ({ label, selected, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mr-2 mb-2 px-4 py-2 rounded-full border ${selected ? "bg-[#B6192E] border-[#B6192E]" : "bg-white border-gray-200"}`}
  >
    <Text
      className={`text-[12px] font-inter ${selected ? "text-white font-bold" : "text-gray-600"}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// Opções Pré-definidas
const OPTIONS = {
  STARTUP_STAGE: ["Ideia", "MVP", "Validação", "Tração", "Escala"],
  TEAM_SIZE: ["Solo", "2-5", "6-10", "11-50", "50+"],
  GOALS: ["Produtividade", "Gestão Financeira", "Social", "Estudos", "Saúde"],
  SECTORS: ["Tecnologia", "Saúde", "Varejo", "Educação", "Finanças"],
};

export const StepContext = ({
  accountType,
  data,
  updateData,
}: StepContextProps) => {
  // Renderiza uma lista de chips para um campo
  const renderChipGroup = (
    label: string,
    fieldKey: string,
    options: string[],
  ) => (
    <View className="mb-5">
      <Text className="font-inter text-[12px] text-gray-500 mb-2 ml-1 uppercase tracking-wide">
        {label}
      </Text>
      <View className="flex-row flex-wrap">
        {options.map((opt) => (
          <SelectableChip
            key={opt}
            label={opt}
            selected={data[fieldKey] === opt}
            onPress={() => updateData(fieldKey, opt)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <Animated.View entering={SlideInRight} className="flex-1">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="font-poppins text-[22px] text-black">Contexto</Text>
        <Text className="text-[10px] text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded">
          Opcional
        </Text>
      </View>
      <Text className="font-inter text-[#A3A3A3] mb-6 text-[13px]">
        Ajude-nos a adaptar o Horizon para o seu perfil.
      </Text>

      {accountType === "startup" && (
        <>
          <HZInput
            label="Nome do Projeto"
            value={data.projectName}
            onChangeText={(t) => updateData("projectName", t)}
            placeholder="Ex: Next Unicorn"
          />
          {renderChipGroup("Estágio Atual", "stage", OPTIONS.STARTUP_STAGE)}
          {renderChipGroup("Tamanho do Time", "teamSize", OPTIONS.TEAM_SIZE)}
        </>
      )}

      {accountType === "individual" && (
        <>
          {renderChipGroup("Objetivo Principal", "goal", OPTIONS.GOALS)}
          <HZInput
            label="Profissão Atual"
            value={data.job}
            onChangeText={(t) => updateData("job", t)}
            placeholder="O que você faz?"
          />
        </>
      )}

      {accountType === "enterprise" && (
        <>
          <HZInput
            label="Nome da Empresa"
            value={data.company}
            onChangeText={(t) => updateData("company", t)}
            placeholder="Razão Social"
          />
          {renderChipGroup("Setor", "sector", OPTIONS.SECTORS)}
          <HZInput
            label="Seu Cargo"
            value={data.role}
            onChangeText={(t) => updateData("role", t)}
          />
        </>
      )}

      {/* Estudante mantivemos input pois é muito variado, mas poderia ser lista de cursos genérica */}
      {accountType === "student" && (
        <>
          <HZInput
            label="Instituição"
            value={data.institution}
            onChangeText={(t) => updateData("institution", t)}
          />
          <HZInput
            label="Curso"
            value={data.course}
            onChangeText={(t) => updateData("course", t)}
          />
        </>
      )}
    </Animated.View>
  );
};
