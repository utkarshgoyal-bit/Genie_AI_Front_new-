import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fonts } from "../constants/Fonts";

interface HistoryItem {
  id: string;
  plantImage: string;
  plantName: string;
  diseaseName: string;
  fullData: any;
}

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

const HistoryScreen = () => {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          Alert.alert("Error", "You are not logged in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/history/`, {
          params: { token },
        });

        const backendHistory = response.data.history || [];

        const mappedHistory: HistoryItem[] = backendHistory.map((item: any) => {
          const imgUrl = item.image
            ? item.image.replace(/\\/g, "/").replace(/^.*uploads/, `${BASE_URL}/uploads`)
            : "https://via.placeholder.com/80";

          return {
            id: item.id.toString(),
            plantImage: imgUrl,
            plantName: item.common_name || item.scientific_name || "Unknown Plant",
            diseaseName: item.disease || "Healthy",
            fullData: item,
          };
        });

        setHistory(mappedHistory);
      } catch (error: any) {
        Alert.alert("Error", "Failed to fetch history.");
      } finally{
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

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
        onPress={() => handleCardPress(item)}>
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
            Disease: <Text style={styles.diseaseNameHighlight}>{item.diseaseName}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Plant History</Text>
      {/* Loader */}
      {loading ? (
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
          ListEmptyComponent={<Text style={styles.emptyText}>No history records found 🌱</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 20,
    marginTop: 45,
  },
  header: {
    fontSize: 24,
    fontFamily: Fonts.Poppins.bold,
    marginBottom: 16,
  },
  backBtn: {
    padding: 8,
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 50,
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
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    fontFamily: Fonts.Poppins.regular,
    color: "#6b7280",
  },
});

export default HistoryScreen;
