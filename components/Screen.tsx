import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../theme';

export type ScreenProps = {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, contentStyle, style }: ScreenProps) {
  return (
    <View style={styles.outer}>
      <SafeAreaView edges={['top', 'left', 'right']} style={[styles.phone, style]}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
  },
  outer: {
    alignItems: 'center',
    backgroundColor: Platform.OS === 'web' ? theme.colors.exterior : theme.colors.app,
    flex: 1,
    width: '100%',
  },
  phone: {
    backgroundColor: theme.colors.app,
    flex: 1,
    maxWidth: Platform.OS === 'web' ? 430 : undefined,
    overflow: Platform.OS === 'web' ? 'hidden' : 'visible',
    width: '100%',
  },
});
