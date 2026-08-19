import { ScrollView, StyleSheet } from 'react-native';

import { BuyamiaHeader, EditorialSection, ProductList, Screen } from '../components';
import { products } from '../data';
import { theme } from '../theme';

export default function RecommendationsScreen() {
  return (
    <Screen>
      <BuyamiaHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <EditorialSection eyebrow="Featured products" title="This week's top picks" />
        <ProductList products={products.filter((product) => product.isRecommended)} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
});
