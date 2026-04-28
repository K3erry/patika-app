import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '@/lib/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-4 pt-4 pb-10">
        <Text className="text-dark text-2xl font-bold mb-6">Profile</Text>

        {/* User card */}
        <View className="bg-white border border-border rounded-2xl px-4 py-5 mb-6 flex-row items-center">
          <View className="w-14 h-14 bg-primary/10 rounded-full items-center justify-center mr-4">
            <Text className="text-2xl">👤</Text>
          </View>
          <View>
            <Text className="text-dark font-bold text-base">
              {user?.user_metadata?.full_name || 'Patika User'}
            </Text>
            <Text className="text-muted text-sm">{user?.phone}</Text>
          </View>
        </View>

        {/* Menu items */}
        {[
          { label: 'Help & Support',    emoji: '💬' },
          { label: 'About Patika',      emoji: 'ℹ️' },
          { label: 'Privacy Policy',    emoji: '🔒' },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            className="bg-white border border-border rounded-xl px-4 py-4 flex-row items-center justify-between mb-2"
          >
            <View className="flex-row items-center">
              <Text className="text-xl mr-3">{item.emoji}</Text>
              <Text className="text-dark font-medium">{item.label}</Text>
            </View>
            <Text className="text-muted">›</Text>
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-4 flex-row items-center"
        >
          <Text className="text-xl mr-3">🚪</Text>
          <Text className="text-red-500 font-semibold">Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
