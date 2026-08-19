import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  colorSwatches,
  moodOptions,
  rooms,
  styleOptions,
} from '../data';
import { theme } from '../theme';
import type { ImageKey, Product } from '../types';
import { Button } from './Button';

export const imageAssets: Record<ImageKey, number> = {
  avatar1: require('../assets/buyamia/avatar-1.png'),
  avatar2: require('../assets/buyamia/avatar-2.png'),
  avatar3: require('../assets/buyamia/avatar-3.png'),
  bamboo: require('../assets/buyamia/featured-1.png'),
  beauty: require('../assets/buyamia/featured-4.png'),
  brand: require('../assets/buyamia/carved-bg.png'),
  carved: require('../assets/buyamia/carved-chair.jpeg'),
  chair: require('../assets/buyamia/featured-1.png'),
  design: require('../assets/buyamia/design-chair.png'),
  featured1: require('../assets/buyamia/featured-1.png'),
  featured2: require('../assets/buyamia/featured-2.png'),
  featured3: require('../assets/buyamia/featured-3.png'),
  featured4: require('../assets/buyamia/featured-4.png'),
  field: require('../assets/buyamia/hero-field.jpeg'),
  heroRoom: require('../assets/buyamia/category-bg.png'),
  kitchen: require('../assets/buyamia/product-1.jpeg'),
  makers: require('../assets/buyamia/review-2.png'),
  marketplaceBike: require('../assets/buyamia/marketplace-bike.png'),
  marketplaceCars: require('../assets/buyamia/marketplace-cars.png'),
  newsletter: require('../assets/buyamia/review-3.png'),
  product1: require('../assets/buyamia/product-1.jpeg'),
  product2: require('../assets/buyamia/product-2.jpeg'),
  product3: require('../assets/buyamia/product-3.jpeg'),
  qr: require('../assets/buyamia/qr.png'),
  review1: require('../assets/buyamia/review-1.png'),
  review2: require('../assets/buyamia/review-2.png'),
  review3: require('../assets/buyamia/review-3.png'),
  vehicles: require('../assets/buyamia/marketplace-cars.png'),
};

export type EditorialSectionProps = {
  children?: ReactNode;
  eyebrow?: string;
  title: string;
  tone?: 'paper' | 'sand' | 'dark' | 'flat';
};

export function EditorialSection({ children, eyebrow, title, tone = 'flat' }: EditorialSectionProps) {
  return (
    <View style={[styles.section, styles[tone]]}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={[styles.editorialTitle, tone === 'dark' ? styles.darkTitle : null]}>{title}</Text>
      {children}
    </View>
  );
}

