// app/_layout.tsx
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MiniTabBar from "../components/MiniTabBar";
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });
  const pathname = usePathname();
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
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
      {(pathname === "/product" || pathname === "/profile") && <MiniTabBar visible={true} />}
    </GestureHandlerRootView>
  );
}
