import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  Button,
  BuyamiaHeader,
  EditorialSection,
  FeedbackModal,
  Footer,
  ImageHero,
  MiniAmia,
  ProductRail,
  Screen,
  imageAssets,
} from '../components';
import { brands, categories, marketplaces, products } from '../data';
import { theme } from '../theme';

const roomTabs = ['Bathroom', 'Living Room', 'Kitchen', 'Garden'] as const;

export default function HomeScreen() {
  const router = useRouter();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [notice, setNotice] = useState('');

  const submitFeedback = () => {
    if (!email.includes('@') || feedback.trim().length < 8) {
      setNotice('Please enter a valid email and a short comment.');
      return;
    }
    setNotice('Demo mode: feedback is validated locally. Backend submission comes next.');
  };

  return (
    <Screen>
      <BuyamiaHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <EditorialSection title="The Intelligent Everything Marketplace Network." tone="sand">
          <Text style={styles.body}>Sourced from the heart of Indonesia.</Text>
          <Text style={styles.body}>
            Buyamia connects global buyers with Indonesia's finest artisan makers, from single
            orders to full container sourcing.
          </Text>
          <Button label="Browse Marketplace" onPress={() => router.push('/categories')} />
        </EditorialSection>

        <View style={styles.liveCard}>
          <Image resizeMode="cover" source={imageAssets.brand} style={styles.liveImage} />
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>Live Now</Text>
          </View>
          <ProductRail products={products.slice(0, 2)} />
        </View>

        <EditorialSection title="Watch. Discover. Buy - in real time." tone="paper">
          <View style={styles.videoRow}>
            {[
              ['Jalin', 'avatar1'],
              ['Lombok', 'featured1'],
              ['Ceramic', 'product2'],
              ['Bali', 'avatar2'],
            ].map(([label, imageKey]) => (
              <View key={label} style={styles.videoTile}>
                <Image resizeMode="cover" source={imageAssets[imageKey as keyof typeof imageAssets]} style={styles.videoImage} />
                <Text style={styles.videoText}>{label}</Text>
              </View>
            ))}
          </View>
          <Button label="Shop with friends" onPress={() => router.push('/community')} variant="light" />
        </EditorialSection>

        <EditorialSection title="Your friends are your best personal shoppers." tone="paper">
          <TextInput placeholder="john@email.com" placeholderTextColor={theme.colors.muted} style={styles.input} />
          <Button label="Join Waitlist" onPress={() => setFeedbackOpen(true)} />
          <Image source={imageAssets.qr} style={styles.qr} />
        </EditorialSection>

        <EditorialSection eyebrow="Buy in bulk" title="Sourcing, made simple. Quality, guaranteed." tone="sand">
          {['Buyers Guarantee', 'White Label & Custom Orders', 'End-to-End Logistics', '24-Hour Support'].map((item) => (
            <View key={item} style={styles.infoCard}>
              <Text style={styles.infoTitle}>{item}</Text>
              <Text style={styles.muted}>Your sourcing path stays organized and transparent.</Text>
            </View>
          ))}
          <Button label="Procurement Log In" onPress={() => router.push('/auth/sign-in')} />
        </EditorialSection>

        <EditorialSection eyebrow="Meet Amia - Powered by Buyamia" title="Tell us what you need. We'll find it.">
          <MiniAmia />
        </EditorialSection>

        <ImageHero imageKey="heroRoom" label="Furniture" />
        <ProductRail products={products.filter((product) => product.isRecommended)} title="This week's top picks" />

        <EditorialSection eyebrow="The Everything Marketplace" title="Whatever you need. It's here." tone="sand">
          <Text style={styles.body}>
            Buyamia is not just one marketplace. Browse categories, marketplaces and sourcing flows
            from a single mobile experience.
          </Text>
          <MiniAmia />
          <ImageHero imageKey="vehicles" label="Vehicles" />
        </EditorialSection>

        <EditorialSection title="Trusted by buyers around the world">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewRail}>
            {['Ellen', 'Maya', 'Rafi'].map((name) => (
              <View key={name} style={styles.reviewCard}>
                <Image
                  resizeMode="cover"
                  source={imageAssets[name === 'Ellen' ? 'review1' : name === 'Maya' ? 'review2' : 'review3']}
                  style={styles.reviewImage}
                />
                <Text style={styles.body}>A short snippet of review for a popular product goes here.</Text>
                <Text style={styles.stars}>*****</Text>
                <Text style={styles.infoTitle}>{name}</Text>
              </View>
            ))}
          </ScrollView>
        </EditorialSection>

        <EditorialSection eyebrow="Empowering Business Partners and Brands" title="Curated to deliver at any scale." tone="sand">
          <View style={styles.brandRow}>
            {brands.map((brand) => (
              <Pressable key={brand.id} onPress={() => router.push('/categories')} style={styles.brandLogo}>
                <Text style={styles.brandText}>{brand.name}</Text>
              </Pressable>
            ))}
          </View>
          <Button label="Explore all brands" onPress={() => router.push('/categories')} />
        </EditorialSection>

        <ProductRail products={products.filter((product) => product.categoryId === 'home-decoration')} title="Home Decoration" />

        <EditorialSection eyebrow="Top Collection" title="Bamboo furniture" tone="sand">
          <Text style={styles.body}>
            Every piece in the Bamboo Collection starts with hand techniques and ends with warm,
            livable shapes.
          </Text>
          <ProductRail products={products.filter((product) => product.name.includes('Bamboo'))} />
          <Button label="Shop Collection" onPress={() => router.push('/search?category=furniture')} />
        </EditorialSection>

        <ProductRail products={products.filter((product) => product.isFastSelling)} title="Fast Selling Beauty & Care" />
        <ProductRail products={products.slice(0, 3)} title="Shop curated packages" />

        <EditorialSection eyebrow="Meet top makers" title="From hands to hearts. Every product has a story.">
          <ImageHero imageKey="makers" />
          <Button label="Watch Fullscreen" onPress={() => setFeedbackOpen(true)} variant="light" />
        </EditorialSection>

        <EditorialSection eyebrow="Featured brands" title="Artisan craft. Enterprise capability.">
          <ProductRail products={products.filter((product) => product.brandId === 'artisan-craft')} />
        </EditorialSection>

        <EditorialSection title="Your product, your way">
          <View style={styles.stackCards}>
            <ActionTile imageKey="design" title="Design your own" label="Build your own package with Amia" onPress={() => router.push('/amia')} />
            <ActionTile title="Buy together, save together." label="Join a Buying Pool" onPress={() => router.push('/community')} dark />
            <ActionTile imageKey="brand" title="Shop designer items" label="Browse curated collections" onPress={() => router.push('/categories')} />
          </View>
        </EditorialSection>

        <EditorialSection eyebrow="Premium Appliances" title="Performance in every detail." tone="sand">
          <ProductRail products={products.filter((product) => product.room === 'Kitchen')} />
          <Button label="Shop Category" onPress={() => router.push('/search?category=food-beverage')} />
        </EditorialSection>

        <ImageHero imageKey="heroRoom" label="Living Room" />
        <View style={styles.roomTabs}>
          {roomTabs.map((room) => (
            <Pressable key={room} onPress={() => router.push('/search')} style={styles.roomTab}>
              <Text style={styles.roomText}>{room}</Text>
            </Pressable>
          ))}
        </View>

        <EditorialSection eyebrow="Buyamia B2B Sourcing" title="Need something beyond the catalogue?" tone="sand">
          {['Corporate & Government', 'Custom & White Label', 'Vendor Overstock & Samples', 'Specialty Sourcing'].map((item) => (
            <View key={item} style={styles.infoCard}>
              <Text style={styles.infoTitle}>{item}</Text>
              <Text style={styles.muted}>Procurement for larger-scale projects and direct sourcing.</Text>
            </View>
          ))}
          <Button label="Procurement Log In" onPress={() => router.push('/auth/sign-in')} />
        </EditorialSection>

        <EditorialSection eyebrow="Our Impact Partners" title="Every purchase does more than you think.">
          <View style={styles.brandRow}>
            {brands.slice(1, 4).map((brand) => (
              <View key={brand.id} style={styles.partnerCard}>
                <Text style={styles.brandText}>{brand.name}</Text>
              </View>
            ))}
          </View>
        </EditorialSection>

        <View style={styles.newsletter}>
          <Image resizeMode="cover" source={imageAssets.newsletter} style={styles.newsImage} />
          <View style={styles.newsBox}>
            <Text style={styles.newsTitle}>Stay in the loop. Make a difference.</Text>
            <TextInput placeholder="john@email.com" placeholderTextColor={theme.colors.muted} style={styles.input} />
            <Button label="Subscribe" onPress={() => setFeedbackOpen(true)} />
          </View>
        </View>

        <Footer />
      </ScrollView>
      {feedbackOpen ? (
        <FeedbackModal
          email={email}
          message={feedback}
          notice={notice}
          onClose={() => setFeedbackOpen(false)}
          onEmailChange={setEmail}
          onMessageChange={setFeedback}
          onSubmit={submitFeedback}
        />
      ) : null}
    </Screen>
  );
}

