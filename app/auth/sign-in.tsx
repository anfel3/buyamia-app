import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, BuyamiaHeader, Screen } from '../../components';
import { useAuth } from '../../providers/AuthProvider';
import { firstInvalid, validateEmail, validateRequired } from '../../services/domain/validation';
import { theme } from '../../theme';

export default function SignInScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { error, signIn, signOut, submitting, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  const submit = async () => {
    if (submitting) {
      return;
    }

    const invalid = firstInvalid(
      validateEmail(email),
      validateRequired(password, 'Please enter your password.'),
    );

    if (invalid) {
      setNotice(invalid.message ?? 'Please check the form.');
      return;
    }

    setNotice('');

    try {
      await signIn({ email: email.trim(), password }, typeof redirect === 'string' ? redirect : undefined);
    } catch {
      // The provider exposes the local auth error and leaves user null.
    }
  };

  if (user) {
    return (
      <Screen>
        <BuyamiaHeader />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.title}>Account</Text>
            <Text style={styles.body}>Signed in as {user.name} ({user.email}).</Text>
            {error ? <Text style={styles.notice}>{error}</Text> : null}
            <Button disabled={submitting} label={submitting ? 'Logging out...' : 'Log Out'} onPress={() => void signOut()} />
          </View>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <BuyamiaHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Log In</Text>
          <Text style={styles.body}>Use a local demo account stored on this device.</Text>
          <TextInput
            autoCapitalize="none"
            inputMode="email"
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.colors.muted}
            style={styles.input}
            value={email}
          />
          <TextInput
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={theme.colors.muted}
            secureTextEntry
            style={styles.input}
            value={password}
          />
          {notice || error ? <Text style={styles.notice}>{notice || error}</Text> : null}
          <Button
            disabled={submitting}
            label={submitting ? 'Logging in...' : 'Log In'}
            onPress={() => void submit()}
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
