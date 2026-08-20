import type { Href } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, BuyamiaHeader, EditorialSection, ProductRail, Screen, imageAssets } from '../../components';
import { getBrandById, getCategoryById, getProductById, products } from '../../data';
import { useCart } from '../../providers/CartProvider';
import { useSaved } from '../../providers/SavedProvider';
import { theme } from '../../theme';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addProduct } = useCart();
  const { isSaved, toggleSaved } = useSaved();
  const [notice, setNotice] = useState('');
  const product = typeof id === 'string' ? getProductById(id) : undefined;

  if (!product) {
    return (
      <Screen>
        <BuyamiaHeader />
        <View style={styles.empty}>
          <Text style={styles.title}>Product not found</Text>
          <Button label="Back to marketplace" onPress={() => router.push('/')} />
        </View>
      </Screen>
    );
  }

  const category = getCategoryById(product.categoryId);
  const brand = getBrandById(product.brandId);
  const related = products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id);
  const saved = isSaved(product.id);
  const signInHref = `/auth/sign-in?redirect=${encodeURIComponent(`/product/${product.id}`)}` as Href;

  const handleResult = (result: { message?: string; ok: boolean; reason?: string }) => {
    if (result.ok) {
      setNotice('');
      return;
    }

    if (result.reason === 'auth_required') {
      router.push(signInHref);
      return;
    }

    setNotice(result.message ?? 'This action could not be completed.');
  };

  return (
    <Screen>
      <BuyamiaHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image resizeMode="cover" source={imageAssets[product.imageKey]} style={styles.hero} />
        <View style={styles.card}>
          <Text style={styles.title}>{product.name}</Text>
          {product.discount ? <Text style={styles.discount}>{product.discount}</Text> : null}
          <Text style={styles.body}>{brand?.name ?? product.seller}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.muted}>{product.estimatedPrice}</Text>
            <Text style={styles.price}>{product.idrPrice}</Text>
          </View>
          <Text style={styles.body}>{product.description}</Text>
          <Text style={styles.muted}>
            {category?.label} / {product.room} / {product.soldLabel}
          </Text>
        </View>
        <View style={styles.actions}>
          <Button label="Ask Amia" onPress={() => router.push({ pathname: '/amia', params: { product: product.id } })} variant="lime" />
          <Button label="Add to cart" onPress={() => void addProduct(product).then(handleResult)} />
          <Pressable
            accessibilityRole="button"
            onPress={() => void toggleSaved(product.id).then(handleResult)}
            style={styles.heartButton}
          >
            <Text style={[styles.heartText, saved ? styles.heartSaved : null]}>
              {saved ? '♥ Saved' : '♡ Save product'}
            </Text>
          </Pressable>
        </View>
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        <EditorialSection title="Local prototype" tone="paper">
          <Text style={styles.body}>Accounts, saved products and cart data are stored locally on this device for demo use.</Text>
        </EditorialSection>
        <ProductRail products={related} title="Related products" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: theme.spacing.sm,
  },
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
  discount: {
    ...theme.typography.body,
    color: '#D13C87',
  },
  empty: {
    flex: 1,
    gap: theme.spacing.lg,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  hero: {
    borderRadius: theme.radii.sm,
    height: 270,
    width: '100%',
  },
  heartButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  heartSaved: {
    color: theme.colors.danger,
  },
  heartText: {
    ...theme.typography.button,
    color: theme.colors.ink,
  },
  muted: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  notice: {
    ...theme.typography.caption,
    color: theme.colors.danger,
  },
  price: {
    ...theme.typography.body,
    color: theme.colors.ink,
    fontWeight: '800',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.ink,
  },
});
