import Button from "@/Shared/Button";
import MiniTabBar from "@/components/MiniTabBar";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { AlertTriangle, ArrowRight, CheckCircle, Sparkles } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fonts } from "../constants/Fonts";

type TypewriterProps = {
  text: string;
  delay?: number;
  speed?: number;
};

const Typewriter: React.FC<TypewriterProps> = ({ text, delay = 0, speed = 50 }) => {
  const safeText = typeof text === "string" ? text : String(text);
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!safeText) return;
    const timer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < safeText.length) {
          setDisplayText(safeText.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, speed);
    }, delay);

    return () => clearTimeout(timer);
  }, [safeText, delay, speed]);

  return (
    <Text>
      {displayText}
      {!isComplete && <Text style={styles.cursor}>|</Text>}
    </Text>
  );
};

const plantImages: Record<string, any> = {
  Rosa: require("../assets/images/rose.png"),
  "Hibiscus rosa-sinensis": require("../assets/images/hibiscus.png"),
  "Epipremnum aureum": require("../assets/images/moneyplant.png"),
  "Sansevieria trifasciata": require("../assets/images/snakeplant.png"),
  "Dypsis lutescens": require("../assets/images/arecapalm.png"),
  "Murraya koenigii": require("../assets/images/curry.png"),
  "Codiaeum variegatum": require("../assets/images/croton.png"),
  "Solanum lycopersicum": require("../assets/images/tomato.png"),
  "Spathiphyllum spp": require("../assets/images/peacelily.png"),
  "Ficus lyrata": require("../assets/images/fiddle.png"),
};

const DetailedDiagnosisScreen = () => {
  const navigation = useNavigation();
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showIssues, setShowIssues] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const { result, images } = useLocalSearchParams();

  // ✅ Safe parse
  let data: any = null;
  let uploadedImages = [];
  try {
    data = result ? JSON.parse(result as string) : null;
    uploadedImages = images ? JSON.parse(images as string) : [];
  } catch (e) {
    // Failed to parse diagnosis result
    uploadedImages = [];
  }

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowDiagnosis(true), 300),
      setTimeout(() => setAnimationStage(1), 1000),
      setTimeout(() => setShowIssues(true), 2000),
      setTimeout(() => setAnimationStage(2), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);
  const hasNoIssues =
    data.disease.some((d: string) => d.includes("healthy")) ||
    data.symptoms.includes("N/A") ||
    data.treatment.includes("N/A");

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        <View style={styles.headerContainer}>
          <Sparkles
            color="#16a34a"
            size={24}
          />
          <Text style={styles.headerText}>AI Plant Diagnosis</Text>
        </View>

        <View style={styles.imageCard}>
          <Image
            source={plantImages[data?.scientific_name] || "../assets/images/disease.png"}
            style={styles.plantImage}
            contentFit="cover"
            cachePolicy={"memory-disk"}
            priority={"high"}
            responsivePolicy={"static"}
          />

          {animationStage >= 1 &&
            data?.disease?.length > 0 &&
            data.disease.map((diseaseItem: string, idx: number) => (
              <View
                key={idx}
                style={styles.labelContainer}>
                <View style={styles.labelBoxGreen}>
                  <View style={styles.pulseDotGreen} />
                  <Text style={styles.labelText}>{diseaseItem?.toUpperCase()}</Text>
                </View>
              </View>
            ))}
        </View>

        {showDiagnosis && (
          <View style={styles.diagnosisCard}>
            <CheckCircle
              color="#16a34a"
              size={20}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.diagnosisTitle}>AI Analysis Complete</Text>
              <Typewriter
                text={`Genie AI has detected ${data.common_name} with ${data.plant_confidence} confidence.`}
                speed={30}
              />
            </View>
          </View>
        )}

        {showIssues && (
          <View style={styles.issueCard}>
            {hasNoIssues ? (
              <CheckCircle
                color="#16a34a"
                size={20}
              />
            ) : (
              <AlertTriangle
                color="#ca8a04"
                size={20}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.issuesHeader}>{hasNoIssues ? "Congratulations!!" : "ISSUE!!"}</Text>

              {data.symptoms && data.symptoms.length > 0 ? (
                <Text style={styles.issueTitle}>
                  <Typewriter
                    text={hasNoIssues ? "You're a good Plant Parent." : data.symptoms.join(", ")}
                    speed={50}
                  />
                </Text>
              ) : (
                <Text style={styles.issueTitle}>No symptoms detected.</Text>
              )}

              {/* Cause */}
              {data.cause && data.cause.length > 0 ? (
                data.cause.map((cause: string, i: number) => (
                  <Text
                    key={i}
                    style={styles.issueText}>
                    <Typewriter
                      text={hasNoIssues ? "Keep up the love and care" : cause}
                      delay={i * 500}
                      speed={25}
                    />
                  </Text>
                ))
              ) : (
                <Text style={styles.issueText}>No cause information available.</Text>
              )}
            </View>

            <Image
              source={uploadedImages?.[1] || "../assets/images/yellowing-leaves.png"}
              style={styles.issueImage}
            />
          </View>
        )}
      </ScrollView>

      {animationStage >= 2 && (
        <View
          style={{
            position: "absolute",
            bottom: 120,
            left: 0,
            right: 0,
            zIndex: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            paddingHorizontal: 20,
          }}>
          <Button
            onPress={() =>
              router.push({
                pathname: hasNoIssues ? "/phoneVerification" : "/solution",
                params: {
                  result: JSON.stringify(data),
                  disease_scientific_name: data?.disease_scientific_name || "",
                  scientific_name: data?.scientific_name || "",
                  disease: data?.disease || "",
                },
              })
            }
            text={hasNoIssues ? "Ask Genie AI again" : "View Solutions"}
            postIcon={
              <ArrowRight
                color="white"
                size={16}
              />
            }
          />

          {hasNoIssues && (
            <TouchableOpacity
              style={styles.ExploreButton}
              onPress={() => Linking.openURL("https://gardengenie.in")}>
              <Text style={styles.ExploreButtonText}>Explore our Gardening Range</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <MiniTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: 30,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.Poppins.bold,
    color: "#1f2937",
  },
  imageCard: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 10,
    elevation: 3,
  },
  plantImage: {
    width: "100%",
    height: 300,
  },
  labelContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    gap: 10,
  },
  labelBoxGreen: {
    backgroundColor: "#ecfdf5",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderColor: "#bbf7d0",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  pulseDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginRight: 6,
  },
  labelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
    fontFamily: Fonts.Poppins.medium,
  },
  diagnosisCard: {
    backgroundColor: "#ecfdf5",
    borderRadius: 20,
    padding: 16,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  diagnosisTitle: {
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
    fontFamily: Fonts.Poppins.bold,
  },
  issuesHeader: {
    fontSize: 13,
    fontWeight: "600",
    color: "#16a34a",
    textTransform: "uppercase",
    marginBottom: 4,
    fontFamily: Fonts.Poppins.bold,
  },
  issueCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  issueTitle: {
    fontWeight: "700",
    color: "#1f2937",
    fontFamily: Fonts.Poppins.regular,
  },
  issueText: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 6,
    fontFamily: Fonts.Poppins.regular,
  },
  issueImage: {
    width: 84,
    height: 84,
    borderRadius: 10,
  },
  ExploreButton: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 3,
  },
  ExploreButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
    fontFamily: Fonts.Poppins.bold,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  cursor: {
    color: "#16a34a",
  },
});

export default DetailedDiagnosisScreen;
