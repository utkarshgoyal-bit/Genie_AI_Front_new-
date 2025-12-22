import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { Image } from "expo-image";

const phrases = ["Genie AI is Thinking..", "Processing...", "Analyzing...", "Computing..."];

const GenieThinking: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/gif/second-gif.gif")}
        style={styles.robotImage}
        contentFit="contain"
        cachePolicy={"memory-disk"}
        priority={"high"}
        responsivePolicy={"static"}
      />

      {/* Thinking text */}
      {/* <Animated.Text style={[styles.thinkingText, { opacity: fadeAnim }]}>
        {phrases[phraseIndex]}
      </Animated.Text> */}

      {/* Thinking dots */}
      {/* <View style={styles.dotsContainer}>
        {[0, 1, 2].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                transform: [
                  {
                    translateY: new Animated.Value(0).interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, -4, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ],
                animationDelay: `${i * 300}ms`,
              },
            ]}
          />
        ))}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 200,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffff",
  },
  robotImage: {
    width: "100%",
    height: "100%",
  },
  thinkingText: {
    position: "absolute",
    top: 15,
    left: "55%",
    transform: [{ translateX: -0.5 }],
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
    width: "32%",
  },
  dotsContainer: {
    position: "absolute",
    top: 40,
    left: "57%",
    flexDirection: "row",
    gap: 2,
    transform: [{ translateX: -0.5 }],
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "white",
    marginHorizontal: 1,
  },
});

export default GenieThinking;
