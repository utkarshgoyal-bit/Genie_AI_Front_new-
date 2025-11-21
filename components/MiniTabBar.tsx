// components/MiniTabBar.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fonts } from "../constants/Fonts";

const { width } = Dimensions.get("window");

export default function MiniTabBar({ visible = true }: { visible?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.footerContainer}>
      <View
        style={styles.tabBar}
        pointerEvents="box-none">
        {/* Left Tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/productv2")}>
          <MaterialCommunityIcons
            name="package-variant"
            size={24}
            color={pathname === "/productv2" ? "#22c55e" : "black"}
          />
          <Text style={[styles.tabLabel, pathname === "/productv2" && styles.activeTabLabel]}>Product</Text>
        </TouchableOpacity>

        {/* Spacer for center button */}
        <View style={styles.spacer} />
        {/* Right Tab */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/profile")}>
          <MaterialCommunityIcons
            name="account"
            size={24}
            color={pathname === "/profile" ? "#22c55e" : "black"}
          />
          <Text style={[styles.tabLabel, pathname === "/profile" && styles.activeTabLabel]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Center Button with Engraving Effect */}
      <View style={styles.centerButtonWrapper}>
        {/* Outer Engraved Ring */}
        <View style={styles.outerRing}>
          {/* Middle Ring */}
          <View style={styles.middleRing}>
            {/* Inner Button with Gradient */}
            <LinearGradient
              colors={["#ffffff", "#ffffff", "#ffffff"]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <TouchableOpacity
                onPress={() => router.push("/plantUpload")}
                style={styles.centerButton}
                activeOpacity={0.8}>
                {/* Image Container with Raised Effect */}
                <View style={styles.imageContainer}>
                  <View style={styles.imageRaisedWrapper}>
                    <Image
                      source={require("../assets/images/BotIcon.png")}
                      style={styles.centerImage}
                      cachePolicy={"memory-disk"}
                      priority={"high"}
                      responsivePolicy={"static"}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    position: "absolute",
    bottom: 0,
    width,
    alignItems: "center",
    zIndex: 50,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    width: "100%",
    height: 100,
    paddingVertical: 1,
    paddingHorizontal: 45,
    borderTopWidth: 1,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
    paddingBottom: 36,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    color: "black",
    marginTop: 0,
    fontFamily: Fonts.Poppins.medium
  },
  activeTabLabel: {
    color: "#22c55e",
  },
  centerButtonWrapper: {
    position: "absolute",
    top: -10, // Raised higher for more dramatic effect
    left: "50%",
    marginLeft: -47.5, // Adjusted for larger button
    zIndex: 100,
  },
  // Outer engraved ring - creates the carved-out effect
  outerRing: {
    width: 95,
    height: 95,
    
    alignItems: "center",
    justifyContent: "center",
  
  },
  // Middle ring - adds depth
  middleRing: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    // Creates inset shadow effect
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  // Gradient button container
  gradientButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#e5e7eb",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
  centerButton: {
    width: "100%",
    height: "100%",
    borderRadius: 37.5,
    alignItems: "center",
    justifyContent: "center",
    // Additional inner shadow
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  // Image container with raised effect
  imageContainer: {
    width: 50,
    height: 50,
 
    alignItems: "center",
    justifyContent: "center",
    
  },
  // Wrapper that makes the image appear raised
  imageRaisedWrapper: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
   
  },
  centerImage: {
    width: 65,
    height: 65,
    resizeMode: "contain",
    
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  spacer: {
    width: 85,
  },
});
