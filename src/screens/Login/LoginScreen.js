import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Modal,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {Card} from 'react-native-shadow-cards';
import {firebase} from '@react-native-firebase/auth';
import axios from 'axios';
import {END_POINT_API} from '../../constants/endPoints';

const LoginScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [errorCode, setErrorCode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  let textInput = useRef(null);
  const lengthInput = 6;

  const onChangeText = val => {
    setCode(val);
  };

  const signInWithPhoneNumber = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(
      number > 1 ? '+84' + number : '+840' + number,
    );
    setConfirm(confirmation);
    // loginAPI();
    } catch (error) {
      console.log(error);
    }
  };

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log(error.code);
      setErrorCode(true);
      if(error.code === 'auth/user-disabled') {
        setModalVisible(true)
      }
    }
  }

  let data = {
    name: 'userName',
  };

  const loginAPI = () => {
    // let fcmToken = await messaging().getToken();
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
              console.log('Login success!');
            })
            .catch(function (err) {
              console.log('login bug: ', err.response.data.code);
              if (err.response.data.code == 'USER_ALREADY_EXIST') {
                console.log('user aready exits! login success!');
                return;
              }
            });
        });
      }
    });
  };

  const onExit = () => {
    setModalVisible(!modalVisible)
    setConfirm(!confirm)
    setNumber('')
    setCode('')
    setErrorCode(false)
    setIsLoading(false)
  }

  if (!confirm) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity>
          <Icon name="arrow-back-outline" style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.contain}>
          <Image
            source={require('../../assets/image/undraw_destinations_fpv7.png')}
            style={styles.image1}
          />
          <Text style={styles.textTitle}>????ng Nh???p</Text>
          <View style={styles.text}>
            <Text style={styles.text1}>Xin ch??o, h??n h???nh ???????c g???p b???n!</Text>
            <Text style={styles.text2}>Tham gia v???i Thu?? Xe ??i T???nh!</Text>
          </View>
          <View style={styles.textInputContainer}>
            <View style={styles.location}>
              <Image
                source={require('../../assets/icon/Android/drawable-ldpi/vietnam.png')}
                style={styles.flag}
              />
              <Text style={styles.textLocation}>+84</Text>
              <Image
                source={require('../../assets/icon/Android/drawable-ldpi/Icon-awesome-sort-down.png')}
                style={styles.dropDown}
              />
            </View>
            <View
              style={{
                width: 2,
                height: 50,
                backgroundColor: '#000',
              }}
            />
            <View style={styles.textInput}>
              <TextInput
                placeholder="Nh???p s??? ??i???n tho???i"
                placeholderTextColor="grey"
                color="#000"
                fontSize={16}
                onChangeText={value => setNumber(value)}
                value={number}
                keyboardType="number-pad"
                maxLength={10}
                marginLeft={10}
              />
            </View>
            <TouchableOpacity
              onPress={signInWithPhoneNumber}
              onPressIn={() => setIsLoading(true)}
              style={[
                styles.buttonNext,
                {
                  backgroundColor: number.length >= 9 ? '#6C63FF' : '#fff',
                  borderWidth: number.length >= 9 ? 0 : 1,
                },
              ]}
              disabled={
                number.length >= 9 && number.length <= 10 ? false : true
              }>
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  style={styles.iconNext}
                  color="#fff"
                />
              ) : (
                <Icon
                  name="arrow-forward-outline"
                  style={[
                    styles.iconNext,
                    {
                      color: number.length >= 9 ? '#fff' : '#000',
                    },
                  ]}
                />
              )}
            </TouchableOpacity>
          </View>
          <Text
            style={{
              marginTop: 10,
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#000',
              display: number.length > 0 && number.length < 9 ? 'flex' : 'none',
              color: number.length > 0 && number.length < 9 ? 'red' : 'red',
            }}>
            Vui l??ng nh???p ????ng s??? ??i???n tho???i c???a b???n
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setConfirm(!confirm)}>
        <Icon name="arrow-back-outline" style={styles.icon} />
      </TouchableOpacity>
      <View style={styles.contain}>
        <Image
          source={require('../../assets/image/undraw_Forgot_password_re_hxwm.png')}
          style={styles.image2}
        />
        <Text style={styles.textTitle}>????ng Nh???p</Text>
        <View style={styles.text}>
          <Text style={styles.text0}>S??? ??i???n tho???i c???a b???n</Text>
          <View style={styles.infoContainer}>
            <View style={styles.info}>
              <Image
                source={require('../../assets/icon/Android/drawable-ldpi/vietnam.png')}
                style={styles.flag}
              />
              <Text style={styles.textLocation}>+84</Text>
              <Image
                source={require('../../assets/icon/Android/drawable-ldpi/Icon-awesome-sort-down.png')}
                style={styles.dropDown}
              />
            </View>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
              {number}
            </Text>
          </View>
          <Text style={styles.text2}>Nh???p m?? OTP g???m 6 ch??? s???</Text>
          <TextInput
            ref={input => (textInput = input)}
            onChangeText={onChangeText}
            style={{width: 0, height: 0}}
            value={code}
            maxLength={lengthInput}
            returnKeyType="done"
            keyboardType="number-pad"
          />
          <View style={styles.otpContainer}>
            {Array(lengthInput)
              .fill()
              .map((data, index) => (
                <Card key={index} style={styles.otpBox}>
                  <Text
                    style={styles.otpText}
                    onPress={() => textInput.focus()}>
                    {code && code.length > 0 ? code[index] : ''}
                  </Text>
                </Card>
              ))}
          </View>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#000',
              display: errorCode ? 'flex' : 'none',
              color: errorCode ? 'red' : 'red',
            }}>
            M?? OTP kh??ng ch??nh x??c, vui l??ng th??? l???i
          </Text>
          <View style={styles.resendCode}>
            <Text style={styles.textResend}>B???n ch??a nh???n ???????c m???</Text>
            <TouchableOpacity
              onPress={signInWithPhoneNumber}
              style={styles.buttonResend}>
              <Text
                style={{color: '#6C63FF', fontSize: 16, fontWeight: 'bold'}}>
                G???i l???i
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => confirmCode()}
            style={styles.confirmButton}>
            <Text style={styles.textConfirm}>X??c Nh???n</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerModal}>
              <Text style={styles.cancelFlight}>
                T??i kho???n ???? b??? x??a
              </Text>
            </View>
            <View style={styles.line1} />
            <View style={styles.bottomButtonView}>
              <View
                style={styles.boxModal}>
                {/* <Text style={styles.cancel}>Kh??ng</Text> */}
              </View>
              <View style={styles.line2} />
              <TouchableOpacity
                style={styles.boxModal}
                onPress={() => onExit()}>
                <Text style={styles.confirm}>X??c nh???n</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 30,
    padding: 20,
    color: '#6C63FF',
  },
  image1: {
    width: '70%',
    height: '40%',
    alignSelf: 'center',
  },
  image2: {
    width: '70%',
    height: '30%',
    alignSelf: 'center',
  },
  textTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'center',
  },
  text: {
    margin: 10,
  },
  text0: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  text1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  text2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    margin: 10,
    borderRadius: 10,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '25%',
    padding: 5,
  },
  textLocation: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  dropDown: {
    width: 10,
    height: 5,
  },
  textInput: {
    width: '60%',
  },
  buttonNext: {
    width: '15%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
  },
  iconNext: {
    fontSize: 20,
    marginTop: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  info: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  otpContainer: {
    marginBottom: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  otpBox: {
    width: 50,
    borderRadius: 5,
    borderColor: '#000',
    height: 50,
    marginTop: 20,
  },
  otpText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  resendCode: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  textResend: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonResend: {
    marginLeft: 10,
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  textConfirm: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },

  //-----Modal----//
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 33, 33, 0.9)',
  },
  modalView: {
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 0.5,
  },
  cancelFlight: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerModal: {
    padding: 20,
  },
  bottomButtonView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxModal: {
    width: '50%',
  },
  line1: {
    width: '100%',
    height: 2,
    backgroundColor: 'grey',
  },
  cancel: {
    color: 'grey',
    alignSelf: 'center',
    fontSize: 16,
    padding: 5,
  },
  line2: {
    width: 2,
    height: '100%',
    backgroundColor: 'grey',
  },
  confirm: {
    color: '#6c63ff',
    alignSelf: 'center',
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
  },
});
