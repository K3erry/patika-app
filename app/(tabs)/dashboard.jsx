import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [biz, setBiz]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const data = await api.get('/businesses/me');
        setBiz(data.business);
      } catch {
        // User doesn't have a business yet
        setBiz(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#0F6E56" />
      </View>
    );
  }

  // -----------------------------------------------
  // No business yet — prompt to create one
  // -----------------------------------------------
  if (!biz) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl mb-4">🏪</Text>
          <Text className="text-dark text-2xl font-bold text-center mb-2">
            List your business
          </Text>
          <Text className="text-muted text-sm text-center mb-8 leading-relaxed">
            Create your free business profile and start getting discovered by customers in your city.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/create-business')}
            className="bg-primary rounded-2xl py-4 px-8 w-full items-center"
          >
            <Text className="text-white font-bold text-base">Create Business Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // -----------------------------------------------
  // Business exists — show the owner dashboard
  // -----------------------------------------------
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-10">
          {/* Header */}
          <Text className="text-dark text-2xl font-bold mb-1">My Business</Text>
          <Text className="text-muted text-sm mb-4">{biz.name}</Text>

          {/* Plan badge */}
          <View className={`self-start px-3 py-1 rounded-full mb-6 ${biz.plan === 'pro' ? 'bg-accent/20' : 'bg-border'}`}>
            <Text className={`text-xs font-semibold ${biz.plan === 'pro' ? 'text-accent' : 'text-muted'}`}>
              {biz.plan === 'pro' ? '⭐ Pro Plan' : '🆓 Free Plan'}
            </Text>
          </View>

          {/* Quick stats */}
          <View className="flex-row gap-3 mb-6">
            {[
              { label: 'Services',  value: biz.services?.length || 0, emoji: '📋' },
              { label: 'Photos',    value: biz.photos?.length    || 0, emoji: '📷' },
              { label: 'Reviews',   value: biz.reviews?.length   || 0, emoji: '⭐' },
            ].map((stat) => (
              <View key={stat.label} className="flex-1 bg-white border border-border rounded-xl px-3 py-3 items-center">
                <Text className="text-xl mb-1">{stat.emoji}</Text>
                <Text className="text-dark text-lg font-bold">{stat.value}</Text>
                <Text className="text-muted text-xs">{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Action menu */}
          <Text className="text-dark font-semibold text-sm mb-3 uppercase tracking-wide">Manage</Text>
          {[
            { label: 'Edit Profile',      emoji: '✏️',  route: '/edit-business'    },
            { label: 'Manage Services',   emoji: '📋',  route: '/manage-services'  },
            { label: 'Manage Photos',     emoji: '📷',  route: '/manage-photos'    },
            { label: 'View Public Page',  emoji: '👁️',  route: `/business/${biz.slug}` },
            { label: 'Boost Visibility',  emoji: '🚀',  route: '/boost'            },
            { label: 'Upgrade to Pro',    emoji: '⭐',  route: '/upgrade',  hide: biz.plan === 'pro' },
          ]
            .filter((item) => !item.hide)
            .map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => router.push(item.route)}
                className="bg-white border border-border rounded-xl px-4 py-4 flex-row items-center justify-between mb-2"
              >
                <View className="flex-row items-center">
                  <Text className="text-xl mr-3">{item.emoji}</Text>
                  <Text className="text-dark font-medium">{item.label}</Text>
                </View>
                <Text className="text-muted">›</Text>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
