import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteAccount, getProfile } from "../api/profile";
import { Fonts } from "../constants/Fonts";

const Profile = () => {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          // User not logged in, redirect to login
          router.replace("/Login");
          return;
        }

        const profileData = await getProfile();
        setMobileNumber(profileData.mobile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Fallback to AsyncStorage if API fails
        try {
          const number = await AsyncStorage.getItem("mobile_number");
          setMobileNumber(number);
        } catch (storageError) {
          console.error("Failed to fetch from storage:", storageError);
        }
      }
    };
    checkAuthAndFetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteAccount();
              Alert.alert("Success", "Account deleted successfully", [
                {
                  text: "OK",
                  onPress: () => {
                    AsyncStorage.clear();
                    router.replace("/");
                  },
                },
              ]);
            } catch (error) {
              console.error("Failed to delete account:", error);
              Alert.alert("Error", "Failed to delete account. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.mobileNumber}>
          📱 {mobileNumber || "Not Available"}
        </Text>

        <TouchableOpacity
          style={[styles.deleteButton, loading && styles.disabledButton]}
          onPress={handleDeleteAccount}
          disabled={loading}
        >
          <Text style={styles.deleteText}>
            {loading ? "Deleting..." : "Delete My Account"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileCard: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.Poppins.bold,
    color: "#111827",
    marginBottom: 8,
  },
  mobileNumber: {
    fontSize: 16,
    fontFamily: Fonts.Poppins.regular,
    color: "#6B7280",
    marginBottom: 40,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#EF4444",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Fonts.Poppins.medium,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default Profile;
