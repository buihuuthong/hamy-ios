import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import {END_POINT_API} from '../../constants/endPoints';

const UserInfo = ({navigation}) => {
  const [error, setError] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const validateEmail = value => {
    const rex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return rex.test(value);
  };

  const validate = () => {
    if (userName == '') {
      setErrorName(true);
    }
    if (!validateEmail(userEmail)) {
      setError(true);
    } else {
      putUserInfo();
    }
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          // <------ Check this line
          axios
            .get(`${END_POINT_API}users/my`, {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            })
            .then(function (res) {
              console.log(res.data);
              setUserName(res.data.name);
              setUserEmail(res.data.email);
            })
            .catch(function (err) {
              console.log(err);
            });
        });
      }
    });
  }, []);

  let data = {
    email: `${userEmail}`,
    name: `${userName}`,
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
              navigation.navigate('Account');
            })
            .catch(function (err) {
              console.log(err.response);
            });
        });
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Icon name="arrow-back-outline" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
        <View />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.textTitle}>Họ và Tên</Text>
        <TextInput
          placeholder="Nhập họ và tên tại đây"
          placeholderTextColor="grey"
          color="#000"
          style={styles.input}
          value={userName}
          onChangeText={value => setUserName(value)}
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
          value={userEmail}
          onChangeText={value => setUserEmail(value)}
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

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    margin: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    fontSize: 30,
    color: '#6C63FF',
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
