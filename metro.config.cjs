// metro.config.cjs
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// 1. Obtém a configuração padrão do Expo
const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

// 2. Configuração do SVG Transformer
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
};

// 3. Envolve a configuração final com o NativeWind
// O input aponta para o arquivo CSS que já validamos na estrutura
module.exports = withNativeWind(config, { input: "./src/styles/global.css" });
