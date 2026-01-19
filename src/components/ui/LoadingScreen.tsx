import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Configurações Visuais
const HORIZON_RED = "#B6192E";
const LOGO_SIZE = width * 0.4; // Responsivo: 40% da largura da tela
const PATH_LENGTH = 400;

export const LoadingScreen = ({
  message = "CARREGANDO...",
}: {
  message?: string;
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, []);

  // Animação do Logo (Traço e Preenchimento)
  const animatedPathProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      progress.value,
      [0, 0.3, 1],
      [PATH_LENGTH, 0, 0],
    );
    const fillOpacity = interpolate(
      progress.value,
      [0, 0.3, 0.5, 0.8, 1],
      [0, 0, 1, 1, 0],
    );
    return { strokeDashoffset, fillOpacity };
  });

  // Animação do Container (Escala e Rotação)
  const animatedContainerStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      progress.value,
      [0, 0.5, 0.8, 1],
      [0.8, 1, 1, 1.1],
    );
    const rotate = interpolate(progress.value, [0, 0.5], [-10, 0]);
    const opacity = interpolate(progress.value, [0.8, 1], [1, 0]);
    return { opacity, transform: [{ scale }, { rotate: `${rotate}deg` }] };
  });

  // Animação do Texto (Pulsar Opacidade)
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.5, 1], [0.4, 1, 0.4]);
    return { opacity };
  });

  return (
    <View style={styles.container}>
      {/* Container do Logo */}
      <View style={{ width: LOGO_SIZE, height: LOGO_SIZE }}>
        <Animated.View
          style={[{ width: "100%", height: "100%" }, animatedContainerStyle]}
        >
          <Svg viewBox="0 0 100 100" style={{ overflow: "visible" }}>
            <AnimatedPath
              d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z"
              stroke={HORIZON_RED}
              strokeWidth={3} // Traço um pouco mais grosso
              strokeLinecap="round"
              fill={HORIZON_RED}
              strokeDasharray={[PATH_LENGTH, PATH_LENGTH]}
              animatedProps={animatedPathProps}
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Texto Estilizado */}
      <Animated.Text style={[styles.text, animatedTextStyle]}>
        {message}
      </Animated.Text>
    </View>
  );
};

// Estilos fixos para garantir centralização independente do Tailwind
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    marginTop: 40,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#B6192E",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
});
