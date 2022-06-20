import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {END_POINT_API} from '../../constants/endPoints';

const RegisterInfo = ({navigation}) => {
  const [error, setError] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      setEmail('');
      setName('');
    }, []),
  );

  const validateEmail = value => {
    const rex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return rex.test(value);
  };

  const validate = () => {
    if (name == '') {
      setErrorName(true);
    }
    if (!validateEmail(email)) {
      setError(true);
    } else {
      putUserInfo();
    }
  };

  let data = {
    email: `${email}`,
    name: `${name}`,
  };

  const putUserInfo = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          axios
            .patch(`${END_POINT_API}users/my`, data, {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            })
            .then(function (response) {
              console.log('Register success!');
              console.log('Register success!', name);
              navigation.navigate('Tabs');
            })
            .catch(function (err) {});
        });
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View />
        <Text style={styles.headerTitle}>Đăng kí thông tin</Text>
        <View />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.textTitle}>Họ và Tên</Text>
        <TextInput
          placeholder="Nhập họ và tên tại đây"
          placeholderTextColor="grey"
          color="#000"
          style={styles.input}
          value={name}
          onChangeText={value => setName(value)}
        />
        {errorName ? (
          <Text style={styles.errorText}>Họ và tên không được để trống</Text>
        ) : null}
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.textTitle}>Email</Text>
        <TextInput
          placeholder="Nhập địa chỉ email tại đây"
          placeholderTextColor="grey"
          keyboardType="email-address"
          color="#000"
          style={styles.input}
          value={email}
          onChangeText={value => setEmail(value)}
        />
        {error ? (
          <Text style={styles.errorText}>Nhập đúng địa chỉ email của bạn</Text>
        ) : null}
      </View>
      <TouchableOpacity onPress={() => validate()} style={styles.confirmButton}>
        <Text style={styles.confirmText}>Xác nhận</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RegisterInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    margin: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  fieldContainer: {
    margin: 40,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    borderRadius: 10,
    backgroundColor: '#cccccc',
    color: '#000',
    fontSize: 16,
    paddingHorizontal: 10,
    marginTop: 5,
    paddingVertical: 15,
  },
  confirmButton: {
    backgroundColor: '#6c63ff',
    width: '30%',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
  },
  confirmText: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff0000',
  },
});
