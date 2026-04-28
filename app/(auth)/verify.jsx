import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

export default function VerifyScreen() {
  const { phone }    = useLocalSearchParams(); // phone passed from the phone screen
  const router       = useRouter();
  const { login }    = useAuth();

  // 6 separate state values — one per OTP digit
  const [otp, setOtp]         = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  // Refs for each input box so we can auto-focus the next one
  const inputs = useRef([]);

  // -----------------------------------------------
  // handleChange — called when the user types in
  // any of the 6 OTP input boxes.
  // Automatically moves focus to the next box.
  // -----------------------------------------------
  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus forward when a digit is entered
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are filled
    if (index === 5 && value) {
      const fullOtp = [...newOtp].join('');
      if (fullOtp.length === 6) verifyOtp(fullOtp);
    }
  };

  // -----------------------------------------------
  // handleBackspace — moves focus back when the
  // user deletes a digit.
  // -----------------------------------------------
  const handleBackspace = (value, index) => {
    if (!value && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // -----------------------------------------------
  // verifyOtp — calls POST /auth/verify-otp
  // On success, saves the tokens and logs the user in.
  // -----------------------------------------------
  const verifyOtp = async (code) => {
    const otpCode = code || otp.join('');
    if (otpCode.length < 6) {
      Alert.alert('Incomplete code', 'Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.post('/auth/verify-otp', { phone, token: otpCode });
      await login(data); // saves tokens + sets user in context
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Invalid code', err.message);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 px-6 pt-16">
        {/* Header */}
        <Text className="text-dark text-3xl font-bold mb-2">Enter the code</Text>
        <Text className="text-muted text-sm mb-10">
          We sent a 6-digit code to {phone}
        </Text>

        {/* 6-digit OTP input boxes */}
        <View className="flex-row justify-between mb-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              className="w-12 h-14 bg-white border border-border rounded-xl text-center text-dark text-xl font-bold"
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(val) => handleChange(val, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') handleBackspace(digit, index);
              }}
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Verify button */}
        <TouchableOpacity
          onPress={() => verifyOtp()}
          disabled={loading}
          className={`rounded-2xl py-4 items-center mb-4 ${loading ? 'bg-secondary/50' : 'bg-primary'}`}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text className="text-white font-bold text-base">Verify & Continue</Text>
          }
        </TouchableOpacity>

        {/* Resend code */}
        <TouchableOpacity
          className="items-center py-2"
          onPress={() => router.back()}
        >
          <Text className="text-secondary text-sm">Didn't get a code? Go back and resend</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
