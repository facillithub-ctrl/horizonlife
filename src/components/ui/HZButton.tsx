import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface HZButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary";
}

export const HZButton = ({
  title,
  onPress,
  loading,
  variant = "primary",
}: HZButtonProps) => {
  const isPrimary = variant === "primary";
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
      style={{ borderRadius: 12 }}
      className={`h-14 w-full flex-row items-center justify-center ${isPrimary ? "bg-[#B6192E]" : "bg-white border border-[#F2F2F2]"}`}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "white" : "black"} />
      ) : (
        <Text
          className={`font-poppins text-[16px] ${isPrimary ? "text-white" : "text-black"}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
