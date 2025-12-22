import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Fonts } from "../../constants/Fonts";
import Login from "./login";

const Index = () => {
  const { width } = useWindowDimensions();
  const cardSize = (width - 32) / 3.5;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F9FAFB",
      paddingTop: 40,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 16,
      paddingBottom: 80,
    },
    header: {
      alignItems: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 20,
      fontFamily: Fonts.Poppins.bold,
      color: "#1F2937",
    },
    title1: {
      fontSize: 14,
      fontFamily: Fonts.Inter.regular,
      marginTop: 8,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: Fonts.Inter.regular,
      color: "#6B7280",
      marginTop: 8,
      backgroundColor: "white",
      borderColor: "#dcdfe4ff",
      borderWidth: 1,
      padding: 6,
      borderRadius: 30,
    },
    cursor: {
      color: "#10B981",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      marginBottom: 10,
    },
    card: {
      width: cardSize,
      height: cardSize,
      marginBottom: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 3,
    },
    image: {
      width: "100%",
      height: "100%",
      marginBottom: 2,
      borderRadius: 10,
    },
    cardText: {
      fontSize: 12,
      fontFamily: Fonts.Poppins.bold,
      color: "#374151",
    },
    footer: {
      alignItems: "center",
      marginBottom: 4,
    },
    footerText: {
      fontSize: 13,
      fontFamily: Fonts.Inter.regular,
      color: "#374151",
      borderWidth: 1,
      borderColor: "#d2fae7ff",
      marginBottom: 20,
      backgroundColor: "#ECFDF5",
      padding: 20,
      textAlign: "center",
      borderRadius: 16,
      width: "100%",
    },
    infoText: {
      fontSize: 11,
      fontFamily: Fonts.Inter.regular,
      color: "#9CA3AF",
      textAlign: "center",
      marginBottom: 20,
    },
    fixedButtonContainer: {
      position: "absolute",
      bottom: 44,
      left: 0,
      right: 0,
      alignItems: "center",
      paddingHorizontal: 1,
    },
    button: {
      backgroundColor: "#16a34a",
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 12,
      marginBottom: 12,
      alignItems: "center",
      justifyContent: "center"
    },
    buttonText: {
      color: "#fff",
      fontFamily: Fonts.Poppins.bold,
      fontSize: 13,
    },
    // Modern Hero Section Styles
    heroSection: {
      alignItems: "center",
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    heroContent: {
      alignItems: "center",
      width: "100%",
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginBottom: 1,
    },
    heroTitle: {
      fontSize: 24,
      fontFamily: Fonts.Poppins.bold,
      color: "#1F2937",
      textAlign: "center",
    },
    heroSubtitle: {
      fontSize: 13,
      fontFamily: Fonts.Poppins.regular,
      color: "#6B7280",
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 3,
      paddingHorizontal: 20,
    },
    statsContainer: {
      width: "100%",
      marginTop: 10,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
      // elevation: 3,
      borderWidth: 1,
      borderColor: "#F3F4F6",
    },
    stat: {
      alignItems: "center",
      flex: 1,
    },
    statNumber: {
      fontSize: 20,
      fontFamily: Fonts.Poppins.bold,
      color: "#4CAF50",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: Fonts.Poppins.regular,
      color: "#6B7280",
      textAlign: "center",
    },
    statDivider: {
      width: 1,
      height: 30,
      backgroundColor: "#E5E7EB",
      marginHorizontal: 8,
    },
    // Plants Section Styles
    plantsSection: {
      marginBottom: 1,
    },
    plantsTitle: {
      fontSize: 18,
      fontFamily: Fonts.Poppins.bold,
      color: "#1F2937",
      textAlign: "center",
      marginBottom: 3,
    },
    // Modern Button Styles
    buttonContainer: {
      alignItems: "center",
      marginVertical: 24,
      paddingHorizontal: 16,
    },
    gradientButton: {
      borderRadius: 16,
      shadowColor: "#4CAF50",
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 6,
      width: "100%",
      maxWidth: 280,
    },
    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 24,
      gap: 8,
    },
    // Trust Section Styles
    trustSection: {
      alignItems: "center",
      marginVertical: 15,
      paddingHorizontal: 10,
    },
    trustTitle: {
      fontSize: 16,
      fontFamily: Fonts.Poppins.bold,
      color: "#1F2937",
      textAlign: "center",
      marginBottom: 16,
    },
    trustItems: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      maxWidth: 280,
    },
    trustItem: {
      alignItems: "center",
      flex: 1,
    },
    trustIconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#F0F9FF",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    trustText: {
      fontSize: 12,
      fontFamily: Fonts.Poppins.regular,
      color: "#6B7280",
      textAlign: "center",
    },
    // Enhanced Plant Card Styles
    imageContainer: {
      width: "100%",
      height: "70%",
      borderRadius: 10,
      overflow: "hidden",
    },
    cardContent: {
      alignItems: "center",
      width: "100%",
    },
    supportedBadge: {
      backgroundColor: "#ECFDF5",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      marginTop: 4,
      borderWidth: 1,
      borderColor: "#D1FAE5",
    },
    supportedText: {
      fontSize: 10,
      fontFamily: Fonts.Poppins.regular,
      color: "#059669",
    },
  });

  return <Login styles={styles} />;
};

export default Index;
