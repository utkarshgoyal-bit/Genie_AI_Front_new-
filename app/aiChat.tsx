import { plantAnalysisApi } from "@/api/plantAnalysis";
import { NoPlantFound } from "@/components/NoPlantFound";
import GenieAIThinking from "@/components/ui/GenieThinking";
import { Colors } from "@/constants/Colors";
import { allowedPlants, analysisSteps } from "@/constants/image";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Lightbulb, Sparkles } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Fonts } from "../constants/Fonts";

const AIChatScreen = () => {
  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { images, status } = useLocalSearchParams();

  useEffect(() => {
    if (displayProgress < progress) {
      const interval = setInterval(() => {
        setDisplayProgress((prev) => {
          if (prev < progress) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [progress]);

  const uploadedImages = React.useMemo(() => {
    try {
      return images ? JSON.parse(images as string) : [];
    } catch (e) {
      console.log("Image parse error:", e, images);
      return [];
    }
  }, [images]);

  const uploadAndAnalyze = useCallback(async () => {
    setLoading(true);
    const formData = new FormData();
    uploadedImages.forEach((uri: any, index: number) => {
      formData.append("images", {
        uri,
        name: `plant_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    try {
      const plantData = await plantAnalysisApi({
        formData,
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          if (total) {
            const percentage = Math.min(90, Math.round((loaded * 100) / total));
            setProgress(percentage);
          }
        },
      });

      if (!plantData?.isAxiosError) {
        setProgress(100);

        const waitInterval = setInterval(() => {
          setDisplayProgress((prev) => {
            if (prev >= 100) {
              clearInterval(waitInterval);
              const detectedPlant = plantData?.scientific_name?.toLowerCase().trim();

              if (!Object.keys(allowedPlants).includes(detectedPlant)) {
                setAlertVisible(true);
                return prev;
              }

              plantData.common_name = allowedPlants[detectedPlant];

              router.replace({
                pathname: "/diagnosis",
                params: {
                  images: JSON.stringify(uploadedImages),
                  result: JSON.stringify(plantData),
                },
              });
            } else {
              return prev + 1; // Smoothly fill remaining progress
            }
            return prev;
          });
        }, 20);
      } else {
        console.error("Upload error:", plantData?.response?.data.detail);
        Alert.alert(
          `Upload Error ${plantData.code} ${plantData.status}`,
          plantData?.response?.data.detail || "There was an error uploading the images.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert(
        `Upload Error ${error.code}: ${error.status}`,
        error?.response?.data.detail || "There was an error uploading the images.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } finally {
      setLoading(false);
    }
  }, [uploadedImages]);

  useEffect(() => {
    if (status === "loading" && uploadedImages.length > 0) {
      uploadAndAnalyze();
    }
  }, [status, uploadAndAnalyze, uploadedImages, uploadedImages.length]);

  if (status === "loading") {
    return (
      <ScrollView style={styles.container}>
        {loading && (
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Sparkles
                color="green"
                size={24}
              />
              <Text style={styles.title}>AI Analysis</Text>
            </View>
            <Text style={styles.subtitle}>Genie AI is analyzing your plant</Text>
          </View>
        )}

        {loading && (
          <View style={styles.genieContainer}>
            <GenieAIThinking />
          </View>
        )}

        {loading && uploadedImages.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Uploaded Images</Text>
            <View style={styles.imageRow}>
              {uploadedImages.map((uri: any, index: number) => (
                <View
                  key={index}
                  style={styles.imageWrapper}>
                  <Image
                    source={{ uri }}
                    style={styles.image}
                    contentFit="cover"
                    cachePolicy={"memory-disk"}
                    priority={"high"}
                    responsivePolicy={"static"}
                  />
                  <Text style={[styles.imageLabel, { backgroundColor: index === 0 ? "#F97316" : "#34D399" }]}>
                    {index === 0 ? "Full Plant" : "Problem Area"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {loading && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Analysis Progress</Text>
            {analysisSteps.map((step, index) => (
              <View
                key={index}
                style={styles.stepRow}>
                <View style={styles.stepTextWrapper}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
                <View style={styles.progressCircle}>
                  <Svg
                    width={48}
                    height={48}>
                    <Circle
                      stroke="#D1FAE5"
                      fill="none"
                      cx={24}
                      cy={24}
                      r={18}
                      strokeWidth={4}
                    />
                    <Circle
                      stroke={Colors.light.appColor}
                      fill="none"
                      cx={24}
                      cy={24}
                      r={18}
                      strokeWidth={4}
                      strokeDasharray={2 * Math.PI * 18}
                      strokeDashoffset={2 * Math.PI * 18 - (displayProgress / 100) * 2 * Math.PI * 18}
                      strokeLinecap="round"
                      rotation="-90"
                      origin="24, 24"
                    />
                  </Svg>
                  <View style={styles.textOverlay}>
                    <Text style={styles.progressText}>{Math.round(displayProgress)}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {loading && (
          <Text style={styles.recommendationText}>
            Our AI has analyzed your images and is preparing personalized recommendations
          </Text>
        )}

        {loading && (
          <View style={styles.tipsCard}>
            <View style={styles.tipRow}>
              <View style={styles.tipIcon}>
                <Lightbulb
                  size={16}
                  color="#2563EB"
                />
              </View>
              <View style={styles.tipTextWrapper}>
                <Text style={styles.tipTitle}>Quick Tips</Text>
                <Text style={styles.tipText}>• AI considers lighting, soil, and environmental factors</Text>
                <Text style={styles.tipText}>• Recommendations are personalized for your specific plant</Text>
                <Text style={styles.tipText}>• Follow-up support available through our chat system</Text>
              </View>
            </View>
          </View>
        )}
        <NoPlantFound
          alertVisible={alertVisible}
          setAlertVisible={setAlertVisible}
        />
      </ScrollView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: { alignItems: "center", marginBottom: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  title: { fontSize: 20, fontFamily: Fonts.Poppins.bold, color: "#1F2937" },
  subtitle: { fontSize: 14, color: "#4B5563", fontFamily: Fonts.Poppins.regular, textAlign: "center" },
  recommendationText: {
    fontSize: 16,
    color: "#10B981",
    textAlign: "center",
    marginVertical: 16,
    fontFamily: Fonts.Poppins.bold,
  },
  genieContainer: {
    alignItems: "center",
    marginVertical: 16,
    backgroundColor: "#FFF",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: Fonts.Poppins.bold,
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  imageRow: { flexDirection: "row", justifyContent: "space-around" },
  imageWrapper: { position: "relative" },
  image: { width: 150, height: 150, borderRadius: 12 },
  imageLabel: {
    position: "absolute",
    top: 4,
    left: 4,
    color: "white",
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  stepTextWrapper: { flex: 1, marginHorizontal: 12 },
  stepTitle: { fontSize: 14, fontWeight: "600", fontFamily: Fonts.Poppins.bold, color: "#1F2937" },
  stepDescription: { fontSize: 12, fontFamily: Fonts.Poppins.regular, color: "#6B7280" },
  progressCircle: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  textOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
  },
  progressText: { fontSize: 12, fontWeight: "bold", color: "#15803D" },
  tipsCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    borderColor: "#DBEAFE",
    borderWidth: 1,
    marginBottom: 50,
  },
  tipRow: { flexDirection: "row", alignItems: "flex-start" },
  tipIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#DBEAFE",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipTextWrapper: { flex: 1 },
  tipTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 4,
    fontFamily: Fonts.Poppins.bold,
  },
  tipText: {
    fontSize: 12,
    color: "#4B5563",
    marginBottom: 2,
    fontFamily: Fonts.Poppins.regular,
  },
});

export default AIChatScreen;
