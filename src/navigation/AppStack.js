import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from "./Tabs";
import SplashScreen from 'react-native-splash-screen'
import InfoBookVehicle from '../screens/BottomTabs/InfoBookVehicle';
import LoadingScreen from '../screens/Checked/LoadingScreen';
import RegisterInfo from '../screens/Checked/RegisterInfo';
import ChoseTour from '../screens/Payments/ChoseTour'
import UserInfo from '../screens/BottomTabs/UserInfo'

import {
  CarInformation,
  Payments,
  ChooseLocation,
  Map,
  ChooseLocationOnMap
} from '../screens';

const Stack = createStackNavigator();

const AppStack = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <Stack.Navigator>
      <Stack.Screen options={{ header: () => null }} name="LoadingScreen" component={LoadingScreen} />
      <Stack.Screen options={{ header: () => null }} name="RegisterInfo" component={RegisterInfo} />
      <Stack.Screen options={{ header: () => null }} name="Tabs" component={Tabs} />
      <Stack.Screen options={{ header: () => null }} name="ChooseLocation" component={ChooseLocation} />
      <Stack.Screen options={{ header: () => null }} name="ChooseLocationOnMap" component={ChooseLocationOnMap} />
      <Stack.Screen options={{ header: () => null }} name="Map" component={Map} />
      <Stack.Screen options={{ header: () => null }} name="CarInformation" component={CarInformation} />
      <Stack.Screen options={{ header: () => null }} name="InfoBookVehicle" component={InfoBookVehicle} />
      <Stack.Screen options={{ header: () => null }} name="Payments" component={Payments} />
      <Stack.Screen options={{ header: () => null }} name="ChoseTour" component={ChoseTour} />
      <Stack.Screen options={{ header: () => null }} name="UserInfo" component={UserInfo} />
    </Stack.Navigator>
  );
};
export default AppStack;