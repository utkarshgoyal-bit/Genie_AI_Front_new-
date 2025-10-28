import { HowToUse } from "@/components/HowToUse";
import MiniTabBar from "@/components/MiniTabBar";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Info,
  Leaf,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Fonts } from "../constants/Fonts";

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

const RecommendedSolutionScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<{ [key: string]: { title: string, content: string[] } }>({});
  const [showSolutions, setShowSolutions] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { result, disease_scientific_name, scientific_name } =
    useLocalSearchParams();

  const headerAnimation = useRef(new Animated.Value(0)).current;
  const solutionAnimation = useRef(new Animated.Value(0)).current;

  let data: any = null;
  try {
    data = result ? JSON.parse(result as string) : null;
  } catch (e) {
    console.error("Invalid JSON:", result, e);
  }

  interface Product {
    disease: string;
    product_name: string;
    how_to_use?: string;
    product_image?: string;
    product_link?: string;
  }

  // Fetch products
  useEffect(() => {
    if (!disease_scientific_name || !scientific_name) return;

    const sciName = Array.isArray(disease_scientific_name)
      ? disease_scientific_name[0]
      : disease_scientific_name;
    const plantSciName = Array.isArray(scientific_name)
      ? scientific_name[0]
      : scientific_name;

    const fetchProducts = async () => {
      try {
        const url = `${BASE_URL}/products/by-scientific-name/${encodeURIComponent(
          sciName
        )}?plant_name=${encodeURIComponent(plantSciName)}`;

        const productRes = await fetch(url);
        const productData = await productRes.json();
        if (!productRes.ok) {
          setProducts([]);
          setShowProducts(true);
          return;
        }

        const uniqueProducts = Array.isArray(productData) ? productData.filter((p, i, arr) => arr.findIndex(pp => pp.product_name === p.product_name) === i) : [];
        setProducts(uniqueProducts);
        setShowProducts(true);
      } catch (err) {
        console.error("Product fetch error:", err);
        setProducts([]);
        setShowProducts(true);
      }
    };

    fetchProducts();
  }, [disease_scientific_name, scientific_name]);

  // Header and Solution Animations
  useEffect(() => {
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timers = [
      setTimeout(() => {
        setShowSolutions(true);
        Animated.timing(solutionAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [headerAnimation, solutionAnimation]);

  const handleModalOpen = useCallback((product: Product) => {
    if (!product) return;
    setSelectedModal(product.product_name);
    const howToUseSteps = product.how_to_use
      ? product.how_to_use.split(/\r?\n|\.\s+/).filter(Boolean)
      : ["No usage instructions available."];
    setModalContent({
      [product.product_name]: {
        title: `How to Use ${product.product_name}`,
        content: howToUseSteps,
      },
    });
    setIsModalOpen(true);
  }, []);

  const handleBuyNow = useCallback((productLink: string) => {
    if (productLink) Linking.openURL(productLink);
  }, []);

  const ModernHeader = () => (
    <Animated.View
      style={[
        styles.modernHeader,
        {
          opacity: headerAnimation,
          transform: [
            {
              translateY: headerAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={["#ffffff", "#ffffff", "#ffffff"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <View style={styles.iconContainer}>
              <Sparkles size={24} color="#16a34a" />
            </View>
            <Text style={styles.modernTitle}>Treatment Solutions</Text>
          </View>
          <Text style={styles.modernSubtitle}>
            AI-powered recommendations for optimal plant health
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Shield size={16} color="#16a34a" />
              <Text style={styles.statText}>Verified</Text>
            </View>
            <View style={styles.statItem}>
              <Star size={16} color="#F59E0B" />
              <Text style={styles.statText}>Expert Approved</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={16} color="#8B5CF6" />
              <Text style={styles.statText}>Fast Acting</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const TreatmentPlan = () =>
    showSolutions &&
    data?.disease &&
    data?.treatment && (
      <Animated.View
        style={[
          styles.treatmentContainer,
          {
            opacity: solutionAnimation,
            transform: [
              {
                translateY: solutionAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["#ffffff", "#ffffff"]}
          style={styles.treatmentCard}
        >
          <View style={styles.treatmentHeader}>
            <View style={styles.treatmentIconWrapper}>
              <CheckCircle color="#059669" size={24} />
            </View>
            <View style={styles.treatmentTextWrapper}>
              <Text style={styles.treatmentTitle}>Diagnosis Complete</Text>
              <Text style={styles.treatmentSubtitle}>Treatment plan ready</Text>
            </View>
            <View style={styles.successBadge}>
              <Text style={styles.successBadgeText}>✓</Text>
            </View>
          </View>

          <View style={styles.treatmentList}>
            {data.disease.map((disease: string, index: number) => (
              <View key={index} style={styles.treatmentItem}>
                <View
                  style={[
                    styles.treatmentDot,
                    {
                      backgroundColor: index % 2 === 0 ? "#059669" : "#F97316",
                    },
                  ]}
                />
                <View style={styles.treatmentContent}>
                  <Text style={styles.diseaseName}>{disease}</Text>
                  <Text style={styles.treatmentText}>
                    {data.treatment[index] || "No treatment info"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>
    );

  const ProductCard = ({
    product,
    index,
  }: {
    product: Product;
    index: number;
  }) => {
    const animValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.modernCard,
          {
            opacity: animValue,
            transform: [
              {
                translateY: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              {
                scale: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.recommendedBadge}>
            <TrendingUp size={12} color="#059669" />
            <Text style={styles.recommendedText}>RECOMMENDED</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>

        <View style={styles.productContent}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.product_name}</Text>
            <Text style={styles.productDisease}>
              For {product.disease?.toUpperCase()}
            </Text>
            <Text style={styles.productDescription}>
              {product.how_to_use || "Professional treatment solution"}
            </Text>
          </View>

          {product.product_image && (
            <View style={styles.imageWrapper}>
              <Image
                source={{
                  uri: product.product_image.includes("drive.google.com")
                    ? product.product_image.replace(
                        /.*\/d\/(.*?)\/.*/,
                        "https://drive.google.com/uc?export=view&id=$1"
                      )
                    : product.product_image,
                }}
                style={styles.productImage}
                cachePolicy={"memory-disk"}
                priority={"high"}
                responsivePolicy={"static"}
              />
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => handleModalOpen(product)}
            activeOpacity={0.8}
          >
            <Info size={16} color="#2563EB" />
            <Text style={styles.infoButtonText}>How to Use</Text>
          </TouchableOpacity>

          <LinearGradient
            colors={["#16a34a", "#15803d"]}
            style={styles.buyButtonGradient}
          >
            <TouchableOpacity
              style={styles.buyButtonContent}
              onPress={() => handleBuyNow(product.product_link || "")}
              activeOpacity={0.8}
            >
              <ShoppingCart size={16} color="white" />
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <ModernHeader />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TreatmentPlan />

        {showProducts && products.length > 0 && (
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Recommended Products</Text>
            {products.map((product, index) => (
              <ProductCard key={index} product={product} index={index} />
            ))}
          </View>
        )}

        {showProducts && Array.isArray(products) && products.length === 0 && (
          <View style={styles.emptyState}>
            <Leaf size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No Products Found</Text>
            <Text style={styles.emptyStateText}>
              We couldn&apos;t find specific products for this condition, but
              you can consult with our AI for general care tips.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomActions}>
        <LinearGradient
          colors={["#16a34a", "#15803d"]}
          style={styles.askAgainButton}
        >
          <TouchableOpacity
            style={styles.askAgainContent}
            onPress={() => router.push("/plantUpload")}
            activeOpacity={0.8}
          >
            <Sparkles size={20} color="white" />
            <Text style={styles.askAgainText}>Ask Genie AI Again</Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <HowToUse
        isModalOpen={isModalOpen}
        modalContent={modalContent}
        selectedModal={selectedModal}
        setIsModalOpen={setIsModalOpen}
      />
      <MiniTabBar />
    </View>
  );
};

export default RecommendedSolutionScreen;

// Styles (same as original, no changes)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  modernHeader: { paddingTop: 2, marginBottom: 0 },
  headerGradient: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: { alignItems: "center" },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    marginBottom: 8,
  
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ffffff",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  modernTitle: { fontSize: 24, fontFamily: Fonts.Poppins.bold, color: "#1F2937" },
  modernSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.Poppins.regular,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statsContainer: { flexDirection: "row", gap: 18 },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    fontFamily: Fonts.Poppins.regular,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statText: { fontSize: 10, fontWeight:600, fontFamily: Fonts.Poppins.regular, color: "#374151" },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },
  treatmentContainer: { marginBottom: 24 },
  treatmentCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    marginTop: 1,
    
    
  },
  treatmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  treatmentIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  treatmentTextWrapper: { flex: 1 },
  treatmentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: Fonts.Poppins.bold,
    color: "#1F2937",
    marginBottom: 2,
  },
  treatmentSubtitle: { fontSize: 14, fontFamily: Fonts.Poppins.regular, color: "#059669", fontWeight: "500" },
  successBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
  },
  successBadgeText: { color: "white", fontSize: 16, fontWeight: "bold" },
  treatmentList: { gap: 12 },
  treatmentItem: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  treatmentDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  treatmentContent: { flex: 1 },
  diseaseName: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Fonts.Poppins.bold,
    color: "#1F2937",
    marginBottom: 4,
  },
  treatmentText: { fontSize: 14, fontFamily: Fonts.Poppins.regular , color: "#4B5563", lineHeight: 20 },
  productsSection: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  modernCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recommendedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
    letterSpacing: 0.5,
    fontFamily: Fonts.Poppins.bold,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fffbeb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: { fontSize: 12, fontFamily:Fonts.Poppins.regular, fontWeight: "600", color: "#F59E0B" },
  productContent: { flexDirection: "row", marginBottom: 20, gap: 16 },
  productInfo: { flex: 1 },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
    fontFamily: Fonts.Poppins.bold,
  },
  productDisease: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: Fonts.Poppins.medium,
  },
  productDescription: { fontSize: 14, fontFamily:Fonts.Poppins.regular, color: "#6B7280", lineHeight: 20 },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  productImage: { width: "100%", height: "100%", resizeMode: "contain" },
  actionButtons: { flexDirection: "row", gap: 12 },
  infoButton: {
    flex: 1,
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  infoButtonText: { color: "#2563EB",fontFamily: Fonts.Poppins.bold, fontWeight: "600", fontSize: 14 },
  buyButtonGradient: {
    flex: 1,
    borderRadius: 14,
    shadowColor: "#16a34a",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  buyButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  buyButtonText: { color: "white",fontFamily: Fonts.Poppins.bold, fontWeight: "600", fontSize: 14 },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  bottomActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  askAgainButton: {
    borderRadius: 16,
    shadowColor: "#16a34a",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  askAgainContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  askAgainText: { color: "white", fontWeight: "600", fontSize: 16 },
});