export function TopTabs({
  active,
  onChange,
  tabs,
}: {
  active: string;
  onChange: (tab: string) => void;
  tabs: readonly string[];
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
      {tabs.map((tab) => {
        const selected = active === tab;
        return (
          <Pressable key={tab} onPress={() => onChange(tab)} style={styles.tab}>
            <Text style={[styles.tabText, selected ? styles.tabTextActive : null]}>{tab}</Text>
            <View style={[styles.tabLine, selected ? styles.tabLineActive : null]} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function ProductCard({
  compact = false,
  product,
}: {
  compact?: boolean;
  product: Product;
}) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      style={({ pressed }) => [
        styles.productCard,
        compact ? styles.productCompact : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Image resizeMode="cover" source={imageAssets[product.imageKey]} style={styles.productImage} />
      <View style={styles.productBody}>
        <Text numberOfLines={2} style={styles.productName}>
          {product.name}
        </Text>
        {product.discount ? <Text style={styles.discount}>{product.discount}</Text> : null}
        <View style={styles.productMetaRow}>
          <Text numberOfLines={1} style={styles.productMeta}>{product.estimatedPrice}</Text>
          <Text numberOfLines={1} style={styles.productSeller}>{product.seller}</Text>
        </View>
        <View style={styles.productMetaRow}>
          <Text numberOfLines={1} style={styles.price}>{product.idrPrice}</Text>
          <Text style={styles.productMeta}>★ {product.rating}/5</Text>
        </View>
        <View style={styles.productActions}>
          <Text style={styles.pill}>{product.availability ?? 'Living Room'}</Text>
          <Text style={styles.smallAction}>+</Text>
          <Text style={styles.smallAction}>♡</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function ProductRail({ products, title }: { products: Product[]; title?: string }) {
  return (
    <View style={styles.railWrap}>
      {title ? <Text style={styles.railTitle}>{title}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {products.map((product) => (
          <ProductCard compact key={product.id} product={product} />
        ))}
      </ScrollView>
    </View>
  );
}

export function ProductList({ products }: { products: Product[] }) {
  return (
    <View style={styles.list}>
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </View>
  );
}

export function ProductRow({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      style={({ pressed }) => [styles.productRow, pressed ? styles.pressed : null]}
    >
      <Image resizeMode="cover" source={imageAssets[product.imageKey]} style={styles.productRowImage} />
      <View style={styles.productRowBody}>
        <Text numberOfLines={1} style={styles.productRowName}>{product.name}</Text>
        {product.discount ? <Text style={styles.discount}>{product.discount}</Text> : null}
        <View style={styles.productMetaRow}>
          <Text style={styles.productMeta}>{product.soldLabel}</Text>
          <Text style={styles.productMeta}>★ {product.rating}/5</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function MiniAmia({ onOpen }: { onOpen?: () => void }) {
  const router = useRouter();
  const handleOpen = onOpen ?? (() => router.push('/amia'));

  return (
    <View style={styles.amia}>
      <Text style={styles.amiaBubble}>Hi there 👋 I am Amia. Powered by Buyamia. How can I help?</Text>
      <View style={styles.suggestionGrid}>
        {['Discover products', 'About Amia', 'Find fleet options', 'Search your ideal specs'].map((item) => (
          <Pressable key={item} onPress={handleOpen} style={styles.suggestion}>
            <Text style={styles.suggestionText}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={handleOpen} style={styles.amiaInput}>
        <Text style={styles.muted}>Let Amia find it for you...</Text>
        <Text style={styles.spark}>✣</Text>
      </Pressable>
    </View>
  );
}

export function ImageHero({
  imageKey,
  label,
}: {
  imageKey: ImageKey;
  label?: string;
}) {
  return (
    <View style={styles.heroImageWrap}>
      <Image resizeMode="cover" source={imageAssets[imageKey]} style={styles.heroImage} />
      {label ? (
        <View style={styles.heroLabel}>
          <Text style={styles.heroLabelText}>{label}</Text>
        </View>
      ) : null}
    </View>
  );
}

export type FilterState = {
  colors: string[];
  maxPrice?: number;
  minPrice?: number;
  moods: string[];
  room?: string;
  styles: string[];
};

const toggle = (items: string[], item: string) =>
  items.includes(item) ? items.filter((value) => value !== item) : [...items, item];

export function FilterPanel({
  filters,
  onApply,
  onChange,
  onClose,
}: {
  filters: FilterState;
  onApply: () => void;
  onChange: (filters: FilterState) => void;
  onClose: () => void;
}) {
  return (
    <View style={styles.filterOverlay}>
      <View style={styles.filterPanel}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filters</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.close}>x</Text>
          </Pressable>
        </View>
        <FilterGroup title="Style">
          <View style={styles.optionGrid}>
            {styleOptions.map((item) => (
              <Pressable
                key={item}
                onPress={() => onChange({ ...filters, styles: toggle(filters.styles, item) })}
                style={styles.option}
              >
                <Text style={styles.radio}>{filters.styles.includes(item) ? '◉' : '○'}</Text>
                <Text style={styles.optionText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </FilterGroup>
        <FilterGroup title="Mood">
          <View style={styles.optionGrid}>
            {moodOptions.map((item) => (
              <Pressable
                key={item}
                onPress={() => onChange({ ...filters, moods: toggle(filters.moods, item) })}
                style={styles.option}
              >
                <Text style={styles.radio}>{filters.moods.includes(item) ? '◉' : '○'}</Text>
                <Text style={styles.optionText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </FilterGroup>
        <FilterGroup title="Price">
          <View style={styles.priceRow}>
            <Pressable onPress={() => onChange({ ...filters, minPrice: 0 })} style={styles.priceBox}>
              <Text style={styles.muted}>0 IDR</Text>
            </Pressable>
            <Pressable onPress={() => onChange({ ...filters, maxPrice: 1000000 })} style={styles.priceBox}>
              <Text style={styles.muted}>1,000,000 IDR</Text>
            </Pressable>
          </View>
        </FilterGroup>
        <FilterGroup title="Room">
          <View style={styles.roomRow}>
            {rooms.map((room) => (
              <Pressable
                key={room}
                onPress={() => onChange({ ...filters, room: filters.room === room ? undefined : room })}
                style={[styles.roomChip, filters.room === room ? styles.roomChipActive : null]}
              >
                <Text style={styles.optionText}>{room}</Text>
              </Pressable>
            ))}
          </View>
        </FilterGroup>
        <FilterGroup title="Color">
          <View style={styles.swatches}>
            {colorSwatches.map((color) => (
              <Pressable
                key={color}
                onPress={() => onChange({ ...filters, colors: toggle(filters.colors, color) })}
                style={[
                  styles.swatch,
                  { backgroundColor: color },
                  filters.colors.includes(color) ? styles.swatchActive : null,
                ]}
              />
            ))}
          </View>
        </FilterGroup>
        <Button label="Apply" onPress={onApply} />
      </View>
    </View>
  );
}

function FilterGroup({ children, title }: { children: ReactNode; title: string }) {
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterGroupTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function FeedbackModal({
  email,
  message,
  notice,
  onClose,
  onEmailChange,
  onMessageChange,
  onSubmit,
}: {
  email: string;
  message: string;
  notice: string;
  onClose: () => void;
  onEmailChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.feedbackOverlay}>
      <View style={styles.feedbackCard}>
        <Image source={imageAssets.brand} style={styles.feedbackImage} />
        <View style={styles.feedbackBody}>
          <View style={styles.filterHeader}>
            <Text style={styles.feedbackTitle}>Help us serve you better</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.close}>x</Text>
            </Pressable>
          </View>
          <Text style={styles.bodyText}>
            We are always working to make Buyamia a better experience. Tell us what is working and what is not. As a thank you, you will receive 10% off your next purchase once backend submission is connected.
          </Text>
          <TextInput
            autoCapitalize="none"
            inputMode="email"
            onChangeText={onEmailChange}
            placeholder="john@email.com"
            placeholderTextColor={theme.colors.muted}
            style={styles.input}
            value={email}
          />
          <TextInput
            multiline
            onChangeText={onMessageChange}
            placeholder="How could we serve you better?"
            placeholderTextColor={theme.colors.muted}
            style={[styles.input, styles.textArea]}
            value={message}
          />
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
          <Button label="Submit" onPress={onSubmit} />
        </View>
      </View>
    </View>
  );
}

export function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerLogo}>buyamia</Text>
      <Text style={styles.footerTitle}>Buy some comfort. Buy some care.</Text>
      <View style={styles.footerGrid}>
        {['All Products', 'Furniture', 'Home Decor', 'About Us', 'Sustainability', 'Blog', 'Contact Us', 'Terms & Privacy'].map((item) => (
          <Text key={item} style={styles.footerLink}>{item}</Text>
        ))}
      </View>
      <Text style={styles.copyright}>Copyright © Buyamia 2026</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  amia: {
    backgroundColor: theme.colors.appAlt,
    borderRadius: theme.radii.sm,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  amiaBubble: {
    ...theme.typography.body,
    backgroundColor: theme.colors.sand,
    borderRadius: theme.radii.sm,
    color: theme.colors.ink,
    padding: theme.spacing.md,
  },
  amiaInput: {
    alignItems: 'center',
    backgroundColor: theme.colors.paper,
    borderRadius: theme.radii.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 43,
    paddingHorizontal: theme.spacing.md,
  },
  bodyText: {
    ...theme.typography.body,
    color: theme.colors.ink,
  },
  close: {
    ...theme.typography.body,
    color: theme.colors.muted,
    fontSize: 18,
  },
  copyright: {
    ...theme.typography.caption,
    color: theme.colors.sand,
    textAlign: 'center',
  },
  dark: {
    backgroundColor: theme.colors.charcoal,
  },
  darkTitle: {
    color: theme.colors.white,
  },
  discount: {
    ...theme.typography.caption,
    color: '#D13C87',
  },
  editorialTitle: {
    ...theme.typography.h2,
    color: theme.colors.ink,
  },
  eyebrow: {
    ...theme.typography.caption,
    color: theme.colors.limeDark,
  },
  feedbackBody: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  feedbackCard: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.radii.md,
    overflow: 'hidden',
    width: '86%',
  },
  feedbackImage: {
    height: 130,
    width: '100%',
    resizeMode: 'cover',
  },
  feedbackOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.64)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
  },
  feedbackTitle: {
    ...theme.typography.h3,
    color: theme.colors.ink,
    flex: 1,
  },
  filterGroup: {
    borderTopColor: theme.colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  },
  filterGroupTitle: {
    ...theme.typography.caption,
    color: theme.colors.ink,
  },
  filterHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  filterOverlay: {
    backgroundColor: theme.colors.charcoal,
    flex: 1,
    padding: theme.spacing.lg,
  },
  filterPanel: {
    backgroundColor: theme.colors.app,
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  filterTitle: {
    ...theme.typography.h2,
    color: theme.colors.ink,
  },
  flat: {
    backgroundColor: 'transparent',
  },
  footer: {
    backgroundColor: theme.colors.charcoal,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  footerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  footerLink: {
    ...theme.typography.caption,
    color: theme.colors.white,
    width: '45%',
  },
  footerLogo: {
    ...theme.typography.brand,
    color: theme.colors.ink,
  },
  footerTitle: {
    ...theme.typography.h2,
    color: theme.colors.white,
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  heroImageWrap: {
    borderRadius: theme.radii.sm,
    height: 232,
    overflow: 'hidden',
  },
  heroLabel: {
    alignSelf: 'center',
    backgroundColor: theme.colors.lime,
    borderRadius: theme.radii.xs,
    bottom: 82,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    position: 'absolute',
  },
  heroLabelText: {
    ...theme.typography.button,
    color: theme.colors.ink,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    color: theme.colors.ink,
    minHeight: 38,
    paddingHorizontal: theme.spacing.md,
  },
  list: {
    gap: theme.spacing.sm,
  },
  muted: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  notice: {
    ...theme.typography.caption,
    color: theme.colors.danger,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
    width: '48%',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  optionText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    textTransform: 'capitalize',
  },
  paper: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    padding: theme.spacing.md,
  },
  pill: {
    ...theme.typography.caption,
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    color: theme.colors.muted,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  pressed: {
    opacity: 0.78,
  },
  price: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    fontWeight: '700',
  },
  priceBox: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  productActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  productBody: {
    gap: 4,
    padding: 6,
  },
  productCard: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  productCompact: {
    width: 148,
  },
  productImage: {
    height: 116,
    width: '100%',
  },
  productMeta: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  productMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  productName: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    fontSize: 9,
    fontWeight: '500',
    lineHeight: 12,
    minHeight: 24,
  },
  productRow: {
    alignItems: 'center',
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 56,
    overflow: 'hidden',
    padding: 5,
  },
  productRowBody: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  productRowImage: {
    borderRadius: theme.radii.xs,
    height: 48,
    width: 48,
  },
  productRowName: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    fontSize: 9,
    fontWeight: '500',
    lineHeight: 12,
  },
  productSeller: {
    ...theme.typography.caption,
    color: theme.colors.ink,
  },
  radio: {
    ...theme.typography.caption,
    color: theme.colors.ink,
  },
  rail: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.md,
  },
  railTitle: {
    ...theme.typography.h3,
    color: theme.colors.ink,
  },
  railWrap: {
    gap: theme.spacing.md,
  },
  roomChip: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  roomChipActive: {
    backgroundColor: theme.colors.lime,
  },
  roomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  sand: {
    backgroundColor: theme.colors.appAlt,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
  },
  section: {
    gap: theme.spacing.sm,
  },
  smallAction: {
    ...theme.typography.caption,
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    color: theme.colors.ink,
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  spark: {
    color: theme.colors.ink,
  },
  suggestion: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.radii.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  suggestionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  suggestionText: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  swatch: {
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    height: 26,
    width: 26,
  },
  swatchActive: {
    borderColor: theme.colors.ink,
    borderWidth: 2,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tab: {
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  tabLine: {
    backgroundColor: 'transparent',
    height: 2,
    width: '100%',
  },
  tabLineActive: {
    backgroundColor: theme.colors.limeDark,
  },
  tabText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
  },
  tabTextActive: {
    color: theme.colors.limeDark,
  },
  tabs: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexGrow: 0,
    flexShrink: 0,
    height: 45,
  },
  textArea: {
    minHeight: 88,
    paddingTop: theme.spacing.md,
  },
});
