import React, { useState } from 'react';
import { TouchableOpacity, View, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ThemedText } from './ThemedText';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
};

export default function Collapsible({ title, children }: CollapsibleProps) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  return (
    <View style={{ marginVertical: 8 }}>
      <TouchableOpacity
        onPress={toggle}
        accessible
        accessibilityRole="button"
        accessibilityLabel={open ? `Collapse ${title}` : `Expand ${title}`}
      >
        <ThemedText style={{ fontWeight: 'bold', fontSize: 16 }}>
          {title} {open ? '▲' : '▼'}
        </ThemedText>
      </TouchableOpacity>
      {open && (
        <View
          accessible
          accessibilityLabel={`${title} content`}
        >
          {children}
        </View>
      )}
    </View>
  );
}
