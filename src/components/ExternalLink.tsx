import React from 'react';
import { Linking, Pressable, Text, StyleSheet } from 'react-native';

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function ExternalLink({ href, children }: ExternalLinkProps) {
  const handlePress = () => {
    Linking.openURL(href);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityLabel={`External link to ${href}`}
      style={({ pressed }) => [
        styles.link,
        pressed && { opacity: 0.6 },
      ]}
    >
      <Text style={styles.linkText}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    padding: 4,
  },
  linkText: {
    color: '#007aff',
    textDecorationLine: 'underline',
  },
});
