import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../theme';

type ButtonVariant = 'dark' | 'lime' | 'light' | 'ghost';

export type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, variant = 'dark', disabled = false, style, ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
      {...props}
    >
      <Text style={[styles.label, variant === 'dark' ? styles.darkText : styles.lightText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: theme.radii.xs,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  dark: {
    backgroundColor: theme.colors.charcoal,
  },
  darkText: {
    color: theme.colors.white,
  },
  disabled: {
    opacity: 0.5,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    ...theme.typography.button,
  },
  light: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  lightText: {
    color: theme.colors.ink,
  },
  lime: {
    backgroundColor: theme.colors.lime,
  },
  pressed: {
    opacity: 0.78,
  },
});
