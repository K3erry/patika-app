import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator, RefreshControl, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/lib/api';
import BusinessCard from '@/components/BusinessCard';

export default function DiscoverScreen() {
  const router = useRouter();

  const [businesses, setBusinesses]   = useState([]);
  const [categories, setCategories]   = useState([]);
  const [selected, setSelected]       = useState(null);  // selected category id
  const [city, setCity]               = useState('');
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);

  // -----------------------------------------------
  // Fetch categories on mount — used for the
  // horizontal filter bar at the top.
  // -----------------------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get('/categories');
        setCategories([{ id: null, name: 'All', icon: '🌍' }, ...data.categories]);
      } catch (err) {
        console.error('Failed to load categories:', err.message);
      }
    };
    fetchCategories();
  }, []);

  // -----------------------------------------------
  // Fetch businesses — re-runs when filters change.
  // -----------------------------------------------
  const fetchBusinesses = useCallback(async (reset = false) => {
    const currentPage = reset ? 1 : page;
    try {
      let path = `/businesses?page=${currentPage}&limit=20`;
      if (selected) path += `&category=${selected}`;
      if (city)     path += `&city=${city}`;

      const data = await api.get(path);

      setBusinesses((prev) =>
        reset ? data.businesses : [...prev, ...data.businesses]
      );
      setHasMore(data.businesses.length === 20);
      if (reset) setPage(1);
    } catch (err) {
      console.error('Failed to load businesses:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selected, city, page]);

  useEffect(() => {
    setLoading(true);
    fetchBusinesses(true);
  }, [selected, city]);

  // Pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchBusinesses(true);
  };

  // Load more when user scrolls to bottom
  const loadMore = () => {
    if (!hasMore || loading) return;
    setPage((prev) => prev + 1);
    fetchBusinesses();
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-dark text-2xl font-bold">Discover Businesses</Text>
        <Text className="text-muted text-sm">Find trusted businesses near you</Text>
      </View>

      {/* City search bar */}
      <View className="px-4 mb-3">
        <View className="bg-white border border-border rounded-xl px-3 py-3 flex-row items-center">
          <Text className="mr-2">📍</Text>
          <TextInput
            placeholder="Filter by city (e.g. Nairobi)"
            placeholderTextColor="#73726C"
            className="flex-1 text-dark text-sm"
            value={city}
            onChangeText={setCity}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Category filter pills - horizontal scroll */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
        renderItem={({ item }) => {
          const isActive = selected === item.id;
          return (
            <TouchableOpacity
              onPress={() => setSelected(item.id)}
              className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
                isActive ? 'bg-primary border-primary' : 'bg-white border-border'
              }`}
            >
              <Text className="mr-1">{item.icon}</Text>
              <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-dark'}`}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Business list */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F6E56" />
          <Text className="text-muted text-sm mt-3">Loading businesses...</Text>
        </View>
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0F6E56" />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-4xl mb-3">🔍</Text>
              <Text className="text-dark font-semibold text-base">No businesses found</Text>
              <Text className="text-muted text-sm mt-1">Try a different city or category</Text>
            </View>
          }
          ListFooterComponent={
            hasMore && !loading ? (
              <ActivityIndicator size="small" color="#0F6E56" style={{ marginVertical: 16 }} />
            ) : null
          }
          renderItem={({ item }) => (
            <BusinessCard
              business={item}
              onPress={() => router.push(`/business/${item.slug}`)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
