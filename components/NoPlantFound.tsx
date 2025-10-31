import { allowedPlants } from "@/constants/image";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Fonts } from "../constants/Fonts";
export const NoPlantFound = ({
  alertVisible,
  setAlertVisible,
}: {
  alertVisible: boolean;
  setAlertVisible: (value: boolean) => void;
}) => {
  const plantImageMapping: Record<string, any> = {
    Rose: require("../assets/images/rose.png"),
    Hibiscus: require("../assets/images/hibiscus.png"),
    "Money Plant": require("../assets/images/moneyplant.png"),
    "Areca Palm": require("../assets/images/arecapalm.png"),
    Tomato: require("../assets/images/tomato.png"),
    "Peace Lily": require("../assets/images/peacelily.png"),
    "Curry Leaf": require("../assets/images/curry.png"),
    Croton: require("../assets/images/croton.png"),
    "Fiddle Leaf Fig": require("../assets/images/fiddle.png"),
    "Snake Plant": require("../assets/images/snakeplant.png"),
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={alertVisible}
      onRequestClose={() => setAlertVisible(false)}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}>
        <View
          style={{
            width: "100%",
            maxWidth: 320,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
            alignItems: "center",
            elevation: 5,
          }}>
          <Image
            source={"../assets/images/robot.png"}
            style={{ width: 50, height: 50, marginBottom: 10 }}
            contentFit="contain"
            cachePolicy={"memory-disk"}
            priority={"high"}
            responsivePolicy={"static"}
          />
          <Text
            style={{
              fontWeight: "700",
              fontSize: 16,
              marginBottom: 10,
              color: "#111827",
              textAlign: "center",
              fontFamily: Fonts.Poppins.bold,
            }}>
            Hey! Plant Parent
          </Text>
          <Text
            style={{
              fontSize: 13,
              textAlign: "center",
              color: "#4B5563",
              marginBottom: 12,
              fontFamily: Fonts.Poppins.regular,
            }}>
            Currently we&apos;re at Version 1.0 of the app with just 10 Plants.
          </Text>
          <Text
            style={{
              fontSize: 13,
              textAlign: "center",
              color: "#4B5563",
              marginBottom: 12,
              fontFamily: Fonts.Poppins.regular,
            }}>
            More Plants Coming soon... Stay Tuned!!
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              width: "100%",
              marginBottom: 15,
            }}>
            {Object.values(allowedPlants || {}).map((commonName, index) => (
              <View
                key={index}
                style={{
                  alignItems: "center",
                  width: "30%",
                  marginBottom: 10,
                }}>
                <Image
                  source={plantImageMapping[commonName as string]}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    marginBottom: 6,
                  }}
                  contentFit="cover"
                  cachePolicy={"memory-disk"}
                  priority={"high"}
                  responsivePolicy={"static"}
                />
                <Text
                  style={{
                    fontSize: 11,
                    color: "#111827",
                    textAlign: "center",
                    fontFamily: Fonts.Poppins.medium,
                  }}>
                  {String(commonName)}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#16a34a",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
            }}
            onPress={() => {
              setAlertVisible(false);
              router.back();
            }}>
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: 14,
                textAlign: "center",
                fontFamily: Fonts.Poppins.bold,
              }}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
