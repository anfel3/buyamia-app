import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, BuyamiaHeader, Screen } from '../../components';
import { theme } from '../../theme';

export default function SignUpScreen() {
  const router = useRouter();
  const [notice, setNotice] = useState('');

  return (
    <Screen>
      <BuyamiaHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.body}>Create-account backend is planned for a later phase. No account is created here.</Text>
          <TextInput placeholder="Name" placeholderTextColor={theme.colors.muted} style={styles.input} />
          <TextInput autoCapitalize="none" inputMode="email" placeholder="Email" placeholderTextColor={theme.colors.muted} style={styles.input} />
          <TextInput placeholder="Password" placeholderTextColor={theme.colors.muted} secureTextEntry style={styles.input} />
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
          <Button label="Create Account" onPress={() => setNotice('Demo mode: registration is not connected to a backend.')} />
          <Button label="Already have an account" onPress={() => router.push('/auth/sign-in')} variant="light" />
        </View>
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
    borderRadius: theme.radii.md,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    color: theme.colors.ink,
    minHeight: 44,
    paddingHorizontal: theme.spacing.md,
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
