import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Top section — branding */}
      <View className="flex-1 items-center justify-center px-8">
        {/* Logo placeholder — replace with your actual logo image */}
        <View className="w-20 h-20 bg-white rounded-2xl items-center justify-center mb-6">
          <Text className="text-4xl">🌍</Text>
        </View>

        <Text className="text-white text-4xl font-bold mb-2">Patika</Text>
        <Text className="text-white/80 text-lg text-center leading-relaxed">
          Get found by customers in your city.{'\n'}Grow your business across Africa.
        </Text>
      </View>

      {/* Bottom section — value props + CTA */}
      <View className="px-6 pb-10">
        {/* Three value props */}
        {[
          { icon: '🏪', text: 'Create your free business profile in minutes' },
          { icon: '📍', text: 'Get discovered by local customers near you'   },
          { icon: '⭐', text: 'Collect reviews and build your reputation'    },
        ].map((item) => (
          <View key={item.text} className="flex-row items-center mb-4">
            <Text className="text-2xl mr-3">{item.icon}</Text>
            <Text className="text-white/90 text-sm flex-1">{item.text}</Text>
          </View>
        ))}

        {/* Get Started button */}
        <TouchableOpacity
          onPress={() => router.push('/(auth)/phone')}
          className="bg-white rounded-2xl py-4 items-center mt-4 mb-3"
        >
          <Text className="text-primary font-bold text-base">Get Started — It's Free</Text>
        </TouchableOpacity>

        {/* Already have an account */}
        <TouchableOpacity
          onPress={() => router.push('/(auth)/phone')}
          className="items-center py-2"
        >
          <Text className="text-white/70 text-sm">Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
