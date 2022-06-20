import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login/LoginScreen';
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator();

const AuthStack = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <Stack.Navigator>
      <Stack.Screen options={{ header: () => null }} name="Login" component={LoginScreen} />
    </Stack.Navigator>
  )
}

export default AuthStack;