import * as SecureStore from 'expo-secure-store';

// -----------------------------------------------
// Base URL of your Express backend.
// During development this points to your local machine.
// When you deploy to Render, update this to your live URL.
// -----------------------------------------------
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/v1';

// -----------------------------------------------
// apiRequest — the core fetch wrapper.
// Every API call in the app goes through this.
//
// It automatically:
//  - Attaches the Authorization header if the user is logged in
//  - Parses JSON responses
//  - Throws a readable error if the request fails
// -----------------------------------------------
const apiRequest = async (method, path, body = null) => {
  // Read the stored access token (saved after login)
  const token = await SecureStore.getItemAsync('access_token');

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json();

  // If the server returned an error status, throw it so we can catch it in the UI
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data;
};

// -----------------------------------------------
// Shorthand helpers — use these throughout the app:
//   api.get('/businesses')
//   api.post('/auth/send-otp', { phone })
//   api.patch('/users/me', { full_name })
//   api.delete('/businesses/me')
// -----------------------------------------------
const api = {
  get:    (path)        => apiRequest('GET',    path),
  post:   (path, body)  => apiRequest('POST',   path, body),
  patch:  (path, body)  => apiRequest('PATCH',  path, body),
  delete: (path)        => apiRequest('DELETE', path),
};

export default api;
