import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';

import { useAuth } from '../providers/AuthProvider';
import { theme } from '../theme';

export type HeaderProps = {
  subtitle?: string;
  title: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <View style={styles.titleBlock}>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export function BuyamiaHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const accountLabel = user?.name?.trim()?.[0]?.toUpperCase() ?? '';

  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={() => router.push('/categories')} style={styles.iconButton}>
        <Text style={styles.iconText}>☰</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => router.push('/cart' as Href)} style={styles.cartButton}>
        <Text style={styles.cartText}>▢</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => router.push('/')} style={styles.logoWrap}>
        <Text style={styles.logo}>buyamia</Text>
      </Pressable>
      <Pressable
        accessibilityLabel={user ? `Signed in as ${user.name}` : 'Sign in'}
        accessibilityRole="button"
        onPress={() => router.push((user ? '/saved' : '/auth/sign-in') as Href)}
        style={styles.thumbButton}
      >
        {user ? (
          <Text style={styles.thumbText}>{accountLabel}</Text>
        ) : (
          <Image resizeMode="cover" source={require('../assets/buyamia/featured-1.png')} style={styles.thumb} />
        )}
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => router.push('/search')} style={styles.iconButton}>
        <Text style={styles.searchText}>⌕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cartButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.lime,
    borderRadius: theme.radii.xs,
    height: 29,
    justifyContent: 'center',
    width: 29,
  },
  cartText: {
    color: theme.colors.ink,
    fontSize: 15,
    lineHeight: 16,
  },
  header: {
    alignItems: 'center',
    backgroundColor: theme.colors.paper,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 7,
    minHeight: 50,
    paddingHorizontal: 12,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    height: 29,
    justifyContent: 'center',
    width: 29,
  },
  iconText: {
    color: theme.colors.ink,
    fontSize: 14,
    lineHeight: 15,
  },
  logo: {
    ...theme.typography.brand,
    color: theme.colors.ink,
  },
  logoWrap: {
    alignItems: 'center',
    flex: 1,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.limeDark,
    marginBottom: theme.spacing.xs,
  },
  thumb: {
    borderRadius: theme.radii.xs,
    height: 32,
    width: 32,
  },
  thumbButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.paper,
    borderRadius: theme.radii.xs,
    height: 32,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 32,
  },
  thumbText: {
    ...theme.typography.button,
    color: theme.colors.ink,
  },
  searchText: {
    color: theme.colors.ink,
    fontSize: 15,
    lineHeight: 16,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.ink,
  },
  titleBlock: {
    gap: theme.spacing.xs,
  },
});
