import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Fonts } from "../constants/Fonts";


const Button = ({ onPress, text,postIcon }: { onPress: () => void; text: string,postIcon?:any }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
      {postIcon}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row',
    alignSelf: "center",
    width: "46%",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
    fontFamily: Fonts.Poppins.bold,
  },
});
