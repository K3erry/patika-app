import { useState } from 'react';
import {
  View, Text, TextInput, FlatList,
  SafeAreaView, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/lib/api';
import BusinessCard from '@/components/BusinessCard';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [searched, setSearched]   = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.get(`/businesses?search=${query.trim()}`);
      setResults(data.businesses);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-dark text-2xl font-bold mb-4">Search</Text>

        {/* Search bar */}
        <View className="flex-row items-center bg-white border border-border rounded-xl px-3 py-3 mb-4">
          <Text className="mr-2 text-base">🔍</Text>
          <TextInput
            className="flex-1 text-dark text-sm"
            placeholder="Search businesses by name..."
            placeholderTextColor="#73726C"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={search}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
              <Text className="text-muted text-sm">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F6E56" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ListEmptyComponent={
            searched ? (
              <View className="items-center py-16">
                <Text className="text-4xl mb-3">😕</Text>
                <Text className="text-dark font-semibold">No results for "{query}"</Text>
                <Text className="text-muted text-sm mt-1">Try a different name or city</Text>
              </View>
            ) : (
              <View className="items-center py-16">
                <Text className="text-4xl mb-3">🔍</Text>
                <Text className="text-muted text-sm">Type a business name to search</Text>
              </View>
            )
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
