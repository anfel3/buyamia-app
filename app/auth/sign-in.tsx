import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, BuyamiaHeader, Screen } from '../../components';
import { theme } from '../../theme';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  return (
    <Screen>
      <BuyamiaHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Log In</Text>
          <Text style={styles.body}>Authentication is not connected yet. This form validates locally only.</Text>
          <TextInput autoCapitalize="none" inputMode="email" onChangeText={setEmail} placeholder="Email" placeholderTextColor={theme.colors.muted} style={styles.input} value={email} />
          <TextInput onChangeText={setPassword} placeholder="Password" placeholderTextColor={theme.colors.muted} secureTextEntry style={styles.input} value={password} />
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
          <Button
            label="Log In"
            onPress={() => setNotice(email.includes('@') && password ? 'Demo mode: no backend session was created.' : 'Enter email and password.')}
          />
          <Button label="Sign Up" onPress={() => router.push('/auth/sign-up')} variant="light" />
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
