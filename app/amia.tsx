import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BuyamiaHeader, ProductList, Screen } from '../components';
import { getProductById } from '../data';
import { useAuth } from '../providers/AuthProvider';
import {
  clearAmiaMemory,
  createAmiaReply,
  createEmptyAmiaMemory,
  readAmiaMemory,
  writeAmiaMemory,
} from '../services/amia';
import type { AmiaMemory, AmiaMessage } from '../services/amia';
import { theme } from '../theme';

const newMessage = (author: AmiaMessage['author'], text: string): AmiaMessage => ({
  author,
  id: `${author.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  text,
});

const welcomeMessage = (productName?: string): AmiaMessage => ({
  id: 'welcome',
  author: 'Amia',
  text: productName
    ? `Hi there. I can help you compare ${productName}. Amia is Buyamia's local smart shopping assistant.`
    : "Hi there. I am Amia, Buyamia's local smart shopping assistant. What are you shopping for?",
});

export default function AmiaScreen() {
  const params = useLocalSearchParams<{ product?: string }>();
  const product = typeof params.product === 'string' ? getProductById(params.product) : undefined;
  const { user } = useAuth();
  const scrollRef = useRef<ScrollView | null>(null);
  const [input, setInput] = useState('');
  const [memory, setMemory] = useState<AmiaMemory>(() => createEmptyAmiaMemory());
  const [messages, setMessages] = useState<AmiaMessage[]>(() => [welcomeMessage(product?.name)]);
  const [processing, setProcessing] = useState(false);
  const [quickSuggestions, setQuickSuggestions] = useState(['Discover bamboo furniture', 'Under 2 million IDR', 'Living room']);
  const userId = user?.id ?? null;

  useEffect(() => {
    let active = true;

    void readAmiaMemory(userId).then((storedMemory) => {
      if (!active) {
        return;
      }

      const hasStoredMessages = storedMemory.lastMessages.length > 0;
      const initialMessages = hasStoredMessages ? storedMemory.lastMessages : [welcomeMessage(product?.name)];
      const initialProductIds = hasStoredMessages
        ? storedMemory.recentRecommendedProductIds
        : product
          ? [product.id]
          : [];

      setMemory({ ...storedMemory, recentRecommendedProductIds: initialProductIds });
      setMessages(initialMessages);
    });

    return () => {
      active = false;
    };
  }, [product, userId]);

  const displayedProducts = useMemo(
    () => memory.recentRecommendedProductIds.map((id) => getProductById(id)).filter((item) => item !== undefined),
    [memory.recentRecommendedProductIds],
  );

  const send = useCallback(async (text = input) => {
    const clean = text.trim();
    if (!clean || processing) return;

    setProcessing(true);
    setInput('');

    const userMessage = newMessage('You', clean);
    const reply = createAmiaReply(clean, {
      currentIntent: memory.currentIntent,
      recentRecommendedProductIds: memory.recentRecommendedProductIds,
      turnCount: memory.lastMessages.length,
    });
    const amiaMessage = newMessage('Amia', reply.text);
    const nextMessages = [...messages, userMessage, amiaMessage].slice(-20);
    const nextMemory: AmiaMemory = {
      ...memory,
      currentIntent: reply.intent,
      lastMessages: nextMessages,
      recentRecommendedProductIds: reply.productIds.length ? reply.productIds : memory.recentRecommendedProductIds,
    };

    setMessages(nextMessages);
    setMemory(nextMemory);
    setQuickSuggestions(reply.suggestions);

    try {
      setMemory(await writeAmiaMemory(userId, nextMemory));
    } finally {
      setProcessing(false);
    }
  }, [input, memory, messages, processing, userId]);

  const clearConversation = useCallback(async () => {
    const emptyMemory = await clearAmiaMemory(userId);
    const initialMemory = {
      ...emptyMemory,
      recentRecommendedProductIds: product ? [product.id] : [],
    };

    setMemory(initialMemory);
    setMessages([welcomeMessage(product?.name)]);
    setQuickSuggestions(['Discover bamboo furniture', 'Under 2 million IDR', 'Living room']);
  }, [product, userId]);

  return (
    <Screen>
      <BuyamiaHeader />
      <View style={styles.promptBar}>
        <Text style={styles.promptText}>Amia is Buyamia's local smart shopping assistant.</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chatHeader}>
          <Text style={styles.localNote}>Local catalog search. No external shopping service is connected.</Text>
          <Pressable onPress={clearConversation} style={styles.clearButton}>
            <Text style={styles.clearText}>New conversation</Text>
          </Pressable>
        </View>
        <View style={styles.suggestions}>
          {quickSuggestions.map((item) => (
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
          {processing ? (
            <View style={styles.bubble}>
              <Text style={styles.author}>Amia</Text>
              <Text style={styles.message}>Checking the local Buyamia catalog...</Text>
            </View>
          ) : null}
        </View>
        {displayedProducts.length ? <ProductList products={displayedProducts} /> : (
          <View style={styles.emptyState}>
            <Text style={styles.message}>Ask for a product, room, material, style or budget to see catalog matches.</Text>
          </View>
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
        <Pressable disabled={processing} onPress={() => send()} style={[styles.send, processing ? styles.sendDisabled : null]}>
          <Text style={styles.sendText}>↑</Text>
        </Pressable>
      </View>
      <Text style={styles.disclaimer}>Amia is Buyamia's local smart shopping assistant.</Text>
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
  chatHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  clearButton: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  clearText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
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
  emptyState: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    padding: theme.spacing.md,
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
  localNote: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    flex: 1,
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
  sendDisabled: {
    opacity: 0.5,
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
