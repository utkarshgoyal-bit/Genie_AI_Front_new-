import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { Fonts } from "../constants/Fonts";
export default function SplashScreen() {
  const router = useRouter();
  const navigateTo = "/Login";
  // const { height } = useWindowDimensions();
  const contentAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  // const blurhash =
  //   "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  // Bouncing animation for the swipe up icon
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);
  useEffect(() => {
    const clearStorageOnStart = async () => {
      const isDev = __DEV__;
      if (isDev) {
        try {
          await AsyncStorage.clear();
          // AsyncStorage cleared for development
        } catch (e) {
          // Failed to clear storage
        }
      }
    };
    clearStorageOnStart();
    // Content entrance animation
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 1000,
      delay: 500, // Start after a short delay
      useNativeDriver: true,
    }).start();
  }, [contentAnim]);
  const handleGetStarted = () => {
    router.replace(navigateTo);
  };
  // const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
  //   if (event.nativeEvent.state === State.END) {
  //     const { translationY, velocityY } = event.nativeEvent;
  //     if (translationY < -50 || velocityY < -500) {
  //       handleGetStarted();
  //     }
  //   }
  // };
  // const contentStyle = {
  //   opacity: contentAnim,
  //   transform: [
  //     {
  //       translateY: contentAnim.interpolate({
  //         inputRange: [0, 1],
  //         outputRange: [50, 0],
  //       }),
  //     },
  //   ],
  // };
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/gif/FinalLoader.gif")}
        style={styles.image}
        contentFit="contain"
      />
      {/* <View style={styles.overlay} /> */}
      {/* <SafeAreaView
        style={styles.safeArea}
        edges={["bottom"]}>
        <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
          <Animated.View style={[contentStyle, { flex: 1, minHeight: height + 1 }]}>
            <View style={styles.contentContainer}>
              <View style={styles.textContainer}>
                <ThemedText
                  type="title"
                  style={[styles.title, { color: "#FFF" }]}>
                  Welcome to Genie AI
                </ThemedText>
                <ThemedText
                  type="default"
                  style={[styles.subtitle, { color: "rgba(255, 255, 255, 0.8)" }]}>
                  Plant Buddy
                </ThemedText>
              </View>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={1}>
                <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
                  <ChevronUp
                    color={Colors.light.background}
                    size={28}
                  />
                </Animated.View>
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.buttonText, { color: "#FFF" }]}>
                  Get Started
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </SafeAreaView> */}

      <View style={styles.textContainer}>
        <ThemedText
          type="title"
          style={[styles.title, { color: "#000" }]}>
          Welcome to Genie AI
        </ThemedText>
        <ThemedText
          type="default"
          style={[styles.subtitle, { color: "rgba(78, 76, 76, 0.8)" }]}>
          Plant Buddy
        </ThemedText>
        <Pressable
          style={styles.button}
          onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 70,
    backgroundColor: "#fff", // Fallback background color
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between", // Pushes content to top and bottom
    padding: 30,
    paddingBottom: 60, // More padding at the bottom for the button
  },
  textContainer: {
    alignItems: "center",
    padding: 20, // Push text down from the top
  },
  title: {
    fontSize: 42,
    lineHeight: 40,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: Fonts.Poppins.bold,
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: Fonts.Poppins.regular,
  },
  image: {
    width: "100%",
    height: "60%",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "center",
    width: "46%",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
    fontFamily: Fonts.Poppins.bold,
  },
});
