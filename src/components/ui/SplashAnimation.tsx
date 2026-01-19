import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Configurações do Design System (Baseadas no seu CSS)
const HORIZON_RED = "#B6192E";
const LOGO_SIZE = 150; // var(--isologo-size)
const PATH_LENGTH = 400; // stroke-dasharray: 400

interface SplashProps {
  onFinish: () => void;
}

export const SplashAnimation = ({ onFinish }: SplashProps) => {
  const progress = useSharedValue(0);
  const expand = useSharedValue(0);

  useEffect(() => {
    // Replica o keyframe 'construct-loop' do seu CSS
    progress.value = withSequence(
      // 0% -> 30%: Desenha o traço (stroke-dashoffset: 400 -> 0)
      withTiming(0.3, { duration: 600, easing: Easing.inOut(Easing.ease) }),

      // 30% -> 50%: Preenche (fill-opacity: 0 -> 1) + Rotaciona (0deg)
      withTiming(0.5, { duration: 400, easing: Easing.inOut(Easing.ease) }),

      // 50% -> 80%: Mantém preenchido (Pausa dramática)
      withDelay(600, withTiming(0.8, { duration: 100, easing: Easing.linear })),

      // 80% -> 100%: Fim do loop -> Gatilho para Expansão/Saída
      withTiming(1, { duration: 400 }, () => {
        // Inicia a "explosão" para transição
        expand.value = withTiming(
          1,
          { duration: 800, easing: Easing.bezier(0.25, 1, 0.5, 1) },
          () => {
            runOnJS(onFinish)();
          },
        );
      }),
    );
  }, []);

  // 1. Animação das propriedades do SVG (Traço e Preenchimento)
  const animatedPathProps = useAnimatedProps(() => {
    // Se estiver expandindo, mantém sólido
    if (expand.value > 0) return { strokeDashoffset: 0, fillOpacity: 1 };

    // 0% a 30%: 400 -> 0
    // 30% a 100%: 0
    const strokeDashoffset = interpolate(
      progress.value,
      [0, 0.3, 1],
      [PATH_LENGTH, 0, 0],
    );

    // 0% a 30%: Opacidade 0
    // 30% a 50%: Opacidade 0 -> 1
    // 50% a 100%: Opacidade 1
    const fillOpacity = interpolate(
      progress.value,
      [0, 0.3, 0.5, 1],
      [0, 0, 1, 1],
    );

    return { strokeDashoffset, fillOpacity };
  });

  // 2. Animação de Transformação (Container)
  const animatedContainerStyle = useAnimatedStyle(() => {
    // Rotação inicial (-10deg) até ficar reta (0deg)
    const rotate = interpolate(progress.value, [0, 0.5], [-10, 0]);

    // Escala: Normal -> Explosão Gigante (Preenche a tela)
    const scale = interpolate(expand.value, [0, 1], [1, 20]);

    // Fade Out durante a explosão
    const opacity = interpolate(expand.value, [0, 0.5, 1], [1, 1, 0]);

    return {
      opacity,
      transform: [{ rotate: `${rotate}deg` }, { scale }],
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
    backgroundColor: "#FFFFFF", // Fundo Branco Puro
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
});
