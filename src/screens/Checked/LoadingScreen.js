import React, {useEffect} from 'react';
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  Alert,
} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {END_POINT_API} from '../../constants/endPoints';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoadingScreen = ({navigation}) => {
  console.log('before call api~');
  let data = {
    name: 'userName',
  };
  useFocusEffect(
    React.useCallback(() => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          user.getIdToken().then(function (idToken) {
            // <------ Check this line
            axios
              .post(`${END_POINT_API}users`, data, {
                params: {
                  idToken: `${idToken}`,
                },
              })
              .then(function (response) {
                navigation.navigate('RegisterInfo');
              })
              .catch(function (err) {
                console.log('login bug: ', err.response.data.code);
                if (err.response.data.code == 'USER_ALREADY_EXIST') {
                  firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                      user.getIdToken().then(function (idToken) {
                        axios
                          .get(`${END_POINT_API}users/my`, {
                            headers: {
                              Authorization: `Bearer ${idToken}`,
                            },
                          })
                          .then(function (res) {
                            console.log('loading screen ~', res.data.name);
                            if (res.data.name == 'userName') {
                              navigation.navigate('RegisterInfo');
                            } else {
                              navigation.navigate('Tabs');
                            }
                          })
                          .catch(function (error) {
                            console.log('loading screen bug', error.message);
                          });
                      });
                    }
                  });
                }
              });
          });
        }
      });
    }, []),
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}>
      <View
        style={{
          top: 100,
        }}>
        <ActivityIndicator size="large" color="#6c63ff" />
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
