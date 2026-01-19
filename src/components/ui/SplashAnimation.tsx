import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");
const MAX_SCALE = Math.max(width, height) / 20;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const HORIZON_RED = "#B6192E";
const LOGO_SIZE = 120;
const PATH_LENGTH = 400;

interface SplashProps {
  onFinish: () => void;
}

export const SplashAnimation = ({ onFinish }: SplashProps) => {
  const progress = useSharedValue(0);
  const expand = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Função Wrapper para garantir que o onFinish rode na Thread JS
  const triggerFinish = () => {
    "worklet";
    runOnJS(onFinish)();
  };

  useEffect(() => {
    // 1. Sequência Principal de Animação
    progress.value = withSequence(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      withTiming(
        1,
        { duration: 1000, easing: Easing.inOut(Easing.ease) },
        () => {
          // Callback ao fim da "respiração" -> Inicia Expansão
          expand.value = withTiming(
            1,
            { duration: 800, easing: Easing.cubic },
            () => {
              // Callback ao fim da expansão -> Inicia Fade Out
              opacity.value = withTiming(0, { duration: 500 }, () => {
                // FIM: Chama o Login
                triggerFinish();
              });
            },
          );
        },
      ),
    );

    // 2. [SAFETY NET] Garantia contra travamento
    // Se por algum motivo a animação travar, em 5 segundos forçamos a ida para o login.
    const safetyTimer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(safetyTimer);
  }, []);

  const animatedPathProps = useAnimatedProps(() => {
    // Durante expansão, mantém preenchido
    if (expand.value > 0.1) return { strokeDashoffset: 0, fillOpacity: 1 };

    const strokeDashoffset = interpolate(
      progress.value,
      [0, 1],
      [PATH_LENGTH, 0],
    );
    const fillOpacity = interpolate(progress.value, [0, 0.5, 1], [0, 0, 1]);
    return { strokeDashoffset, fillOpacity };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const breathingScale = interpolate(progress.value, [0, 1], [0.9, 1.1]);
    const explosionScale = interpolate(expand.value, [0, 1], [1, MAX_SCALE]);

    return {
      opacity: opacity.value,
      transform: [
        { scale: breathingScale * explosionScale },
        { rotate: `${interpolate(progress.value, [0, 1], [-5, 0])}deg` },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          { width: LOGO_SIZE, height: LOGO_SIZE },
          animatedContainerStyle,
        ]}
      >
        <Svg viewBox="0 0 100 100" style={{ overflow: "visible" }}>
          <AnimatedPath
            d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z"
            stroke={HORIZON_RED}
            strokeWidth={2}
            strokeLinecap="round"
            fill={HORIZON_RED}
            strokeDasharray={[PATH_LENGTH, PATH_LENGTH]}
            animatedProps={animatedPathProps}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999, // Garante prioridade visual
  },
});
export default SplashAnimation;
