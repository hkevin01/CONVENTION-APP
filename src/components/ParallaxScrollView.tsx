import React, { ReactNode, useRef } from 'react';
import { Animated, ScrollView, View, StyleSheet, Image, Platform } from 'react-native';

type ParallaxScrollViewProps = {
  headerImage: any;
  headerHeight?: number;
  children: ReactNode;
};

export default function ParallaxScrollView({
  headerImage,
  headerHeight = 200,
  children,
}: ParallaxScrollViewProps) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight / 2],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.Image
        source={headerImage}
        style={[
          styles.header,
          { height: headerHeight, transform: [{ translateY: headerTranslate }] },
        ]}
        resizeMode="cover"
        accessibilityIgnoresInvertColors={Platform.OS === 'ios'}
        accessible
        accessibilityLabel="Parallax header image"
      />
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: headerHeight }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        accessibilityRole="scrollbar"
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
  },
});
