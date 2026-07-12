import Feather from '@expo/vector-icons/Feather';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useColorScheme } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { useTheme } from '../theme/ThemeProvider';

export type RootTabParamList = {
  Home: undefined;
  Explore: undefined;
  Learn: undefined;
  Progress: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabIcons: Record<keyof RootTabParamList, keyof typeof Feather.glyphMap> = {
  Home: 'home',
  Explore: 'compass',
  Learn: 'book-open',
  Progress: 'bar-chart-2',
  Profile: 'user',
};

function ExploreScreen() {
  return (
    <PlaceholderScreen
      title="Explore Careers"
      description="Browse tech careers by field, salary, and demand."
      icon="compass"
    />
  );
}

function LearnScreen() {
  return (
    <PlaceholderScreen
      title="Learn"
      description="Courses, certifications, and skill paths live here."
      icon="book-open"
    />
  );
}

function ProgressScreen() {
  return (
    <PlaceholderScreen
      title="Progress"
      description="Track streaks, completed lessons, and milestones."
      icon="bar-chart-2"
    />
  );
}

function ProfileScreen() {
  return (
    <PlaceholderScreen
      title="Profile"
      description="Manage your account, goals, and preferences."
      icon="user"
    />
  );
}

export function RootNavigator() {
  const theme = useTheme();
  const scheme = useColorScheme();

  const navTheme = {
    ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      primary: theme.blue,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: theme.blue,
          tabBarInactiveTintColor: theme.textFaint,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            height: 64,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          tabBarIcon: ({ color, size }) => (
            <Feather name={tabIcons[route.name as keyof RootTabParamList]} color={color} size={size ?? 22} />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Learn" component={LearnScreen} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
