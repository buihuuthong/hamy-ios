import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';
import {
  Header,
  Button,
  LocationToFromCommon,
  ModalSuccess,
} from '../../components';
import {COLORS, icons, SIZES} from '../../constants';

import {ActivityIndicator} from 'react-native-paper';
import {firebase} from '@react-native-firebase/auth';
import axios from 'axios';
import {END_POINT_API} from '../../constants/endPoints';

const Payments = ({route, navigation}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [myitem, setItem] = useState({});
  const [myUser, setMyUser] = useState({});
  const [loader, setLoader] = useState(false);

  function formatCash(str) {
    const newStr = str
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ',') + prev;
      });
    return newStr + ' đ';
  }

  function postOrder() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          // <------ Check this line
          console.log(idToken);
          console.log('my from date', myitem.fromDate);
          axios
            .post(
              `${END_POINT_API}orders`,
              {
                fromDateTime: `${myitem.fromDate}`,
                fromLocation: `${myitem.fromLat},${myitem.fromLng}`,
                fromName: ` ${myitem.fromLocation}`,
                isRoundTrip: false,
                paymentType: `${myitem.payType}`,
                serviceId: 1,
                toDateTime: `${myitem.fromDate}`,
                toLocation: `${myitem.toLat},${myitem.toLng}`,
                toName: `${myitem.toLocation}`,
                userNote: `${myitem.userNote}`,
                value: parseFloat(myitem.distance),
                vehicleCount: parseInt(myitem.quantity),
                vehicleId: parseInt(myitem.carId),
              },
              {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              },
            )
            .then(() => {
              console.log('[payment] oreder success');
              handleISSuccess();
            })
            .catch(function (error) {
              console.log('Payment:', error.request);
              if (error.message === 'Request failed with status code 500') {
                ToastAndroid.showWithGravity(
                  'server lỗi vui lòng quay lại sau',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
              }
            })
            .finally(() => {
              setLoader(false);
            });
        });
      }
    });
  }

  function postOrder2() {
    firebase.auth().onAuthStateChanged(function (user) {
      console.log('my from date', myitem.fromDate);
      console.log('my to date', myitem.toDate);
      if (user) {
        user.getIdToken().then(function (idToken) {
          // <------ Check this line
          console.log(idToken);
          axios
            .post(
              `${END_POINT_API}orders`,
              {
                fromDateTime: `${myitem.fromDate}`,
                fromLocation: `${myitem.fromLat},${myitem.fromLng}`,
                fromName: ` ${myitem.fromLocation}`,
                isRoundTrip: true,
                paymentType: `${myitem.payType}`,
                serviceId: 1,
                toDateTime: `${myitem.toDate}`,
                toLocation: `${myitem.toLat},${myitem.toLng}`,
                toName: `${myitem.toLocation}`,
                userNote: `${myitem.userNote}`,
                value: parseFloat(myitem.distance),
                vehicleCount: parseInt(myitem.quantity),
                vehicleId: parseInt(myitem.carId),
              },
              {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              },
            )
            .then(() => {
              console.log('[payment] oreder success');
              handleISSuccess();
            })
            .catch(function (error) {
              console.log('Payment:', error.message);
              if (error.message === 'Request failed with status code 500') {
                ToastAndroid.showWithGravity(
                  'server lỗi vui lòng quay lại sau',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
              }
            })
            .finally(() => {
              setLoader(false);
            });
        });
      }
    });
  }

  useEffect(() => {
    const newItem = route.params;
    setItem(newItem);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const interval = setInterval(() => {
        console.log('ok');
        setIsSuccess(false);
      }, 3000);
      return () => {
        navigation.navigate('History');
        clearInterval(interval);
      };
    }
  }, [isSuccess]);

  const handleISSuccess = () => {
    setIsSuccess(true);
  };

  const getMyUser = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          axios
            .get(`${END_POINT_API}users/my`, {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            })
            .then(function (response) {
              console.log(response.data);
              setMyUser(response.data);
            })
            .catch(function (err) {
              console.log('err: ', err.request);
            });
        });
      }
    });
  };

  useEffect(() => {
    getMyUser();
  }, []);

  const RenderBody = () => {
    const [checked, setChecked] = useState('first');
    const [picked, setPicked] = useState(true);
    useEffect(() => {
      checked === 'first'
        ? (myitem.payType = 'BANK_TRANSFER')
        : (myitem.payType = 'DIRECT');
      console.log(myitem.payType);
    }, []);
    return (
      <ScrollView>
        <SafeAreaView style={{flex: 1, marginTop: '4%'}}>
          <Header
            title={'Thông tin giá xe'}
            onPress={() => navigation.goBack()}
          />
        </SafeAreaView>
        <View
          style={{
            width: SIZES.width,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{width: SIZES.width * 0.9, marginBottom: '40%'}}>
            {/* //----Info customer-----// */}
            <View
              style={[
                styles.infoCustomer,
                styles.boxWrapper,
                {
                  paddingHorizontal: 10,
                  paddingBottom: 20,
                },
              ]}>
              <View style={{flex: 1}}>
                <View style={styles.commonTitleWapper}>
                  <Text style={styles.commonTitle}>Thông tin khách hàng</Text>
                </View>
                <View style={[styles.infoCustomerItem]}>
                  <Text style={styles.infoCustomerKeyItem}>Họ và tên </Text>
                  <Text style={styles.infoCustomerValueItem}>
                    {myUser.name}
                  </Text>
                </View>
                <View style={styles.infoCustomerItem}>
                  <Text style={styles.infoCustomerKeyItem}>Thời gian đón</Text>
                  <Text style={styles.infoCustomerValueItem}>
                    {moment(myitem.fromDate).format(`DD/MM/yyyy | HH:mm`)}
                  </Text>
                </View>
                <View style={styles.infoCustomerItem}>
                  <Text style={styles.infoCustomerKeyItem}>Số điện thoại</Text>
                  <Text style={styles.infoCustomerValueItem}>
                    {myUser.phone}
                  </Text>
                </View>
              </View>
            </View>
            {/* //----infoPlace-----// */}
            <View style={[{flex: 1}, styles.boxWrapper]}>
              <View style={[styles.commonTitleWapper, {marginLeft: 20}]}>
                <Text style={styles.commonTitle}>Thông tin đặt vé</Text>
              </View>
              <View style={[styles.infoPlace]}>
                <View
                  style={{
                    flex: 0.2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <LocationToFromCommon />
                </View>
                <View style={{flex: 0.8}}>
                  <View
                    style={[
                      styles.infoPlaceItem,
                      {marginBottom: SIZES.height * 0.02},
                    ]}>
                    <Text style={styles.infoPlaceTitle}>Điểm đi</Text>
                    <Text style={styles.infoPlaceDescription}>
                      {myitem.fromLocation}
                    </Text>
                  </View>
                  <View style={[styles.infoPlaceItem]}>
                    <Text style={styles.infoPlaceTitle}>Điểm đến</Text>
                    <Text style={styles.infoPlaceDescription}>
                      {myitem.toLocation}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, paddingHorizontal: 20, paddingBottom: 20}}>
                <View style={styles.infoCustomerItem}>
                  <Text style={styles.infoCustomerKeyItem}>Khoảng cách</Text>
                  <Text style={styles.infoCustomerValueItem}>
                    {myitem.distance}
                  </Text>
                </View>
                <View style={styles.infoCustomerItem}>
                  <Text style={styles.infoCustomerKeyItem}>Hành trình</Text>
                  <Text style={styles.infoCustomerValueItem}>
                    {myitem.checked === 'first' ? '1 chiều' : '2 chiều'}
                  </Text>
                </View>
                <View style={styles.infoCustomerItem}>
                  <Text style={styles.infoCustomerKeyItem}>Loại xe</Text>
                  <Text style={styles.infoCustomerValueItem}>
                    {myitem.carName}
                  </Text>
                </View>
                <View style={styles.infoCustomerItem}>
                  <Text style={styles.infoCustomerKeyItem}>Số lượng xe</Text>
                  <Text style={styles.infoCustomerValueItem}>
                    {myitem.quantity}
                  </Text>
                </View>
              </View>
            </View>

            {/* //----userNote-----// */}
            <View style={[styles.userNote, styles.boxWrapper]}>
              <View
                style={[
                  styles.commonTitleWapper,
                  {marginLeft: 20, marginBottom: '3%'},
                ]}>
                <Text style={styles.commonTitle}>Ghi chú</Text>
              </View>
              {myitem.userNote ? (
                <Text style={styles.userNoteTitle}>{myitem.userNote}</Text>
              ) : (
                <Text style={styles.userNoteHint}>* Không có ghi chú nào</Text>
              )}
            </View>

            {/* //----payments-----// */}
            <View style={[styles.payments, styles.boxWrapper]}>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={[
                    styles.commonTitleWapper,
                    {
                      marginLeft: 20,
                      marginBottom: '5%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => setPicked(prev => !prev)}>
                  <Text style={styles.commonTitle}>Phương thức Thanh toán</Text>
                  <View
                    style={{
                      marginRight: 20,
                    }}>
                    <Image
                      source={picked ? icons.arrow_down : icons.arrow_right}
                    />
                  </View>
                </TouchableOpacity>

                {/* //-----------radio-button------------// */}

                <View style={styles.radioButtonWrapper}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setChecked('first');
                      myitem.payType = 'BANK_TRANSFER';
                      console.log(myitem.payType);
                    }}>
                    <RadioButton
                      value="first"
                      status={checked === 'first' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked('first');
                        myitem.payType = 'BANK_TRANSFER';
                        console.log(myitem.payType);
                      }}
                      color={COLORS.combobox}
                    />
                    <Text style={{color: COLORS.black}}>
                      Thanh toán trực tiếp cho tài xế
                    </Text>
                  </TouchableOpacity>
                  {picked ? (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        setChecked('second');
                        myitem.payType = 'DIRECT';
                        console.log(myitem.payType);
                      }}>
                      <RadioButton
                        value="second"
                        status={checked === 'second' ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setChecked('second');
                          myitem.payType = 'DIRECT';
                          console.log(myitem.payType);
                        }}
                        color={COLORS.combobox}
                      />
                      <Text style={{color: COLORS.black}}>Chuyển khoản</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={styles.paymentsItem}>
                  <Text style={styles.paymentsKeyItem}>Số tiền được giảm</Text>
                  <Text style={styles.paymentsValueItem}>
                    {formatCash(`${myitem.discount}`)}
                  </Text>
                </View>
                <View style={styles.paymentsTotal}>
                  <Text style={styles.paymentsKeyTotal}>Thành tiền</Text>
                  <Text style={styles.paymentsValueTotal}>
                    {formatCash(`${myitem.finalPrice}`)}
                  </Text>
                </View>
                <View style={styles.paymentsItem}>
                  <Text style={styles.paymentsKeyItem}></Text>
                  <Text style={styles.paymentsValueItemNote}>
                    * Chi phí trên đã bao gồm VAT và chưa bao gồm phí cầu đường
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <RenderBody />
      {/* //----------submit form-----------// */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 20,
          alignItems: 'center',
          position: 'absolute',
          bottom: '10%',
        }}>
        <View
          style={{
            width: '87%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Button
            buttonTitle={
              loader ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                'Hoàn thành'
              )
            }
            onPress={() => {
              setLoader(true);
              if (myitem) {
                if (myitem.checked === 'first') {
                  postOrder();
                } else if (myitem.checked === 'second') {
                  postOrder2();
                }
              }
            }}
            stylebtn={{
              backgroundColor: COLORS.primary,
            }}
            styleBtnText={{
              color: COLORS.white,
            }}
            disabled={loader ? true : false}
          />
        </View>
      </View>

      {isSuccess ? (
        <ModalSuccess visible={isSuccess} navigation={navigation} />
      ) : null}
    </View>
  );
};

