import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, BuyamiaHeader, EditorialSection, ProductRail, Screen, imageAssets } from '../../components';
import { getBrandById, getCategoryById, getProductById, products } from '../../data';
import { theme } from '../../theme';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
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
          <Button label="Add to cart" onPress={() => router.push('/auth/sign-in')} />
        </View>
        <EditorialSection title="Backend status" tone="paper">
          <Text style={styles.body}>Cart, checkout, inventory and ordering are still demo-only. No backend success is simulated.</Text>
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
  muted: {
    ...theme.typography.caption,
    color: theme.colors.muted,
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
