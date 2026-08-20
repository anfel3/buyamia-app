import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, BuyamiaHeader, Screen } from '../components';
import { communityMessages } from '../data';
import { theme } from '../theme';

export default function CommunityScreen() {
  const router = useRouter();

  return (
    <Screen>
      <BuyamiaHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Button label="Community Chat" onPress={() => undefined} variant="light" />
        {communityMessages.map((message) => (
          <View key={message.id} style={styles.messageCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{message.avatar}</Text>
            </View>
            <View style={styles.messageBody}>
              <Text style={styles.author}>{message.author}</Text>
              <Text style={styles.message}>{message.message}</Text>
            </View>
          </View>
        ))}
        <View style={styles.locked}>
          <Text style={styles.muted}>To chat, please</Text>
          <View style={styles.actions}>
            <Button label="Log In" onPress={() => router.push('/auth/sign-in')} variant="light" />
            <Button label="Sign Up" onPress={() => router.push('/auth/sign-up')} variant="light" />
          </View>
        </View>
        <TextInput
          editable={false}
          placeholder="Write your message..."
          placeholderTextColor={theme.colors.muted}
          style={styles.input}
        />
        <Text style={styles.disclaimer}>Community posting is paused in this local prototype.</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  author: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.sand,
    borderRadius: theme.radii.xs,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  avatarText: {
    ...theme.typography.button,
    color: theme.colors.ink,
  },
  content: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  disclaimer: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    color: theme.colors.ink,
    minHeight: 86,
    padding: theme.spacing.md,
  },
  locked: {
    alignItems: 'center',
    backgroundColor: theme.colors.appAlt,
    borderRadius: theme.radii.md,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.ink,
  },
  messageBody: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  messageCard: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  muted: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
});
