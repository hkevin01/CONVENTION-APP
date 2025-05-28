import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type TabBarIconProps = {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size?: number;
};

export default function TabBarIcon({ name, color, size = 24 }: TabBarIconProps) {
  return <Ionicons name={name} color={color} size={size} accessibilityRole="image" />;
}
