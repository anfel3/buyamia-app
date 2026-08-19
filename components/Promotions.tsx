import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { products } from '../data';
import { theme } from '../theme';
import { BuyamiaHeader, ProductList, Screen, TopTabs } from './index';

const tabs = ['Flash Sale', 'Fast Selling', "Seller's Promo"] as const;

export function PromotionsScreen({ initialTab }: { initialTab: (typeof tabs)[number] }) {
  const [active, setActive] = useState<string>(initialTab);
  const visible = products.filter((product) => {
    if (active === 'Flash Sale') return product.isFlashSale;
    if (active === 'Fast Selling') return product.isFastSelling;
    return product.isSellerPromo;
  });

  return (
    <Screen>
      <BuyamiaHeader />
      <TopTabs active={active} onChange={setActive} tabs={tabs} />
      <View style={styles.content}>
        <ProductList products={visible} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
});
