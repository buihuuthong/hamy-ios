import React from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  HomeScreen,
  SavedLocation,
  BookVehicle,
  History,
  Account,
} from '../screens';

import {COLORS, icons, SIZES} from '../constants';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.container,
        tabBarShowLabel: false,
      }}
      tabBarOptions={{
        keyboardHidesTabBar: true,
      }}
      initialRouteName='BookVehicle'
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.bottomTabWrapper}>
              <Image
                source={icons.home}
                resizeMode="contain"
                style={[
                  styles.iconStyle,
                  {
                    tintColor: focused ? COLORS.primary : COLORS.black,
                  },
                ]}
              />
              <Text style={styles.bottomTabText}>TRANG CHỦ</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="SavedLocation"
        component={SavedLocation}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.bottomTabWrapper}>
              <Image
                source={icons.bookmark}
                resizeMode="contain"
                style={[
                  styles.iconStyle,
                  {
                    tintColor: focused ? COLORS.primary : COLORS.black,
                    width: 25,
                  }]}
              />
              <Text style={styles.bottomTabText}>ĐÃ LƯU</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="BookVehicle"
        component={BookVehicle}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[styles.bottomTabWrapper]}>
              <View style={[styles.iconWrapperBorder, styles.shadow]}>
                <View style={[styles.iconWrapper, styles.shadowBlue]}>
                  <Image
                    source={icons.car}
                    resizeMode="contain"
                    style={[
                      styles.iconStyle,
                      styles.iconStyleSpecial,
                      {
                        tintColor: 'white',
                      },
                    ]}
                  />
                </View>
              </View>
              <Text 
                style={focused ? 
                  [styles.bottomTabText, styles.bottomtabTextSpecial] 
                  : 
                  [
                    styles.bottomTabText, 
                    styles.bottomtabTextSpecial, 
                    {fontWeight: '400'}
                  ]}>
                ĐẶT XE
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.bottomTabWrapper}>
              <Image
                source={icons.history}
                resizeMode="contain"
                style={[
                  styles.iconStyle,
                  {
                    tintColor: focused ? COLORS.primary : COLORS.black,
                  },
                ]}
              />
              <Text style={styles.bottomTabText}>LỊCH SỬ</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.bottomTabWrapper}>
              <Image
                source={icons.user}
                resizeMode="contain"
                style={[
                  styles.iconStyle,
                  {
                    tintColor: focused ? COLORS.primary : COLORS.black,
                  },
                ]}
              />
              <Text style={styles.bottomTabText}>TÀI KHOẢN</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderTopLeftRadius: SIZES.height * 0.02,
    borderTopRightRadius: SIZES.height * 0.02,
    height: SIZES.height * 0.09,
    paddingHorizontal: 5,
  },

  //---------shadow---------//

  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  shadowBlue: {
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },

  //--------main css --------//

  iconStyle: {
    width: 30,
    height: 30,
  },
  bottomTabWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabText: {
    fontSize: 10,
    marginTop: 5,
    color: COLORS.black
  },

  //---------special item---------//

  iconWrapperBorder: {
    position: 'absolute',
    bottom: -10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: SIZES.width * 0.2,
    height: SIZES.width * 0.2,
    borderRadius: SIZES.width * 0.75,
    padding: 10,
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    width: SIZES.width * 0.18,
    height: SIZES.width * 0.18,
    borderRadius: SIZES.width * 0.9,
    padding: 10,
  },

  iconStyleSpecial: {
    width: '100%',
    height: '100%',
  },

  bottomtabTextSpecial: {
    position: 'absolute',
    bottom: -30,
    fontWeight: 'bold',
    fontSize: 12,
    color: COLORS.black,
  },
});
