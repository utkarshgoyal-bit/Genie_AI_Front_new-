import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { router } from "expo-router";
import {
    AlertCircle,
    ChevronRight,
    FileText,
    LogOut,
    Shield,
    Trash2,
    User,
} from "lucide-react-native";
import { useState } from "react";
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fonts } from "../constants/Fonts";

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

const SettingsScreen = () => {
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load mobile number on mount
  useState(() => {
    const loadMobile = async () => {
      const mobile = await AsyncStorage.getItem("mobile");
      setMobileNumber(mobile);
    };
    loadMobile();
  });

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove([
            "access_token",
            "isverified",
            "mobile",
          ]);
          router.replace("/phoneVerification");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all your data including:\n\n• Diagnosis history\n• Plant photos\n• Account information\n\nThis action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Error", "You must be logged in to delete your account");
        return;
      }

      const response = await fetch(`${BASE_URL}/auth/delete_account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Clear all local data
        await AsyncStorage.multiRemove([
          "access_token",
          "isverified",
          "mobile",
        ]);
        Alert.alert(
          "Account Deleted",
          "Your account has been permanently deleted.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/phoneVerification"),
            },
          ]
        );
      } else {
        const data = await response.json();
        Alert.alert(
          "Error",
          data.detail || "Failed to delete account. Please try again."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        "Network error. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const openPrivacyPolicy = () => {
    Linking.openURL("https://gardengenie.in/privacy-policy/").catch(() =>
      Alert.alert("Error", "Unable to open Privacy Policy")
    );
  };

  const openTerms = () => {
    Linking.openURL("https://gardengenie.in/terms-conditions/").catch(() =>
      Alert.alert("Error", "Unable to open Terms of Service")
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.card}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#DBEAFE" }]}
                >
                  <User size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.menuItemTitle}>Phone Number</Text>
                  <Text style={styles.menuItemSubtitle}>
                    {mobileNumber ? `+91 ${mobileNumber}` : "Not available"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & Privacy</Text>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={openPrivacyPolicy}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#F3E8FF" }]}
                >
                  <Shield size={20} color="#9333EA" />
                </View>
                <Text style={styles.menuItemTitle}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={openTerms}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#FEF3C7" }]}
                >
                  <FileText size={20} color="#F59E0B" />
                </View>
                <Text style={styles.menuItemTitle}>Terms of Service</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <View style={styles.card}>
            <View style={styles.infoBox}>
              <AlertCircle size={16} color="#3B82F6" />
              <Text style={styles.infoText}>
                Your data is stored securely and used only for plant diagnosis.
                We never share your personal information.
              </Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>

          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#FEF2F2" }]}
                >
                  <LogOut size={20} color="#EF4444" />
                </View>
                <Text style={[styles.menuItemTitle, { color: "#EF4444" }]}>
                  Logout
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDeleteAccount}
              disabled={loading}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#FEE2E2" }]}
                >
                  <Trash2 size={20} color="#DC2626" />
                </View>
                <View>
                  <Text style={[styles.menuItemTitle, { color: "#DC2626" }]}>
                    {loading ? "Deleting..." : "Delete Account"}
                  </Text>
                  <Text style={styles.menuItemSubtitle}>
                    Permanently delete your account and data
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Garden Genie AI</Text>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Fonts.Poppins.bold,
    color: "#1F2937",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.Poppins.regular,
    color: "#6B7280",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Fonts.Poppins.bold,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: Fonts.Poppins.bold,
    color: "#1F2937",
  },
  menuItemSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.Poppins.regular,
    color: "#6B7280",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 64,
  },
  infoBox: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    margin: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.Poppins.regular,
    color: "#1F2937",
    lineHeight: 18,
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontFamily: Fonts.Poppins.regular,
    color: "#9CA3AF",
  },
});

export default SettingsScreen;
