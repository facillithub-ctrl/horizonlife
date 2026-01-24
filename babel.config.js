module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind", // Ativa o compilador do NativeWind v4
        },
      ],
    ],
    plugins: [
      "react-native-reanimated/plugin", // Deve ser sempre o último plugin
    ],
  };
};
