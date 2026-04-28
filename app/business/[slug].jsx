import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, Linking, Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api from '@/lib/api';

export default function BusinessProfileScreen() {
  const { slug }        = useLocalSearchParams();
  const [biz, setBiz]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]   = useState('services'); // 'services' | 'reviews'

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.get(`/businesses/${slug}`);
        setBiz(data.business);
        // Record a profile view event (fire and forget — don't await)
        api.post('/analytics/events', { business_id: data.business.id, event_type: 'profile_view', source: 'discover' });
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  // Open WhatsApp with a pre-filled message
  const openWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I found your business "${biz.name}" on Patika. I'd like to enquire about your services.`);
    const url = `https://wa.me/${biz.whatsapp?.replace(/\D/g, '')}?text=${message}`;
    Linking.openURL(url).catch(() => Alert.alert('WhatsApp not installed'));
    api.post('/analytics/events', { business_id: biz.id, event_type: 'whatsapp_click', source: 'profile' });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#0F6E56" />
      </View>
    );
  }

  if (!biz) return null;

  const coverPhoto = biz.photos?.find((p) => p.is_cover) || biz.photos?.[0];
  const avgRating  = biz.reviews?.length
    ? (biz.reviews.reduce((s, r) => s + r.rating, 0) / biz.reviews.length).toFixed(1)
    : null;

  return (
    <ScrollView className="flex-1 bg-surface" showsVerticalScrollIndicator={false}>
      {/* Cover photo */}
      <View className="w-full h-56 bg-gray-200">
        {coverPhoto ? (
          <Image source={{ uri: coverPhoto.url }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full items-center justify-center bg-primary/10">
            <Text className="text-5xl">🏪</Text>
          </View>
        )}
      </View>

      <View className="px-4 pt-4 pb-10">
        {/* Business name + badges */}
        <View className="flex-row items-start justify-between mb-1">
          <Text className="text-dark text-2xl font-bold flex-1 mr-2">{biz.name}</Text>
          {biz.is_verified && (
            <View className="bg-primary/10 px-2 py-1 rounded-full">
              <Text className="text-primary text-xs font-medium">✓ Verified</Text>
            </View>
          )}
        </View>

        {/* Category + city */}
        <Text className="text-muted text-sm mb-2">
          {biz.categories?.icon} {biz.categories?.name}  ·  📍 {biz.city}
        </Text>

        {/* Rating */}
        {avgRating && (
          <View className="flex-row items-center mb-4">
            <Text className="text-accent font-bold mr-1">★ {avgRating}</Text>
            <Text className="text-muted text-sm">({biz.reviews.length} reviews)</Text>
          </View>
        )}

        {/* Description */}
        {biz.description && (
          <Text className="text-dark text-sm leading-relaxed mb-5">{biz.description}</Text>
        )}

        {/* Contact buttons */}
        <View className="flex-row gap-3 mb-6">
          {biz.whatsapp && (
            <TouchableOpacity
              onPress={openWhatsApp}
              className="flex-1 bg-primary rounded-xl py-3 items-center flex-row justify-center"
            >
              <Text className="text-white font-semibold mr-2">💬</Text>
              <Text className="text-white font-semibold">WhatsApp</Text>
            </TouchableOpacity>
          )}
          {biz.phone && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${biz.phone}`)}
              className="flex-1 bg-white border border-border rounded-xl py-3 items-center flex-row justify-center"
            >
              <Text className="text-dark font-semibold mr-2">📞</Text>
              <Text className="text-dark font-semibold">Call</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab switcher: Services / Reviews */}
        <View className="flex-row bg-white border border-border rounded-xl overflow-hidden mb-4">
          {['services', 'reviews'].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              className={`flex-1 py-3 items-center ${tab === t ? 'bg-primary' : 'bg-white'}`}
            >
              <Text className={`text-sm font-semibold capitalize ${tab === t ? 'text-white' : 'text-muted'}`}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Services tab */}
        {tab === 'services' && (
          <View>
            {biz.services?.length ? biz.services.map((service) => (
              <View key={service.id} className="bg-white border border-border rounded-xl px-4 py-3 mb-3">
                <Text className="text-dark font-semibold mb-1">{service.name}</Text>
                {service.description && (
                  <Text className="text-muted text-sm mb-2">{service.description}</Text>
                )}
                {service.price && (
                  <Text className="text-primary font-bold">
                    {service.currency} {Number(service.price).toLocaleString()}
                  </Text>
                )}
              </View>
            )) : (
              <Text className="text-muted text-sm text-center py-6">No services listed yet.</Text>
            )}
          </View>
        )}

        {/* Reviews tab */}
        {tab === 'reviews' && (
          <View>
            {biz.reviews?.length ? biz.reviews.map((review) => (
              <View key={review.id} className="bg-white border border-border rounded-xl px-4 py-3 mb-3">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-dark font-semibold">{review.reviewer_name}</Text>
                  <Text className="text-accent font-bold">{'★'.repeat(review.rating)}</Text>
                </View>
                {review.comment && (
                  <Text className="text-muted text-sm">{review.comment}</Text>
                )}
              </View>
            )) : (
              <Text className="text-muted text-sm text-center py-6">No reviews yet.</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