function ActionTile({
  dark = false,
  imageKey,
  label,
  onPress,
  title,
}: {
  dark?: boolean;
  imageKey?: keyof typeof imageAssets;
  label: string;
  onPress: () => void;
  title: string;
}) {
  return (
    <View style={[styles.actionTile, dark ? styles.actionTileDark : null]}>
      {imageKey ? <Image resizeMode="cover" source={imageAssets[imageKey]} style={styles.actionImage} /> : null}
      <Text style={[styles.actionTitle, dark ? styles.actionTitleDark : null]}>{title}</Text>
      <Button label={label} onPress={onPress} variant={dark ? 'dark' : 'lime'} />
    </View>
  );
}

const styles = StyleSheet.create({
  actionTile: {
    backgroundColor: theme.colors.appAlt,
    borderRadius: theme.radii.sm,
    gap: theme.spacing.md,
    overflow: 'hidden',
    padding: theme.spacing.md,
  },
  actionTileDark: {
    backgroundColor: theme.colors.charcoal,
  },
  actionTitle: {
    ...theme.typography.h2,
    color: theme.colors.ink,
  },
  actionImage: {
    borderRadius: theme.radii.xs,
    height: 128,
    marginHorizontal: -theme.spacing.xs,
    width: '100%',
  },
  actionTitleDark: {
    color: theme.colors.white,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.ink,
  },
  brandLogo: {
    alignItems: 'center',
    backgroundColor: theme.colors.paper,
    borderRadius: theme.radii.xs,
    height: 52,
    justifyContent: 'center',
    width: '47%',
  },
  brandRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  brandText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    textAlign: 'center',
  },
  content: {
    gap: theme.spacing.lg,
    padding: theme.spacing.md,
    paddingBottom: 0,
  },
  infoCard: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  infoTitle: {
    ...theme.typography.body,
    color: theme.colors.ink,
    fontWeight: '700',
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    color: theme.colors.ink,
    minHeight: 42,
    paddingHorizontal: theme.spacing.md,
  },
  liveBadge: {
    backgroundColor: theme.colors.lime,
    borderRadius: theme.radii.xs,
    left: 136,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    position: 'absolute',
    top: 68,
  },
  liveBadgeText: {
    ...theme.typography.button,
    color: theme.colors.ink,
  },
  liveCard: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.radii.sm,
    gap: theme.spacing.md,
    overflow: 'hidden',
    paddingBottom: theme.spacing.md,
  },
  liveImage: {
    height: 118,
    width: '100%',
  },
  muted: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  newsBox: {
    backgroundColor: 'rgba(58,57,52,0.82)',
    borderRadius: theme.radii.sm,
    bottom: 30,
    gap: theme.spacing.md,
    left: 36,
    padding: theme.spacing.lg,
    position: 'absolute',
    right: 36,
  },
  newsImage: {
    height: 260,
    width: '100%',
  },
  newsletter: {
    marginHorizontal: -theme.spacing.md,
  },
  newsTitle: {
    ...theme.typography.h2,
    color: theme.colors.white,
  },
  partnerCard: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    padding: theme.spacing.md,
    width: '30%',
  },
  qr: {
    alignSelf: 'center',
    borderRadius: theme.radii.sm,
    height: 190,
    width: 190,
  },
  reviewCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.sm,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    width: 152,
  },
  reviewImage: {
    borderRadius: theme.radii.xs,
    height: 108,
    width: '100%',
  },
  reviewRail: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.lg,
  },
  roomTab: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.radii.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  roomTabs: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    marginTop: -theme.spacing.xl,
  },
  roomText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
  },
  stackCards: {
    gap: theme.spacing.md,
  },
  stars: {
    color: theme.colors.limeDark,
    letterSpacing: 0,
  },
  videoRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  videoText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    zIndex: 1,
  },
  videoTile: {
    backgroundColor: '#D4D4D4',
    borderRadius: theme.radii.sm,
    height: 118,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    padding: theme.spacing.sm,
    width: 72,
  },
  videoImage: {
    bottom: 0,
    left: 0,
    opacity: 0.58,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