export default Payments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  //----common------//
  boxWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginVertical: 10,
  },

  //---------radioButton---------//
  radioButtonWrapper: {
    width: SIZES.width,
    marginLeft: 10,
    marginBottom: 20,
  },

  commonTitleWapper: {
    marginVertical: 20,
  },

  commonTitle: {
    fontSize: SIZES.h3,
    color: COLORS.black,
    fontWeight: '700',
  },

  //----infoPlace-----//
  infoPlace: {
    width: '100%',
    flexDirection: 'row',
    paddingBottom: 20,
  },
  infoPlaceItem: {
    flex: 0.5,
  },
  infoPlaceTitle: {
    fontSize: SIZES.body5,
    color: COLORS.grey,
    marginBottom: 2,
  },
  infoPlaceDescription: {
    fontSize: SIZES.body4,
    color: COLORS.black,
  },

  //----infoTour-----//
  infoTour: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: '8%',
  },
  infoTourItem: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTourItemTilte: {
    fontSize: SIZES.body3,
    color: COLORS.grey,
  },
  infoTourItemSubTilte: {
    fontSize: SIZES.body2,
    color: COLORS.black,
    fontWeight: '500',
  },

  //----infoCustomer-----//

  infoCustomer: {
    width: '100%',
  },
  infoCustomerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: '2%',
  },
  infoCustomerKeyItem: {
    fontSize: SIZES.body3,
    color: COLORS.black,
  },
  infoCustomerValueItem: {
    fontSize: SIZES.h4,
    color: COLORS.black,
    fontWeight: '400',
  },
  //----userNote-----//
  userNote: {
    width: '100%',
  },
  userNoteHint: {
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: SIZES.body4,
    color: COLORS.grey,
  },
  userNoteTitle: {
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: SIZES.body4,
    color: COLORS.black,
  },

  //----payments-----//

  payments: {
    width: '100%',
    paddingBottom: 20,
  },
  paymentsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: '2%',
  },
  paymentsKeyItem: {
    fontSize: SIZES.body3,
    color: COLORS.black,
  },
  paymentsValueItem: {
    fontSize: SIZES.h4,
    color: COLORS.black,
    fontWeight: '400',
  },
  paymentsTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  paymentsKeyTotal: {
    fontSize: SIZES.body2,
    color: COLORS.black,
  },
  paymentsValueTotal: {
    fontSize: SIZES.h2,
    color: 'red',
    fontWeight: '700',
  },
  paymentsValueItemNote: {
    fontSize: SIZES.body5,
    color: COLORS.grey,
    marginTop: 10,
  },
});
