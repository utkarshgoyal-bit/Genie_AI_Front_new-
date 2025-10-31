import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Fonts } from "../constants/Fonts";

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

interface Product {
  id: number;
  plant_name?: string;
  disease?: string;
  disease_scientific_name?: string;
  product_link?: string;
  product_name?: string;
  name?: string;
  how_to_use?: string;
  product_image?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          Alert.alert("Error", "You are not logged in.");
          setLoading(false);
          return;
        }
      const response = await axios.get(`${BASE_URL}/products/`,{
          params: { token },
        });
      if (response.status !== 200) throw new Error("Failed to fetch products");

      const data: Product[] = await response.data;
    

       const normalized = data.map((d: any) => ({
      ...d,
      product_name: d.product_name ?? d.name,
    }));
      const uniqueProducts = normalized.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (p) =>
            p.product_name?.toLowerCase().trim() ===
            item.product_name?.toLowerCase().trim()
        )
    );

    setProducts(uniqueProducts);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const openProductLink = (link?: string) => {
    if (link) {
      Linking.openURL(link).catch(() => {
        Alert.alert("Error", "Unable to open product link");
      });
    } else {
      Alert.alert("No Link", "This product has no link available.");
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image
        source={{
          uri: item.product_image
            ? item.product_image.startsWith("http")
              ? item.product_image
              : `${BASE_URL}${item.product_image}`
            : "https://via.placeholder.com/100",
        }}
        style={styles.productImage}
        cachePolicy={"memory-disk"}
        priority={"high"}
        responsivePolicy={"static"}
      />

      <View style={styles.productInfo}>
        {/*  Product name only once */}
        <Text style={styles.productName}>{item.product_name || item.name}</Text>

        {/* ✅ How to use + Buy Now buttons side by side */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => openModal(item)}
          >
            <Text style={styles.addButtonText}>How to use</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addButton,  {backgroundColor: "#16a34a"}]}
            onPress={() => openProductLink(item.product_link)}
          >
            <Text style={styles.addButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Products</Text>

      <FlatList
        data={products}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal for How to use */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedProduct?.product_name || selectedProduct?.name}
            </Text>
            <ScrollView style={{ marginTop: 10 }}>
              <Text style={styles.modalContent}>
                {selectedProduct?.how_to_use || "No instructions available."}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.addButton, { alignSelf: "center", marginTop: 20 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.addButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 20,
    marginTop: 45,
  },
  header: { fontSize: 24, fontFamily: Fonts.Poppins.bold, marginBottom: 16 },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: { width: 80, height: 80, borderRadius: 8 },
  productInfo: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  productName: { fontSize: 16, fontFamily: Fonts.Poppins.bold },
  addButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  addButtonText: { color: "#fff", fontFamily: Fonts.Poppins.bold },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontFamily: Fonts.Poppins.bold },
  modalContent: { fontSize: 16, lineHeight: 22, fontFamily: Fonts.Poppins.medium },
});

export default ProductList;
