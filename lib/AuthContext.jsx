import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '@/lib/api';

// -----------------------------------------------
// AuthContext
// Wraps the entire app and makes the current user
// available to any screen via useAuth().
//
// Usage in any screen:
//   const { user, login, logout, isLoading } = useAuth();
// -----------------------------------------------
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]         = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while checking stored token

  // -----------------------------------------------
  // On app launch — check if the user is already
  // logged in by looking for a saved access token.
  // -----------------------------------------------
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        if (token) {
          // Token exists — fetch the user profile to confirm it's still valid
          const data = await api.get('/users/me');
          setUser(data.user);
        }
      } catch {
        // Token expired or invalid — clear it and show login screen
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // -----------------------------------------------
  // login — called after OTP verification.
  // Saves the JWT tokens securely on the device.
  // -----------------------------------------------
  const login = async ({ user, access_token, refresh_token }) => {
    await SecureStore.setItemAsync('access_token', access_token);
    await SecureStore.setItemAsync('refresh_token', refresh_token);
    setUser(user);
  };

  // -----------------------------------------------
  // logout — clears all stored tokens and user state.
  // -----------------------------------------------
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if the API call fails, clear local storage
    } finally {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — cleaner to use than useContext(AuthContext) everywhere
export const useAuth = () => useContext(AuthContext);
