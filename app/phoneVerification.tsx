import { Fonts } from "../constants/Fonts";
// PhoneLoginScreen.tsx (React Native Expo version)
import loginApi from "@/api/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ArrowRight, Smartphone } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const PhoneLoginScreen = () => {
  const [showContent, setShowContent] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const checkverified = async () => {
      const verified = await AsyncStorage.getItem("isverified");
      if (verified === "true") {
        router.replace("/plantUpload");
      }
    };
    checkverified();

    const timers = [
      setTimeout(() => setShowContent(true), 200),
      setTimeout(() => setShowForm(true), 600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length > 5) {
      return digitsOnly.slice(0, 5) + " " + digitsOnly.slice(5, 10);
    }
    return digitsOnly.slice(0, 10);
  };

  const isValidPhoneNumber = phoneNumber.replace(/\D/g, "").length === 10;

  const onSendOtpHandler = async () => {
    if (!isValidPhoneNumber) return;
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const otpSent: any = await loginApi({ phoneNumber: `+91${cleanNumber}` });
    if (!!otpSent.otp) {
      Alert.alert(otpSent?.message || "Success", "OTP sent successfully");
      router.push(`/otpScreen?mobile=${cleanNumber}`);
    } else {
      Alert.alert("Error", otpSent?.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scroll}
      enableOnAndroid
      extraScrollHeight={120}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.innerContainer}>
        {/* Header */}
        {showContent && (
          <View style={styles.header}>
            <Image
              source={require("../assets/images/robot.png")}
              style={styles.robotImage}
              contentFit="contain"
              cachePolicy={"memory-disk"}
              priority={"high"}
              responsivePolicy={"static"}
            />
            <Text style={styles.title}>Welcome to Genie AI</Text>
            <Text style={styles.subtitle}>
              Enter your phone number to get started with AI-powered plant care
            </Text>
          </View>
        )}

        {/* Form */}
        {showForm && (
          <View style={styles.formContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Smartphone size={20} color="#16a34a" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>Phone Number</Text>
                  <Text style={styles.cardDesc}>
                    We&apos;ll send you a verification code
                  </Text>
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.prefix}>+91</Text>
                <View style={styles.verticalLine} />
                <TextInput
                  keyboardType="number-pad"
                  value={phoneNumber}
                  onChangeText={(text) =>
                    setPhoneNumber(formatPhoneNumber(text))
                  }
                  placeholder="Enter 10-digit number"
                  style={styles.input}
                  maxLength={11}
                />
                {phoneNumber.length > 0 && (
                  <View
                    style={[
                      styles.indicator,
                      {
                        backgroundColor: isValidPhoneNumber
                          ? "#16a34a"
                          : "#d1d5db",
                      },
                    ]}
                  >
                    {isValidPhoneNumber && (
                      <ArrowRight size={14} color="#fff" />
                    )}
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              onPress={onSendOtpHandler}
              disabled={!isValidPhoneNumber}
              style={[
                styles.otpButton,
                !isValidPhoneNumber && styles.disabledButton,
              ]}
            >
              <Smartphone
                size={18}
                color={isValidPhoneNumber ? "#fff" : "#9ca3af"}
              />
              <Text
                style={[
                  styles.otpText,
                  !isValidPhoneNumber && styles.disabledText,
                ]}
              >
                Get Verification Code
              </Text>
              {isValidPhoneNumber && <ArrowRight size={18} color="#fff" />}
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continue, you agree to our{" "}
              <Text
                style={styles.linkText}
                onPress={() =>
                  Linking.openURL(
                    "https://gardengenie.in/terms-conditions/"
                  ).catch(() =>
                    Alert.alert("Error", "Unable to open Terms of Service")
                  )
                }
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={styles.linkText}
                onPress={() =>
                  Linking.openURL(
                    "https://gardengenie.in/privacy-policy/"
                  ).catch(() =>
                    Alert.alert("Error", "Unable to open Privacy Policy")
                  )
                }
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  innerContainer: {
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  robotImage: {
    width: 350,
    height: 350,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.Poppins.bold,
    color: "#1f2937",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    fontFamily: Fonts.Poppins.regular,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  formContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: Fonts.Poppins.bold,
    color: "#1f2937",
  },
  cardDesc: {
    fontSize: 11,
    color: "#6b7280",
    fontFamily: Fonts.Poppins.regular,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: "relative",
  },
  flag: {
    fontSize: 18,
    marginRight: 6,
  },
  prefix: {
    fontFamily: Fonts.Poppins.bold,
    color: "#374151",
    marginRight: 8,
    borderRightColor: "#d1d5db",
  },
  verticalLine: {
    width: 1,
    height: 24,
    backgroundColor: "#d1d5db",
    marginHorizontal: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  indicator: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -3 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  otpButton: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    borderRadius: 16,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#e5e7eb",
  },
  otpText: {
    color: "#fff",
    fontFamily: Fonts.Poppins.bold,
    fontSize: 15,
  },
  disabledText: {
    color: "#9ca3af",
  },
  termsText: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 16,
  },
  linkText: {
    color: "#16a34a",
    fontFamily: Fonts.Inter.bold,
  },
});

export default PhoneLoginScreen;
