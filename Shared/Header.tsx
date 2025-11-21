import React from "react";
import { Text, View } from "react-native";
const Header = ({
  styles,
  typedText,
  typedSubtext,
  typedSubtext1
}: {
  styles: any;
  typedText: string;
  typedSubtext: string;
  typedSubtext1: string;
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        {typedText}
        {typedText.length < 30 && <Text style={styles.cursor}>|</Text>}
      </Text>
      <Text style={styles.title1}>
        {typedSubtext1}
        {typedSubtext1.length < 35 && <Text style={styles.cursor}>|</Text>}
      </Text>
      <Text style={styles.subtitle}>
        {typedSubtext}
        {typedSubtext.length < 10 && <Text style={styles.cursor}>|</Text>}
      </Text>
    </View>
  );
};

export default Header;
