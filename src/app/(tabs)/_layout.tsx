// src/app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Circle } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#B6192E",
        tabBarStyle: { borderTopColor: "#F2F2F2", backgroundColor: "#FFFFFF" },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Circle size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
