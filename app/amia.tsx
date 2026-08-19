import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BuyamiaHeader, ProductList, Screen } from '../components';
import { filterProducts, getProductById, products } from '../data';
import { theme } from '../theme';

type Message = {
  id: string;
  author: 'Amia' | 'You';
  text: string;
};

const demoReply = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes('delivery') || lower.includes('next month')) {
    return 'Demo Amia: I noted delivery next month. These local suggestions prioritize contract-ready and quick-shipping products.';
  }
  if (lower.includes('hotel') || lower.includes('furniture')) {
    return 'Demo Amia: For a boutique hotel, I would start with bamboo tables, hand carved chairs and curated room packages.';
  }
  return 'Demo Amia: I can only search local demo data for now. A real AI/API can replace this service later.';
};

export default function AmiaScreen() {
  const params = useLocalSearchParams<{ product?: string }>();
  const product = typeof params.product === 'string' ? getProductById(params.product) : undefined;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      author: 'Amia',
      text: product
        ? `Hi there. I can help you compare ${product.name}. This is a local demo service.`
        : 'Hi there. I am Amia. Powered by Buyamia. How can I help?',
    },
  ]);
  const [precision, setPrecision] = useState(false);

  const suggestions = useMemo(() => {
    const query = messages[messages.length - 1]?.text ?? '';
    return filterProducts({ query: product?.name ?? query }).slice(0, 3);
  }, [messages, product]);

  const send = (text = input) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { id: `you-${Date.now()}`, author: 'You', text: clean },
      { id: `amia-${Date.now()}`, author: 'Amia', text: demoReply(clean) },
    ]);
    setInput('');
  };

  return (
    <Screen>
      <BuyamiaHeader />
      <View style={styles.promptBar}>
        <Text style={styles.promptText}>Tell us what you need. We'll find it.</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.suggestions}>
          {['Discover products', 'About Amia', 'Affiliate Program', 'Find fleet options', 'Search your ideal specs'].map((item) => (
            <Pressable key={item} onPress={() => send(item)} style={styles.suggestion}>
              <Text style={styles.suggestionText}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.chat}>
          {messages.map((message) => (
            <View key={message.id} style={[styles.bubble, message.author === 'You' ? styles.userBubble : null]}>
              <Text style={styles.author}>{message.author}</Text>
              <Text style={styles.message}>{message.text}</Text>
            </View>
          ))}
        </View>
        <ProductList products={suggestions.length ? suggestions : products.slice(0, 3)} />
        {precision ? (
          <View style={styles.bubble}>
            <Text style={styles.message}>I would also prefer delivery within the next month.</Text>
          </View>
        ) : (
          <Pressable onPress={() => { setPrecision(true); send('I would also prefer delivery within the next month.'); }} style={styles.precision}>
            <Text style={styles.message}>Add delivery preference for next month</Text>
          </Pressable>
        )}
      </ScrollView>
      <View style={styles.composer}>
        <TextInput
          multiline
          onChangeText={setInput}
          placeholder="Ask a question..."
          placeholderTextColor={theme.colors.muted}
          style={styles.input}
          value={input}
        />
        <Pressable onPress={() => send()} style={styles.send}>
          <Text style={styles.sendText}>↑</Text>
        </Pressable>
      </View>
      <Text style={styles.disclaimer}>By chatting with Amia, you are using a local demo service. Backend and LLM integration are not connected yet.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  author: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  bubble: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.radii.sm,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  chat: {
    gap: theme.spacing.sm,
  },
  composer: {
    alignItems: 'flex-end',
    backgroundColor: theme.colors.app,
    borderTopColor: theme.colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  content: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  disclaimer: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    paddingBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    textAlign: 'center',
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    color: theme.colors.ink,
    flex: 1,
    minHeight: 64,
    padding: theme.spacing.md,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.ink,
  },
  precision: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    padding: theme.spacing.md,
  },
  promptBar: {
    backgroundColor: theme.colors.appAlt,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  promptText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
    textAlign: 'center',
  },
  send: {
    alignItems: 'center',
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.radii.xs,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  sendText: {
    color: theme.colors.lime,
    fontSize: 16,
  },
  suggestion: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.radii.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  suggestionText: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  userBubble: {
    backgroundColor: theme.colors.white,
    marginLeft: theme.spacing.xl,
  },
});
