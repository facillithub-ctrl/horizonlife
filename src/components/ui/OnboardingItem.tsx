import React from "react";
import { Dimensions, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

// [FIX] Caminhos ajustados para 3 níveis de profundidade (src/components/ui -> root)
import LifeLogo from "../../../assets/images/logo/life.svg";
import AccountLogo from "../../../assets/images/subsidiras/account.svg";
import GroupLogo from "../../../assets/images/subsidiras/horiziongroup.svg";

const { width } = Dimensions.get("window");

interface OnboardingItemProps {
  index: number;
  title: string;
  description: string;
  iconType: "life" | "account" | "group";
}

export const OnboardingItem = ({
  index,
  title,
  description,
  iconType,
}: OnboardingItemProps) => {
  const renderIcon = () => {
    switch (iconType) {
      case "life":
        return <LifeLogo width={width * 0.6} height={120} />;
      case "account":
        return <AccountLogo width={width * 0.4} height={120} />;
      case "group":
        return <GroupLogo width={width * 0.5} height={120} />;
      default:
        return <LifeLogo width={200} height={100} />;
    }
  };

  return (
    <View style={{ width }} className="items-center justify-center px-8 pb-20">
      <Animated.View
        entering={FadeInUp.delay(index * 100)
          .duration(800)
          .springify()}
        className="items-center"
      >
        <View className="h-[250px] items-center justify-center mb-8">
          {renderIcon()}
        </View>

        <Text className="font-poppins text-[28px] text-black text-center leading-tight mb-4">
          {title}
        </Text>

        <Text className="font-inter text-[#A3A3A3] text-[16px] text-center leading-6 max-w-[300px]">
          {description}
        </Text>
      </Animated.View>
    </View>
  );
};
