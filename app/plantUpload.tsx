import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Camera as CameraIcon, Info, Sparkles, Upload, Zap, ZapOff } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fonts } from "../constants/Fonts";

const PlantUpload = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentImageSlot, setCurrentImageSlot] = useState<number>(0);
  const [flashMode, setFlashMode] = useState<"off" | "on">("off");
  const [hasFlash, setHasFlash] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);

  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    const getMobileNumber = async () => {
      try {
        const number = await AsyncStorage.getItem("mobile_number");
        setMobileNumber(number);
      } catch (error) {
        // Failed to fetch mobile number from storage
      }
    };
    getMobileNumber();
  }, []);

  const image = useMemo(() => {
    if (mobileNumber === "9999999999") {
      return "../assets/images/roseDisease.png";
    }
  }, [mobileNumber]);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission, requestPermission]);

  useEffect(() => {
    // Most modern devices have flash, we'll assume it's available
    // and handle errors gracefully during picture taking
    setHasFlash(true);
  }, []);

  const takePicture = useCallback(async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImages((prev) => {
          const newImages = [...prev];
          newImages[currentImageSlot] = photo.uri;
          return newImages;
        });
        setIsCameraOpen(false);
      } catch (error) {
        Alert.alert("Camera Error", "Failed to take picture. Please try again.");
      }
    }
  }, [currentImageSlot]);

  const validImageCount = useMemo(() => {
    return capturedImages.filter(Boolean).length;
  }, [capturedImages]);

  const uploadPlantImages = useCallback(async () => {
    if (validImageCount < 2) {
      Alert.alert("Missing Images", "Please capture both a wide-angle and a close-up photo.");
      return;
    }

    const validImages = capturedImages.filter(Boolean);
    router.push({
      pathname: "/aiChat",
      params: {
        images: JSON.stringify(validImages),
        status: "loading",
      },
    });
    setCapturedImages([]);
  }, [validImageCount, capturedImages]);

  const handleCameraPress = useCallback((stepIndex: number) => {
    setCurrentImageSlot(stepIndex);
    setIsCameraOpen(true);
  }, []);

  const toggleFlash = useCallback(() => {
    try {
      setFlashMode((prev) => {
        const newMode = prev === "off" ? "on" : "off";
        return newMode;
      });
    } catch (error) {
      Alert.alert(
        JSON.stringify(error) || "Flash Error",
        "Unable to toggle flash. Your device may not support this feature."
      );
    }
  }, []);

  const stepComponents = useMemo(() => {
    return [1, 2].map((step) => (
      <View
        key={step}
        style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <View style={[step === 1 ? styles.firstCircleWrapper : styles.secondCircleWrapper]}>
            <View style={[styles.stepNumber, { backgroundColor: step === 1 ? "#16A34A" : "#F97316" }]}>
              <Text style={styles.stepNumberText}>{step}</Text>
            </View>
          </View>
          <View style={styles.stepText}>
            <Text style={styles.stepTitle}>{step === 1 ? "Capture Overall Plant" : "Focus on Problem Area"}</Text>
            <Text style={styles.stepDesc}>
              {step === 1
                ? "Take a wide-angle photo of your entire plant"
                : "Take a close-up photo of the affected leaves or areas"}
            </Text>
          </View>
        </View>
        <View style={styles.imageWrapper}>
          {capturedImages[step - 1] ? (
            <Image
              source={{ uri: capturedImages[step - 1] }}
              style={styles.image}
              contentFit="cover"
              cachePolicy={"memory-disk"}
              priority={"high"}
              responsivePolicy={"static"}
            />
          ) : (
            <Image
              source={
                step === 1 ? require("../assets/images/arecapalm.png") : require("../assets/images/plant-analysis.png")
              }
              style={styles.image}
              contentFit="cover"
              cachePolicy={"memory-disk"}
              priority={"high"}
              responsivePolicy={"static"}
            />
          )}
          <TouchableOpacity
            style={[styles.cameraIconWrapper, { backgroundColor: step === 1 ? "#16A34A" : "#F97316" }]}
            onPress={() => handleCameraPress(step - 1)}>
            <CameraIcon
              size={16}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    ));
  }, [capturedImages, handleCameraPress]);

  useEffect(() => {
    const timers = [setTimeout(() => setShowHeader(true), 200), setTimeout(() => setShowUploadButton(true), 600)];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "blue" }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isCameraOpen) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
          flash={flashMode}
        />
        {hasFlash && (
          <View
            style={{
              position: "absolute",
              top: 60,
              right: 20,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                padding: 12,
                borderRadius: 25,
              }}
              onPress={toggleFlash}>
              {flashMode === "on" ? (
                <Zap
                  size={20}
                  color="#FFD700"
                />
              ) : (
                <ZapOff
                  size={20}
                  color="#fff"
                />
              )}
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            position: "absolute",
            bottom: 40,
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#16A34A",
              padding: 20,
              borderRadius: 50,
            }}
            onPress={takePicture}>
            <CameraIcon
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#F9FAFB", "#FFFFFF"]}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.innerContainer}
        showsVerticalScrollIndicator={false}>
        {showHeader && (
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Sparkles
                size={24}
                color="#16A34A"
              />
              <Text style={styles.headerTitle}>Plant Diagnosis Guide</Text>
            </View>
            <Text style={styles.headerDescription}>Get accurate plant health diagnosis in 2 simple steps</Text>
          </View>
        )}

        {stepComponents}

        {showUploadButton && (
          <>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={uploadPlantImages}>
              <Upload
                size={16}
                color="#fff"
              />
              <Text style={styles.uploadText}>Start Plant Diagnosis</Text>
              {/* <ArrowRight size={16} color="#fff" /> */}
            </TouchableOpacity>

            <View style={styles.tipsBox}>
              <View style={styles.tipsHeader}>
                <View style={styles.tipsIconCircle}>
                  <Info
                    size={14}
                    color="#3B82F6"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tipsTitle}>Pro Tips</Text>
                  <Text style={styles.tipLine}>• Ensure good lighting for clear photos</Text>
                  <Text style={styles.tipLine}>• Keep the camera steady to avoid blur</Text>
                  <Text style={styles.tipLine}>• Include multiple angles of problem areas</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { padding: 20, paddingTop: 45, gap: 10 },
  header: { alignItems: "center", marginBottom: 5 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  headerTitle: { fontSize: 18, fontFamily: Fonts.Poppins.bold, fontWeight: "bold", color: "#1F2937" },
  headerDescription: { color: "#6B7280", fontFamily: Fonts.Poppins.regular, fontSize: 13, textAlign: "center" },
  stepCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    fontFamily: Fonts.Poppins.bold,
    marginBottom: 10,
    gap: 10,
  },
  firstCircleWrapper: {
    width: 40,
    height: 40,
    backgroundColor: "#E0F2FE",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  secondCircleWrapper: {
    width: 40,
    height: 40,
    backgroundColor: "#FCD8AA",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  stepText: { flex: 1, fontFamily: Fonts.Poppins.bold },
  stepTitle: { fontWeight: "600", fontFamily: Fonts.Poppins.bold, fontSize: 14, color: "#111827" },
  stepDesc: { color: "#6B7280", fontFamily: Fonts.Poppins.regular, fontSize: 12 },
  imageWrapper: { position: "relative", marginBottom: 10 },
  image: { width: "100%", height: 160, borderRadius: 16 },
  cameraIconWrapper: {
    position: "absolute",
    bottom: -10,
    right: -10,
    padding: 10,
    borderRadius: 50,
    elevation: 4,
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: "#16A34A",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "55%",
    gap: 10,
    shadowColor: "#16A34A",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  uploadText: { color: "#fff", fontFamily: Fonts.Poppins.bold, fontWeight: "600", fontSize: 12 },
  tipsBox: {
    marginTop: 8,
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 16,
    borderColor: "#DBEAFE",
    borderWidth: 1,
  },
  tipsHeader: { flexDirection: "row", gap: 10 },
  tipsIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  tipsTitle: {
    fontWeight: "600",
    color: "#1F2937",
    fontSize: 13,
    marginBottom: 4,
    fontFamily: Fonts.Poppins.bold,
  },
  tipLine: { fontSize: 12, color: "#4B5563", fontFamily: Fonts.Poppins.regular },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default PlantUpload;
