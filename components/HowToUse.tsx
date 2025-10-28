import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
export const HowToUse = ({
  isModalOpen,
  setIsModalOpen,
  selectedModal,
  modalContent,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (values: boolean) => void;
  selectedModal: any;
  modalContent: any;
}) => {
  return (
    <Modal
      isVisible={isModalOpen}
      onBackdropPress={() => setIsModalOpen(false)}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          {selectedModal ? modalContent[selectedModal].title : ""}
        </Text>
        {selectedModal &&
          modalContent[selectedModal].content.map(
            (step: string, index: number) => (
              <Text key={index} style={styles.modalStep}>
                {index + 1}. {step}
              </Text>
            )
          )}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    paddingTop: 45,
    paddingHorizontal: 15,
    flex: 1,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  headerIconContainer: {
    backgroundColor: "#DCFCE7",
    borderRadius: 28,
    padding: 12,
    marginBottom: 16,
    alignSelf: "flex-start",
    shadowColor: "#059669",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#4B5563",
  },
  solutionBox: {
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    gap: 12,
  },
  solutionText: {
    flex: 1,
  },
  solutionTitle: {
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  bulletText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "600",
  },
  horizontalScrollContainer: {
    paddingLeft: 15,
    paddingVertical: 10,
  },
  horizontalCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginRight: 15,
    width: 320,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 10,
  },
  badgeOrange: {
    color: "#F97316",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  orangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F97316",
    marginRight: 6,
  },
  orangeFirst: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeGreen: {
    color: "#059669",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  pulseDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginRight: 6,
  },
  greenFirst: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  cardDescription: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 7,
    lineHeight: 20,
  },
  cardImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  howToButton: {
    flex: 1,
    backgroundColor: "#DBEAFE",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  howToButtonText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  buyButton: {
    flex: 1,
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  buyButtonText: {
    color: "white",
    fontWeight: "600",
  },
  askButton: {
    backgroundColor: "#16a34a",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 40,
  },
  askText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
    color: "#1F2937",
  },
  modalStep: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
});
