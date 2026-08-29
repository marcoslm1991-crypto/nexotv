import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { COLORS } from '../theme/colors';

interface FocusableItemProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  focusedStyle?: StyleProp<ViewStyle>;
  hasTVPreferredFocus?: boolean;
}

export const FocusableItem: React.FC<FocusableItemProps> = ({
  onPress,
  children,
  style,
  focusedStyle,
  hasTVPreferredFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      hasTVPreferredFocus={hasTVPreferredFocus}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onPress={onPress}
      style={[
        styles.defaultItem,
        style,
        isFocused && styles.focusedDefault,
        isFocused && focusedStyle,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultItem: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  focusedDefault: {
    borderColor: COLORS.electricBlue,
    backgroundColor: COLORS.cardBgHover,
    transform: [{ scale: 1.04 }],
    shadowColor: COLORS.neonViolet,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 10,
  },
});
