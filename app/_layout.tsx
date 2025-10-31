// app/_layout.tsx
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { User } from "lucide-react-native";

import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });
  useEffect(() => {
    if (fontsLoaded) {
      (Text as any).defaultProps = (Text as any).defaultProps || {};
      (Text as any).defaultProps.style = {
        ...((Text as any).defaultProps.style || {}),
        fontFamily: "Inter-Regular",
      };
    }
  }, [fontsLoaded]);
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  if (!fontsLoaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ position: 'absolute', top: 50, right: 20, zIndex: 1000 }}>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <User size={24} color="#16A34A" />
        </TouchableOpacity>
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
    </GestureHandlerRootView>
  );
}
