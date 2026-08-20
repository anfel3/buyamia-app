import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, BuyamiaHeader, Screen } from '../../components';
import { useAuth } from '../../providers/AuthProvider';
import { firstInvalid, validateEmail, validatePassword, validateRequired } from '../../services/domain/validation';
import { theme } from '../../theme';

export default function SignUpScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { error, signUp, submitting } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [notice, setNotice] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const submit = async () => {
    if (submitting) {
      return;
    }

    const invalid = firstInvalid(
      validateRequired(name, 'Please enter your name.'),
      validateEmail(email),
      validatePassword(password),
      validateRequired(passwordConfirmation, 'Please confirm your password.'),
    );

    if (invalid) {
      setNotice(invalid.message ?? 'Please check the form.');
      return;
    }

    if (password !== passwordConfirmation) {
      setNotice('Passwords do not match.');
      return;
    }

    setNotice('');

    try {
      await signUp(
        {
          email: email.trim(),
          name: name.trim(),
          password,
          passwordConfirmation,
          role: 'viewer',
        },
        typeof redirect === 'string' ? redirect : undefined,
      );
    } catch {
      // The provider exposes the local auth error and does not create a session.
    }
  };

  return (
    <Screen>
      <BuyamiaHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.body}>Create a local demo account stored on this device.</Text>
          <TextInput
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={theme.colors.muted}
            style={styles.input}
            value={name}
          />
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
          <TextInput
            onChangeText={setPasswordConfirmation}
            placeholder="Confirm password"
            placeholderTextColor={theme.colors.muted}
            secureTextEntry
            style={styles.input}
            value={passwordConfirmation}
          />
          {notice || error ? <Text style={styles.notice}>{notice || error}</Text> : null}
          <Button
            disabled={submitting}
            label={submitting ? 'Creating...' : 'Create Account'}
            onPress={() => void submit()}
          />
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
