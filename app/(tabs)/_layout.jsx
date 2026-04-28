import { Tabs } from 'expo-router';
import { Text } from 'react-native';

// -----------------------------------------------
// Tab bar icon using emoji — simple and no extra
// icon library needed.
// Replace with a proper icon library (like
// @expo/vector-icons) when you want polished icons.
// -----------------------------------------------
const TabIcon = ({ emoji, focused }) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown:          false,
        tabBarActiveTintColor: '#0F6E56',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor:  '#E8E6E0',
          paddingBottom:   8,
          height:          60,
        },
        tabBarLabelStyle: {
          fontSize:    11,
          fontWeight:  '500',
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:    'Discover',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title:    'Search',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title:    'My Business',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏪" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title:    'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
