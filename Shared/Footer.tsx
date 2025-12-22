import React from "react";
import { Text, View } from "react-native";
const Footer = ({
  typedLastText,
  styles,
}: {
  typedLastText: string;
  styles: any;
}) => {
  return (
    <View style={styles.footer}>
      {/* <Text style={styles.footerText}>
        {typedLastText}
        {typedLastText.length < 35 && <Text style={styles.cursor}>|</Text>}
      </Text> */}
      <Text style={styles.infoText}>
        Powered by Genie AI • Trusted by Plant Parents 
      </Text>
    </View>
  );
};

export default Footer;
