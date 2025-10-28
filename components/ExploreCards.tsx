import { Image } from "expo-image";
import { useRef } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";

const ExploreCards = ({
  index,
  styles,
  animations,
  plant,
}: {
  index: number;
  styles: any;
  animations: any;
  plant: { image: string; name: string };
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const pressValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(pressValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(pressValue, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        key={index}
        style={[
          styles.card,
          {
            opacity: animations[index],
            transform: [
              {
                scale: Animated.multiply(
                  animations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                  scaleValue
                ),
              },
            ],
            shadowOpacity: pressValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.2],
            }),
            elevation: pressValue.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 8],
            }),
          },
        ]}>
        <Animated.View
          style={[
            styles.imageContainer,
            {
              transform: [
                {
                  rotateY: pressValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "5deg"],
                  }),
                },
              ],
            },
          ]}>
          <Image
            source={plant.image}
            style={styles.image}
            priority={"high"}
            responsivePolicy={"static"}
            cachePolicy={"memory-disk"}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.cardContent,
            {
              transform: [
                {
                  translateY: pressValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -2],
                  }),
                },
              ],
            },
          ]}>
          <Text style={styles.cardText}>{plant.name}</Text>
          <Animated.View
            style={[
              styles.supportedBadge,
              {
                opacity: pressValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              },
            ]}>
            <Text style={styles.supportedText}>✓ Supported</Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ExploreCards;
