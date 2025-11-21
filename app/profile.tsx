import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteAccount, getProfile } from "../api/profile";
import { Fonts } from "../constants/Fonts";

interface HistoryItem {
  id: string;
  plantImage: string;
  plantName: string;
  diseaseName: string;
  fullData: any;
}

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

const Profile = () => {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          setHistoryLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/history/`, {
          params: { token },
        });

        const backendHistory = response.data.history || [];

        const mappedHistory: HistoryItem[] = backendHistory.map((item: any) => {
          const imgUrl = item.image
            ? item.image
              .replace(/\\/g, "/")
              .replace(/^.*uploads/, `${BASE_URL}/uploads`)
            : "https://via.placeholder.com/80";

          return {
            id: item.id.toString(),
            plantImage: imgUrl,
            plantName:
              item.common_name || item.scientific_name || "Unknown Plant",
            diseaseName: item.disease || "Healthy",
            fullData: item,
          };
        });

        setHistory(mappedHistory);
      } catch (error: any) {
        Alert.alert("Error", "Failed to fetch history.");
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
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
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCardPress = (item: HistoryItem) => {
    router.push({
      pathname: "/diagnosis",
      params: {
        result: JSON.stringify(item.fullData),
        images: JSON.stringify([item.plantImage]),
      },
    });
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCardPress(item)}
      >
        <Image
          source={{
            uri: item.plantImage || "https://via.placeholder.com/80",
          }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.textWrapper}>
          <Text style={styles.plantName}>{item.plantName}</Text>
          <Text style={styles.diseaseName}>
            Disease:{" "}
            <Text style={styles.diseaseNameHighlight}>{item.diseaseName}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.title}>My Profile</Text>

        <View style={styles.avatarRow}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.mobileNumber}>
            {mobileNumber || "Not Available"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyHeader}>Plant History</Text>
        {historyLoading ? (
          <ActivityIndicator
            size="large"
            color="#22c55e"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No history records found 🌱</Text>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    paddingTop: 20,
  },

  profileCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
    marginBottom: 4,
    marginTop: 40,
  },

  title: {
    fontSize: 20,
    fontFamily: Fonts.Poppins.bold,
    color: "#111827",
    marginBottom: 1,
  },

  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
    gap: 10,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },

  mobileNumber: {
    fontSize: 18,
    fontFamily: Fonts.Poppins.medium,
    color: "#111827",
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
    alignSelf: "flex-end",
    marginLeft: 0,
    marginTop: 2,
  },
  deleteText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: Fonts.Poppins.medium,
  },

  historyContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10, // reduced margin
  },

  historyHeader: {
    fontSize: 22,
    fontFamily: Fonts.Poppins.bold,
    marginBottom: 12,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    fontFamily: Fonts.Poppins.regular,
    color: "#6b7280",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    marginBottom: 18,
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  infoContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  disabledButton: {
    opacity: 0.6,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 14,
  },
  textWrapper: {
    flex: 1,
  },
  plantName: {
    fontSize: 16,
    fontFamily: Fonts.Poppins.bold,
    color: "#111827",
    marginBottom: 2,
  },
  diseaseName: {
    fontSize: 12,
    fontFamily: Fonts.Poppins.regular,
    color: "#374151",
  },
  diseaseNameHighlight: {
    color: "#dc2626",
    fontFamily: Fonts.Poppins.bold,
  },
});

export default Profile;
