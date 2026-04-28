import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/lib/api';

export default function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone]       = useState('');
  const [loading, setLoading]   = useState(false);

  // -----------------------------------------------
  // sendOtp — calls POST /auth/send-otp
  // On success, navigates to the verify screen
  // and passes the phone number as a param.
  // -----------------------------------------------
  const sendOtp = async () => {
    // Basic validation
    const cleaned = phone.trim().replace(/\s/g, '');
    if (!cleaned || cleaned.length < 9) {
      Alert.alert('Invalid number', 'Please enter a valid phone number with country code.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone: cleaned });
      // Navigate to the OTP verification screen, passing the phone number
      router.push({ pathname: '/(auth)/verify', params: { phone: cleaned } });
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-16">
          {/* Header */}
          <Text className="text-dark text-3xl font-bold mb-2">Enter your{'\n'}phone number</Text>
          <Text className="text-muted text-sm mb-10">
            We'll send a one-time code to verify your number.
          </Text>

          {/* Phone input */}
          <View className="bg-white border border-border rounded-2xl px-4 py-4 flex-row items-center mb-4">
            {/* Country code hint */}
            <Text className="text-muted text-base mr-2">📞</Text>
            <TextInput
              className="flex-1 text-dark text-base"
              placeholder="+254 712 345 678"
              placeholderTextColor="#73726C"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              autoFocus
              maxLength={15}
            />
          </View>

          <Text className="text-muted text-xs mb-10">
            Include your country code. Example: +254 for Kenya, +234 for Nigeria.
          </Text>

          {/* Send OTP button */}
          <TouchableOpacity
            onPress={sendOtp}
            disabled={loading}
            className={`rounded-2xl py-4 items-center ${loading ? 'bg-secondary/50' : 'bg-primary'}`}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text className="text-white font-bold text-base">Send Code</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
