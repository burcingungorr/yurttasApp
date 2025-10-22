import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import SpendScreen from '../screens/SpendScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginScreen from '../screens/LoginScreen';
import SurveyScreen from '../screens/SurveyScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({ color }) => {
              let iconName = '';

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Spend') {
                iconName = 'currency-usd';
              } else if (route.name === 'Survey') {
                iconName = 'clipboard-text'; 
              } else if (route.name === 'Chat') {
                iconName = 'chat';
              } else if (route.name === 'Profile') {
                iconName = 'account';
              }

              return <Icon name={iconName} color={color} size={30} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
            tabBarLabel: () => null,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Spend" component={SpendScreen} />
          <Tab.Screen name="Survey" component={SurveyScreen} />
          <Tab.Screen name="Chat" component={ChatScreen} />
          <Tab.Screen name="Profile">
            {() => <ProfileScreen setIsLoggedIn={setIsLoggedIn} />}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <LoginScreen setIsLoggedIn={setIsLoggedIn} />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
