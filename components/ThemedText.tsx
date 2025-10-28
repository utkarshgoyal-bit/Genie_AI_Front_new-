import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts } from '@/constants/Fonts';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.Inter.regular,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.Inter.bold,
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.Poppins.bold,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: Fonts.Poppins.bold,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    fontFamily: Fonts.Inter.regular,
    color: '#0a7ea4',
  },
});
