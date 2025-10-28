import ExploreCards from "@/components/ExploreCards";
import { rawPlantCategories } from "@/constants/plants";
import Button from "@/Shared/Button";
import { router } from "expo-router";
import { ArrowRight, Sparkles } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, Text, View } from "react-native";

const Login = ({ styles }: { styles: any }) => {
  const [visiblePlants, setVisiblePlants] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const heroAnimation = useRef(new Animated.Value(0)).current;
  const statsAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const trustAnimation = useRef(new Animated.Value(0)).current;

  const animations = useRef(rawPlantCategories.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Start hero animation immediately
    Animated.timing(heroAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Stagger stats animation
    setTimeout(() => {
      Animated.timing(statsAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    // Show plant cards sequentially
    const showCardsSequentially = (index: number) => {
      if (index < rawPlantCategories.length) {
        setVisiblePlants((prev) => prev + 1);
        Animated.timing(animations[index], {
          toValue: 1,
          duration: 10,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => showCardsSequentially(index + 1), 100);
        });
      } else {
        // Show button and trust section
        setShowContent(true);
        Animated.timing(buttonAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          Animated.timing(trustAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 200);
      }
    };

    setTimeout(() => showCardsSequentially(0), 800);
  }, [animations, heroAnimation, statsAnimation, buttonAnimation, trustAnimation]);

  const ModernHeroSection = () => (
    <Animated.View
      style={[
        styles.heroSection,
        {
          opacity: heroAnimation,
          transform: [
            {
              translateY: heroAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}>
      <View style={styles.heroContent}>
        <View style={styles.titleRow}>
          <Sparkles
            size={28}
            color="#4CAF50"
          />
          <Text style={styles.heroTitle}>Genie AI</Text>
        </View>
        <Text style={styles.heroSubtitle}>
          Get instant plant health diagnosis and personalized care tips powered by AI
        </Text>

        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: statsAnimation,
              transform: [
                {
                  translateY: statsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>10+</Text>
              <Text style={styles.statLabel}>Plant Types</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>90%</Text>
              <Text style={styles.statLabel}>AI Accuracy Detection</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>80%</Text>
              <Text style={styles.statLabel}>AI Accuracy Diagnosis</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const TrustSection = () => (
    <Animated.View
      style={[
        styles.trustSection,
        {
          opacity: trustAnimation,
          transform: [
            {
              translateY: trustAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {showContent && (
        <View style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingHorizontal: 20,
        }}>
          <Button
            text="Get Started"
            onPress={() => router.replace("/phoneVerification")}
            postIcon={
              <ArrowRight
                size={16}
                color="#fff"
              />
            }
          />
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ModernHeroSection />

        <View style={styles.plantsSection}>
          <Text style={styles.plantsTitle}>Supported Plant Types</Text>
          <View style={styles.grid}>
            {rawPlantCategories.slice(0, visiblePlants).map((plant, index) => (
              <ExploreCards
                index={index}
                animations={animations}
                plant={plant}
                styles={styles}
                key={index}
              />
            ))}
          </View>
        </View>

        {showContent && (
          <>
            <TrustSection />
            {/* <Footer
              typedLastText="Specialized for Indian Household Plants"
              styles={styles}
            /> */}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Login;
