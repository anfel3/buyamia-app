import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BuyamiaHeader, FilterPanel, ProductList, Screen } from '../components';
import type { FilterState } from '../components';
import { categories, filterProducts } from '../data';
import { theme } from '../theme';

const emptyFilters: FilterState = {
  colors: [],
  moods: [],
  styles: [],
};

export default function SearchScreen() {
  const params = useLocalSearchParams<{ category?: string; filters?: string; query?: string }>();
  const [query, setQuery] = useState(typeof params.query === 'string' ? params.query : '');
  const [category, setCategory] = useState(typeof params.category === 'string' ? params.category : '');
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [applied, setApplied] = useState<FilterState>(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(params.filters === '1');

  const results = useMemo(
    () =>
      filterProducts({
        category: category || undefined,
        colors: applied.colors,
        maxPrice: applied.maxPrice,
        minPrice: applied.minPrice,
        moods: applied.moods,
        query,
        room: applied.room,
        styles: applied.styles,
      }),
    [applied, category, query],
  );

  if (filterOpen) {
    return (
      <Screen>
        <FilterPanel
          filters={filters}
          onApply={() => {
            setApplied(filters);
            setFilterOpen(false);
          }}
          onChange={setFilters}
          onClose={() => setFilterOpen(false)}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <BuyamiaHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchBar}>
          <TextInput
            onChangeText={setQuery}
            placeholder="Search products, rooms or sourcing needs"
            placeholderTextColor={theme.colors.muted}
            style={styles.input}
            value={query}
          />
          <Pressable onPress={() => setFilterOpen(true)} style={styles.filterButton}>
            <Text style={styles.filterText}>Filters</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRail}>
          <Pressable onPress={() => setCategory('')} style={[styles.chip, !category ? styles.chipActive : null]}>
            <Text style={styles.chipText}>All</Text>
          </Pressable>
          {categories.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setCategory(item.id)}
              style={[styles.chip, category === item.id ? styles.chipActive : null]}
            >
              <Text style={styles.chipText}>{item.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.resultText}>{results.length} results</Text>
        <ProductList products={results} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  categoryRail: {
    gap: theme.spacing.sm,
  },
  chip: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  chipActive: {
    backgroundColor: theme.colors.lime,
  },
  chipText: {
    ...theme.typography.caption,
    color: theme.colors.ink,
  },
  content: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.charcoal,
    borderRadius: theme.radii.xs,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  filterText: {
    ...theme.typography.button,
    color: theme.colors.white,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: StyleSheet.hairlineWidth,
    color: theme.colors.ink,
    flex: 1,
    height: 36,
    paddingHorizontal: theme.spacing.md,
  },
  resultText: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  searchBar: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
});
