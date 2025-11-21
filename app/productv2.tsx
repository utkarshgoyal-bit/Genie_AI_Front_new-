import { Fonts } from "@/constants/Fonts";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

interface Productv2 {
  id: number;
  product_name: string;
  product_image: string;
  how_to_use: string;
  product_link: string;
}

export default function ProductV2() {
  const [products, setProducts] = useState<Productv2[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Productv2 | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

 const fetchProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    const uniqueProducts = data.filter(
      (item: Productv2, index: number, self: Productv2[]) =>
        index === self.findIndex((t) => t.product_name === item.product_name)
    );
    setProducts(uniqueProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    setLoading(false);
  }
};


  const openHowToUse = (product: Productv2) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const openBuyLink = (link: string) => {
    Linking.openURL(link);
  };

  const renderProduct = ({ item }: { item: Productv2 }) => (
    <View style={styles.productCard}>
      <Image
        source={{
          uri:
            item.product_image ||
            "https://via.placeholder.com/80",
        }}
        style={styles.productImage}
      />

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product_name}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => openHowToUse(item)}
          >
            <Text style={styles.addButtonText}>How to use</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => openBuyLink(item.product_link)}
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
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={{ fontFamily: Fonts.Poppins.medium, marginTop: 8 }}>
          Loading Products...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Products</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
      />

      {/* How To Use Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedProduct?.product_name}
            </Text>

            <ScrollView>
              <Text style={styles.modalContent}>
                {selectedProduct?.how_to_use}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.addButton, { alignSelf: "flex-end", marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.addButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 20,
    marginTop: 45,
  },
  header: {
    fontSize: 24,
    fontFamily: Fonts.Poppins.bold,
    marginBottom: 16,
  },
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
  modalContent: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Fonts.Poppins.medium,
    marginTop: 8,
  },
});
