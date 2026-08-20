import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, BuyamiaHeader, Screen, imageAssets } from '../components';
import { getProductById } from '../data';
import { useAuth } from '../providers/AuthProvider';
import { useCart } from '../providers/CartProvider';
import type { CartItem } from '../services/domain/cart';
import { getCartLineSubtotal } from '../services/domain/cart';
import { theme } from '../theme';
import type { ImageKey } from '../types';

const formatIdr = (value: number) => `IDR ${new Intl.NumberFormat('en-US').format(value)}`;

function imageForItem(item: CartItem) {
  const product = getProductById(item.id);
  const imageKey = (item.imageKey ?? product?.imageKey) as ImageKey | undefined;
  return imageKey && imageAssets[imageKey] ? imageAssets[imageKey] : imageAssets.product1;
}

export default function CartScreen() {
  const router = useRouter();
  const { loading: authLoading, user } = useAuth();
  const { error, items, loading, removeProduct, setQuantity, subtotal, total } = useCart();
  const signInHref = '/auth/sign-in?redirect=%2Fcart' as Href;

  return (
    <Screen>
      <BuyamiaHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Cart</Text>
          {authLoading || loading ? <Text style={styles.body}>Loading cart...</Text> : null}
          {!authLoading && !user ? (
            <>
              <Text style={styles.body}>Sign in to use your Buyamia cart.</Text>
              <Button label="Sign In" onPress={() => router.push(signInHref)} />
            </>
          ) : null}
          {error ? <Text style={styles.notice}>{error}</Text> : null}
        </View>

        {user && !loading && !error && items.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.body}>Your cart is empty.</Text>
            <Button label="Browse Marketplace" onPress={() => router.push('/search')} variant="light" />
          </View>
        ) : null}

        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <Image resizeMode="cover" source={imageForItem(item)} style={styles.image} />
            <View style={styles.itemBody}>
              <Text numberOfLines={2} style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.muted}>{formatIdr(item.price)} each</Text>
              <Text style={styles.body}>Line subtotal: {formatIdr(getCartLineSubtotal(item))}</Text>
              <View style={styles.quantityRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void setQuantity(item.id, item.quantity - 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityText}>-</Text>
                </Pressable>
                <Text style={styles.quantityValue}>{item.quantity}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void setQuantity(item.id, item.quantity + 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityText}>+</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void removeProduct(item.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        {items.length > 0 ? (
          <View style={styles.card}>
            <View style={styles.totalRow}>
              <Text style={styles.body}>Subtotal</Text>
              <Text style={styles.body}>{formatIdr(subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalLabel}>{formatIdr(total)}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    ...theme.typography.body,
    color: theme.colors.ink,
  },
  card: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  content: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  image: {
    borderRadius: theme.radii.xs,
    height: 76,
    width: 76,
  },
  item: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  itemBody: {
    flex: 1,
    gap: theme.spacing.xs,
    minWidth: 0,
  },
  itemTitle: {
    ...theme.typography.body,
    color: theme.colors.ink,
    fontWeight: '700',
  },
  muted: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  notice: {
    ...theme.typography.caption,
    color: theme.colors.danger,
  },
  quantityButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  quantityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  quantityText: {
    ...theme.typography.button,
    color: theme.colors.ink,
  },
  quantityValue: {
    ...theme.typography.body,
    color: theme.colors.ink,
    minWidth: 18,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.radii.xs,
    marginLeft: 'auto',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  removeText: {
    ...theme.typography.button,
    color: theme.colors.white,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.ink,
  },
  totalLabel: {
    ...theme.typography.body,
    color: theme.colors.ink,
    fontWeight: '800',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
