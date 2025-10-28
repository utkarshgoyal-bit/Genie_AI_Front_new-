import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { handleResendCode, handleVerifyOtp } from "../api/sendOtp";
import { Fonts } from "../constants/Fonts";

const OtpScreen = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [isCodeComplete, setIsCodeComplete] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const { mobile } = useLocalSearchParams();

  const inputRefs = useRef<React.RefObject<TextInput | null>[]>([]);

  useEffect(() => {
    // Timer for resend functionality
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    // Check if all 4 digits are entered
    const isComplete = code.every((digit) => digit !== "");
    setIsCodeComplete(isComplete);
  }, [code]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.current?.focus();
    }
  };

  const onHandleVerifyHandler = async () => {
    if (isCodeComplete) {
      setLoading(true);
      const verificationCode = code.join("");
      const cleanPhone = Array.isArray(mobile) ? mobile[0] : mobile;
      try {
        const response = await handleVerifyOtp({
          cleanPhone: cleanPhone,
          verificationCode: verificationCode,
        });
        const data = await response.json();
        if (response.ok) {
          setLoading(false);
          if (data.token) {
          await AsyncStorage.setItem("access_token", data.token);
        } else {
          Alert.alert("Error", "Token not received from server");
          return;
        }
          await AsyncStorage.setItem("isverified", "true");
          await AsyncStorage.setItem("mobile", String(cleanPhone));
          Alert.alert("Success", String(data.message || "Phone verified!"));
          router.replace("/plantUpload");
        } else {
          setLoading(false);
          Alert.alert("Error", String(data.detail || "Invalid OTP"));
        }
      } catch (error: any) {
        setLoading(false);
        Alert.alert("Error", error?.message || "Invalid OTP");
      }
    }
  };

  const onHandleResendCodeHandler = async () => {
    setLoading(true);
    const cleanPhone = Array.isArray(mobile) ? mobile[0] : mobile;
    const phoneNumber = parseInt(cleanPhone || "0");
    const data = await handleResendCode({ phoneNumber: phoneNumber });
    setLoading(false);
    if (data) {
      Alert.alert("OTP Sent", "A new OTP has been sent to your number.");
      setResendTimer(30);
      setCanResend(false);
      setCode(["", "", "", ""]);
      inputRefs.current[0]?.current?.focus();
    } else {
      Alert.alert("Error", data.detail || "Failed to resend OTP");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Verify Your Number</Text>
            <Text style={styles.subtitle}>
              We&apos;ve sent a 4-digit verification code to your mobile number
            </Text>
          </View>

          {/* SMS Success Indicator */}
          <View style={styles.smsIndicator}>
            <Ionicons name="checkmark-circle" size={16} color="#00b894" />
            <Text style={styles.smsText}>SMS sent successfully</Text>
          </View>

          {/* Verification Code Input */}
          <View style={styles.codeContainer}>
            <Text style={styles.codeTitle}>Enter Verification Code</Text>
            <Text style={styles.codeSubtitle}>
              Please enter the 4-digit code below
            </Text>

            <View style={styles.codeInputContainer}>
              {code.map((digit, index) => {
                if (!inputRefs.current[index]) {
                  inputRefs.current[index] = React.createRef<TextInput>();
                }

                return (
                  <TextInput
                    key={index}
                    ref={inputRefs.current[index]}
                    style={[
                      styles.codeInput,
                      digit ? styles.codeInputFilled : null,
                    ]}
                    value={digit}
                    onChangeText={(text: string) =>
                      handleCodeChange(text.slice(-1), index)
                    }
                    onKeyPress={(e: any) => handleKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                  />
                );
              })}
            </View>

            {/* Resend Code */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Don&apos;t receive the code?
              </Text>
              <TouchableOpacity
                onPress={onHandleResendCodeHandler}
                disabled={!canResend}
                style={styles.resendButton}
              >
                <Ionicons
                  name="refresh"
                  size={16}
                  color={canResend ? "#16a34a" : "#b2bec3"}
                />
                <Text
                  style={[
                    styles.resendButtonText,
                    { color: canResend ? "#16a34a" : "#b2bec3" },
                  ]}
                >
                  Resend Code {!canResend && `(${resendTimer}s)`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              isCodeComplete && styles.verifyButtonActive,
            ]}
            onPress={onHandleVerifyHandler}
            disabled={!isCodeComplete || loading}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="white"
              style={styles.verifyIcon}
            />
            <Text style={styles.verifyButtonText}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.Poppins.bold,
    color: "#2d3436",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#636e72",
    fontFamily: Fonts.Poppins.regular,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  smsIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#d1f2eb",
    borderRadius: 20,
    alignSelf: "center",
  },
  smsText: {
    color: "#00b894",
    fontSize: 14,
    fontFamily: Fonts.Poppins.bold,
    marginLeft: 6,
  },
  codeContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  codeTitle: {
    fontSize: 18,
    fontFamily: Fonts.Poppins.bold,
    color: "#2d3436",
    textAlign: "center",
    marginBottom: 8,
  },
  codeSubtitle: {
    fontSize: 12,
    color: "#636e72",
    fontFamily: Fonts.Poppins.regular,
    textAlign: "center",
    marginBottom: 30,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  codeInput: {
    width: 50,
    height: 60,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 12,
    fontSize: 24,
    fontFamily: Fonts.Poppins.bold,
    color: "#2d3436",
    backgroundColor: "#f8f9fa",
  },
  codeInputFilled: {
    borderColor: "#00b894",
    backgroundColor: "#f0fff4",
  },
  resendContainer: {
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
    color: "#636e72",
    marginBottom: 8,
    fontFamily: Fonts.Poppins.regular,
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resendButtonText: {
    fontSize: 14,
    fontFamily: Fonts.Poppins.semibold,
    marginLeft: 6,
  },
  verifyButton: {
    backgroundColor: "#16a34a",
    borderRadius: 15,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    opacity: 0.5,
  },
  verifyButtonActive: {
    opacity: 1,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  verifyIcon: {
    marginRight: 8,
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: Fonts.Poppins.bold,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e9ecef",
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: "#00b894",
  },
  bottomProgressBar: {
    height: 4,
    backgroundColor: "#e9ecef",
    borderRadius: 2,
    marginTop: "auto",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#00b894",
    borderRadius: 2,
  },
});

export default OtpScreen;
