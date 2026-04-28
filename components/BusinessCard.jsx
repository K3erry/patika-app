import { View, Text, Image, TouchableOpacity } from 'react-native';

// -----------------------------------------------
// BusinessCard
// Shown in the discovery feed list.
// Displays cover photo, name, category, city,
// rating summary, and plan badge.
//
// Props:
//   business — the business object from the API
//   onPress  — called when the card is tapped
// -----------------------------------------------
export default function BusinessCard({ business, onPress }) {
  const coverPhoto = business.photos?.find((p) => p.is_cover) || business.photos?.[0];
  const reviewCount = business.reviews?.length || 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white border border-border rounded-2xl mb-3 overflow-hidden"
      activeOpacity={0.85}
    >
      {/* Cover image */}
      <View className="w-full h-40 bg-gray-100">
        {coverPhoto ? (
          <Image
            source={{ uri: coverPhoto.url }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center bg-primary/10">
            <Text className="text-4xl">🏪</Text>
          </View>
        )}

        {/* Boost / Pro badge - top right */}
        {business.plan === 'pro' && (
          <View className="absolute top-2 right-2 bg-accent px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">⭐ Pro</Text>
          </View>
        )}
      </View>

      {/* Card body */}
      <View className="px-3 py-3">
        <Text className="text-dark font-bold text-base mb-0.5" numberOfLines={1}>
          {business.name}
        </Text>

        <View className="flex-row items-center mb-1">
          <Text className="text-muted text-xs">
            {business.categories?.icon} {business.categories?.name}
          </Text>
          <Text className="text-border mx-2">·</Text>
          <Text className="text-muted text-xs">📍 {business.city}</Text>
        </View>

        {reviewCount > 0 && (
          <Text className="text-accent text-xs font-medium">
            ★ {reviewCount} review{reviewCount !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
