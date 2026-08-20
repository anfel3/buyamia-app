import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, BuyamiaHeader, ProductList, Screen } from '../components';
import { products } from '../data';
import { useAuth } from '../providers/AuthProvider';
import { useSaved } from '../providers/SavedProvider';
import { theme } from '../theme';

export default function SavedScreen() {
  const router = useRouter();
  const { loading: authLoading, user } = useAuth();
  const { error, loading, savedProductIds } = useSaved();
  const savedProducts = products.filter((product) => savedProductIds.includes(product.id));
  const signInHref = '/auth/sign-in?redirect=%2Fsaved' as Href;

  return (
    <Screen>
      <BuyamiaHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Saved</Text>
          {authLoading || loading ? <Text style={styles.body}>Loading saved products...</Text> : null}
          {!authLoading && !user ? (
            <>
              <Text style={styles.body}>Sign in to save products to your Buyamia account.</Text>
              <Button label="Sign In" onPress={() => router.push(signInHref)} />
            </>
          ) : null}
          {user ? <Text style={styles.body}>Saved for {user.name}.</Text> : null}
          {error ? <Text style={styles.notice}>{error}</Text> : null}
        </View>

        {user && !loading && !error && savedProducts.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.body}>No saved products yet.</Text>
            <Button label="Browse Marketplace" onPress={() => router.push('/search')} variant="light" />
          </View>
        ) : null}

        {savedProducts.length > 0 ? <ProductList products={savedProducts} /> : null}
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
  notice: {
    ...theme.typography.caption,
    color: theme.colors.danger,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.ink,
  },
});
