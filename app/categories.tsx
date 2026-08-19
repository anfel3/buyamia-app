import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, BuyamiaHeader, EditorialSection, ImageHero, MiniAmia, ProductRail, Screen, TopTabs, imageAssets } from '../components';
import { brands, categories, marketplaces, products } from '../data';
import { theme } from '../theme';

const tabs = ['Buy-A-Mazing', 'Categories', 'Brands', 'Marketplaces'] as const;

export default function CategoriesScreen() {
  const router = useRouter();
  const [active, setActive] = useState<string>('Categories');
  const [openCategory, setOpenCategory] = useState(categories[0].id);
  const [openBrand, setOpenBrand] = useState(brands[0].id);
  const [openMarketplace, setOpenMarketplace] = useState(marketplaces[0].id);

  const category = categories.find((item) => item.id === openCategory) ?? categories[0];
  const brand = brands.find((item) => item.id === openBrand) ?? brands[0];
  const marketplace = marketplaces.find((item) => item.id === openMarketplace) ?? marketplaces[0];

  return (
    <Screen>
      <BuyamiaHeader />
      <TopTabs active={active} onChange={setActive} tabs={tabs} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {active === 'Buy-A-Mazing' ? (
          <>
            <EditorialSection title="Stay Buy-A-Mazing!" tone="paper">
              <Text style={styles.body}>Discover and shop premium Indonesian products at our online wholesale marketplace.</Text>
              <MiniAmia />
            </EditorialSection>
            <ImageHero imageKey="heroRoom" label="Furniture" />
            <UtilityButtons />
          </>
        ) : null}

        {active === 'Categories' ? (
          <>
            <View style={styles.selector}>
              {categories.map((item) => (
                <Pressable key={item.id} onPress={() => setOpenCategory(item.id)} style={styles.selectorItem}>
                  <Text style={[styles.selectorText, openCategory === item.id ? styles.selectorTextActive : null]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
            <EditorialSection title={category.label} tone="sand">
              <View style={styles.subGrid}>
                {category.subcategories.map((item) => (
                  <Pressable key={item} onPress={() => router.push({ pathname: '/search', params: { category: category.id, query: item } })}>
                    <Text style={styles.subItem}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            </EditorialSection>
            <Image resizeMode="cover" source={imageAssets[category.imageKey]} style={styles.featureImage} />
            <ProductRail products={products.filter((product) => product.categoryId === category.id)} />
            <UtilityButtons />
          </>
        ) : null}

        {active === 'Brands' ? (
          <>
            <View style={styles.selector}>
              {brands.map((item) => (
                <Pressable key={item.id} onPress={() => setOpenBrand(item.id)} style={styles.selectorItem}>
                  <Text style={[styles.selectorText, openBrand === item.id ? styles.selectorTextActive : null]}>{item.name}</Text>
                </Pressable>
              ))}
            </View>
            <EditorialSection title={brand.name} tone="sand">
              <Image resizeMode="cover" source={imageAssets[brand.imageKey]} style={styles.brandImage} />
              <Text style={styles.body}>{brand.description}</Text>
            </EditorialSection>
            <ProductRail products={products.filter((product) => product.brandId === brand.id)} />
            <UtilityButtons />
          </>
        ) : null}

        {active === 'Marketplaces' ? (
          <>
            <View style={styles.selector}>
              {marketplaces.map((item) => (
                <Pressable key={item.id} onPress={() => setOpenMarketplace(item.id)} style={styles.selectorItem}>
                  <Text style={[styles.selectorText, openMarketplace === item.id ? styles.selectorTextActive : null]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
            <EditorialSection eyebrow="Everything Marketplace Network" title={marketplace.label} tone="paper">
              <Image resizeMode="cover" source={imageAssets[marketplace.imageKey]} style={styles.brandImage} />
              <Text style={styles.body}>{marketplace.description}</Text>
            </EditorialSection>
            <MiniAmia />
            <UtilityButtons />
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function UtilityButtons() {
  const router = useRouter();

  return (
    <View style={styles.utility}>
      <View style={styles.utilityRow}>
        <Button label="Source" onPress={() => router.push('/amia')} variant="light" />
        <Button label="About" onPress={() => router.push('/')} variant="light" />
        <Button label="Sell on Buyamia" onPress={() => router.push('/auth/sign-up')} variant="light" />
      </View>
      <Button label="Start Shopping" onPress={() => router.push('/search')} variant="lime" />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    ...theme.typography.body,
    color: theme.colors.ink,
  },
  brandImage: {
    borderRadius: theme.radii.sm,
    height: 210,
    width: '100%',
  },
  content: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  featureImage: {
    borderRadius: theme.radii.sm,
    height: 242,
    width: '100%',
  },
  selector: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  selectorItem: {
    minHeight: 27,
    justifyContent: 'center',
  },
  selectorText: {
    ...theme.typography.h3,
    color: theme.colors.ink,
  },
  selectorTextActive: {
    backgroundColor: theme.colors.appAlt,
  },
  subGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  subItem: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    width: 132,
  },
  utility: {
    borderTopColor: theme.colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  utilityRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
});
