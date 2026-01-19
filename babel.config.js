module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel", // O plugin clássico da v2
      "react-native-reanimated/plugin",
    ],
  };
};
