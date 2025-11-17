import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AsyncStorage } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/components/HomeScreen';
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import ProfileScreen from './src/components/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Feed',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.log('Check login error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
