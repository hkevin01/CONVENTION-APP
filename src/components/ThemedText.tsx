import * as React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

export function ThemedText(props: TextProps & { lightColor?: string; darkColor?: string }) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <Text style={[{ color }, style]} {...otherProps} />;
}
