import Feather from '@expo/vector-icons/Feather';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, useColorScheme, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { CareerDetailScreen } from '../screens/careers/CareerDetailScreen';
import { CareerExplorerScreen } from '../screens/careers/CareerExplorerScreen';
import { CompareScreen } from '../screens/careers/CompareScreen';
import { CertificationDetailScreen } from '../screens/certifications/CertificationDetailScreen';
import { LearnScreen } from '../screens/certifications/LearnScreen';
import { ComingSoonScreen } from '../screens/PlaceholderScreen';
import { NewsScreen } from '../screens/news/NewsScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ProgressScreen } from '../screens/progress/ProgressScreen';
import { QuizResultScreen } from '../screens/quiz/QuizResultScreen';
import { QuizScreen } from '../screens/quiz/QuizScreen';
import { RoadmapDetailScreen } from '../screens/roadmaps/RoadmapDetailScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { useTheme } from '../theme/ThemeProvider';
import { AuthStackParamList, RootStackParamList, TabParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const tabIcons: Record<keyof TabParamList, keyof typeof Feather.glyphMap> = {
  Home: 'home',
  Explore: 'compass',
  Learn: 'book-open',
  Progress: 'bar-chart-2',
  Profile: 'user',
};

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function Tabs() {
  const theme = useTheme();
  return (
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
          <Feather name={tabIcons[route.name as keyof TabParamList]} color={color} size={size ?? 22} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={CareerExplorerScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Tabs" component={Tabs} />
      <RootStack.Screen name="CareerDetail" component={CareerDetailScreen} />
      <RootStack.Screen name="Compare" component={CompareScreen} />
      <RootStack.Screen name="Quiz" component={QuizScreen} options={{ presentation: 'modal' }} />
      <RootStack.Screen name="QuizResult" component={QuizResultScreen} />
      <RootStack.Screen name="CertificationDetail" component={CertificationDetailScreen} />
      <RootStack.Screen name="RoadmapDetail" component={RoadmapDetailScreen} />
      <RootStack.Screen name="EditProfile" component={EditProfileScreen} options={{ presentation: 'modal' }} />
      <RootStack.Screen name="News" component={NewsScreen} />
      <RootStack.Screen name="ComingSoon" component={ComingSoonScreen} />
    </RootStack.Navigator>
  );
}

export function RootNavigator() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const { user, loading } = useAuth();

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

  if (loading) {
    return (
      <View style={[styles.splash, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.blue} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>{user ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
