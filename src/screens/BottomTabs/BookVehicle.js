import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  InputVehicle,
  LocationToFrom,
  Button,
  HotLine,
  StartDatetimePicker,
  EndDatetimePicker,
  Header,
} from '../../components';

import {COLORS, icons, images, SIZES} from '../../constants';
import {firebase} from '@react-native-firebase/auth';
import axios from 'axios';
import moment from 'moment';
import {END_POINT_API} from '../../constants/endPoints';

const BookVehicle = ({route, navigation}) => {
  const [checked, setChecked] = useState('first');
  const [isStartDateVisible, setIsStartDateVisible] = useState(false);
  const [isEndDateVisible, setIsEndDateVisible] = useState(false);
  const [dataVehicle, setDataVehicle] = useState([]);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState('');
  const [FfoDate, setFfoDate] = useState(new Date());
  const [FtoDate, setFtoDate] = useState('');
  const [fromLat, setFromLat] = useState(null);
  const [fromLng, setFromLng] = useState(null);
  const [toLat, setToLat] = useState(null);
  const [toLng, setToLng] = useState(null);
  const [myItem, setMyItem] = useState({});
  const [choosenCar, setChoosenCar] = useState({});
  const [validate, setValidate] = useState(false);
  const [myService, setMyService] = useState([]);
  const [selectedValue, setSelectedValue] = useState('Chọn dịch vụ');
  const item = route.params;

  function onRefresh() {
    setFromLocation('');
    setToLocation('');
    setMyItem({});
    setValidate(false);
    setChoosenCar({
      quantity: 0,
    });
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'tabPress',
      e => {
        // Prevent default behavior
        e.preventDefault();
        onRefresh();
        navigation.navigate('BookVehicle');
      },
      [],
    );

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    choosenCar.quantity = 0;
  }, []);

  const handleChoosenCar = item => {
    setChoosenCar({
      ...item,
      quantity: 1,
    });
  };

  const handleMinus = item => {
    if (choosenCar.quantity > 0) {
      setChoosenCar({
        ...item,
        quantity: choosenCar.quantity - 1,
      });
    }
  };

  const handleAdd = item => {
    setChoosenCar({
      ...item,
      quantity: choosenCar.quantity + 1,
    });
  };

  const RenderItem = ({item}) => {
    return (
      <View
        key={`${item.id}`}
        style={
          choosenCar.id === item.id
            ? [styles.bookCarWrapperBook, styles.shadowBlue]
            : styles.bookCarWrapperBook
        }>
        <TouchableOpacity
          style={
            choosenCar.id === item.id
              ? styles.bookCarWrapperChoosen
              : styles.bookCarWrapper
          }
          onPress={() => handleChoosenCar(item)}>
          <View style={styles.bookCarImage}>
            <Image
              style={{
                width: '96%',
                height: '100%',
                resizeMode: 'contain',
              }}
              source={
                item.id === 2
                  ? images.car4Seater
                  : item.id == 3
                  ? images.car7Seater
                  : item.id == 4
                  ? images.car16Seater
                  : images.noImage
              }
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View>
              <Text
                style={
                  choosenCar.id === item.id
                    ? styles.bookCarTitleChoosen
                    : styles.bookCarTitle
                }>
                {item.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: 74,
                height: 26,
                borderColor: COLORS.primary,
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 10,
              }}>
              <TouchableOpacity
                style={{
                  width: '35%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  handleMinus(item);
                }}
                disabled={choosenCar.id === item.id ? false : true}>
                <Image source={icons.minus} />
              </TouchableOpacity>
              <View
                style={{
                  width: '35%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: '80%',
                    height: '80%',
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e5e5e5',
                  }}>
                  <Text style={{color: COLORS.black}}>
                    {choosenCar.id === item.id ? choosenCar.quantity : 0}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  width: '35%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => handleAdd(item)}
                disabled={choosenCar.id === item.id ? false : true}>
                <Image source={icons.plus} />
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={
                  choosenCar.id === item.id
                    ? styles.bookCarPriceChoose
                    : styles.bookCarPrice
                }>
                {/* {`${item.price.toFixed(3)}đ/km`} */}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const RenderBody = () => {
    useEffect(() => {
      if (new Date(toDate)?.getTime() - new Date(fromDate)?.getTime() < 0) {
        setFromDate(toDate);
        setToDate(fromDate);
        Alert.alert(
          'Thông báo',
          'Chúng tôi xin phép chuyển ngày đón thành ngày về do bạn chọn ngày về nhỏ hơn ngày đến!',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        );
      }
    }, [toDate]);

    useEffect(() => {
      if (item) {
        setToLocation(item.toLocation);
        setFromLocation(item.fromLocation);
        setFromLng(item.fromLng);
        setFromLat(item.fromLat);
        setToLat(item.toLat);
        setToLng(item.toLng);
        setMyItem(item);
      }
    }, [item]);

    const onFocus = () => {
      if (toLocation !== '' && fromLocation !== '') {
        navigation.navigate('ChooseLocation', {
          toLocation,
          fromLocation,
          toLat,
          toLng,
          fromLat,
          fromLng,
          distance: myItem.distance,
        });
      } else {
        navigation.navigate('ChooseLocation', {
          toLocation: '',
          fromLocation: '',
          toLat: 0,
          toLng: 0,
          fromLat: 0,
          fromLng: 0,
          distance: '',
        });
      }
    };

    const getVehicle = () => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          user.getIdToken().then(function (idToken) {
            if (idToken) {
              axios
                .get(`${END_POINT_API}price-records/vehicles`, {
                  headers: {
                    Authorization: `Bearer ${idToken}`,
                  },
                })
                .then(function (response) {
                  console.log('[BookVehicle] vehicle ok! ', response.data);
                  setDataVehicle(response.data);
                })
                .catch(function (err) {
                  console.log('book vehicle err: ', err);
                });
            }
          });
        }
      });
    };

    const getService = () => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          user.getIdToken().then(function (idToken) {
            axios
              .get(`${END_POINT_API}price-records/services`, {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              })
              .then(function (response) {
                console.log('[BookVehicle] service ok! ');
                setMyService(response.data);
              })
              .catch(function (err) {
                console.log('err: ', err);
              });
          });
        }
      });
    };

    const hideStartDatePicker = () => {
      setIsStartDateVisible(false);
    };

    const hideEndDatePicker = () => {
      setIsEndDateVisible(false);
    };

    useEffect(() => {
      getVehicle();
      getService();
    }, []);

    return (
      <View style={styles.bodyContainer}>
        {/* //----------Choose location-----------// */}
        <View style={styles.chooseLocation}>
          <View style={[styles.chooseLocationLeft, {flex: 0.15}]}>
            <LocationToFrom />
          </View>
          <View style={[styles.chooseLocationCenter, {flex: 0.7}]}>
            <TouchableOpacity
              style={{
                zIndex: 3,
              }}
              delayPressIn={0}
              onPress={() => onFocus()}>
              <InputVehicle
                placeholderText="Nhập điểm đi"
                style={{
                  backgroundColor: COLORS.input,
                  height: 42,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
                labelValue={fromLocation}
                editable={false}
                isEmpty={true}
                pointerEvents="none"
                myOnPress={() => onFocus()}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                zIndex: 3,
              }}
              delayPressIn={0}
              onPress={() => onFocus()}>
              <InputVehicle
                placeholderText="Nhập điểm đến"
                style={{
                  backgroundColor: COLORS.input,
                  height: 42,
                  borderRadius: 10,
                }}
                labelValue={toLocation}
                editable={false}
                isEmpty={true}
                pointerEvents="none"
                myOnPress={() => onFocus()}
              />
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
              }}>
              {(fromLocation == '' || toLocation == '') && validate ? (
                <Text style={{color: 'red', marginTop: 5, marginLeft: 15}}>
                  *Điểm đi, điểm đến
                </Text>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.chooseLocationRight, {flex: 0.15}]}
            onPress={() => {
              if (fromLocation != '' && toLocation != '') {
                setFromLocation(toLocation);
                setToLocation(fromLocation);
                console.log(fromLocation);
                console.log(toLocation);
              }
            }}>
            <Image source={icons.swap} />
          </TouchableOpacity>
        </View>

        {/* //-----------radio-button------------// */}

        <View style={styles.radioButtonWrapper}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '10%',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 20,
                height: 20,
                borderWidth: 0.3,
                borderRadius: 20,
                marginRight: 5,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '80%',
                  height: '80%',
                  borderRadius: 20,
                  backgroundColor:
                    checked === 'first' ? COLORS.combobox : COLORS.white,
                }}>
                <RadioButton
                  value="first"
                  status={checked === 'first' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('first')}
                  color={COLORS.combobox}
                />
              </View>
            </View>
            <Text style={{color: COLORS.black}}>Một chiều</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '5%',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 20,
                height: 20,
                borderWidth: 0.3,
                borderRadius: 20,
                marginRight: 5,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '80%',
                  height: '80%',
                  borderRadius: 20,
                  backgroundColor:
                    checked === 'second' ? COLORS.combobox : COLORS.white,
                }}>
                <RadioButton
                  value="second"
                  status={checked === 'second' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('second')}
                  color={COLORS.combobox}
                />
              </View>
            </View>
            <Text style={{color: COLORS.black}}>Hai chiều</Text>
          </View>
        </View>

        {/* //--------date-time-picker--------// */}
        {checked === 'first' ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.dateTimeWrapper}
              onPress={() => setIsStartDateVisible(true)}>
              <View style={styles.dateTimeWrapperCalendar}>
                <Image
                  style={styles.dateTimeCalendar}
                  source={icons.calendar}
                />
              </View>
              <View style={{flex: 0.95}}>
                <StartDatetimePicker
                  firsValue={'Ngày đón'}
                  visible={isStartDateVisible}
                  hideDatePicker={hideStartDatePicker}
                  parentCallback={setFromDate}
                  formatDate={setFfoDate}
                />
              </View>
              <View style={styles.dateTimeChevronWrapper}>
                <Image
                  source={icons.sort_down}
                  style={styles.dateTimeChevron}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
              }}>
              {fromDate == '' && validate ? (
                <Text style={{color: 'red', marginLeft: 25, marginTop: 5}}>
                  * Vui lòng chọn ngày đi
                </Text>
              ) : new Date(FfoDate)?.getHours() - new Date().getHours() < 1 ? (
                <Text style={{color: 'red', marginLeft: 25, marginTop: 5}}>
                  * Chỉ được đặt xe trước giờ khởi hành 1 - 2 tiếng
                </Text>
              ) : null}
            </View>
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* one way */}
            <TouchableOpacity
              style={styles.dateTimeWrapper}
              onPress={() => setIsStartDateVisible(true)}>
              <View style={styles.dateTimeWrapperCalendar}>
                <Image
                  style={styles.dateTimeCalendar}
                  source={icons.calendar}
                />
              </View>
              <View style={{flex: 0.95}}>
                {fromDate ? (
                  <StartDatetimePicker
                    firsValue={'Ngày đón'}
                    visible={isStartDateVisible}
                    hideDatePicker={hideStartDatePicker}
                    parentCallback={setFromDate}
                    formatDate={setFfoDate}
                  />
                ) : new Date(toDate)?.getTime() -
                    new Date(fromDate)?.getTime() <
                  0 ? (
                  <StartDatetimePicker
                    firsValue={'Ngày đón'}
                    visible={isStartDateVisible}
                    hideDatePicker={hideStartDatePicker}
                    parentCallback={setFromDate}
                    formatDate={setFfoDate}
                  />
                ) : (
                  <StartDatetimePicker
                    firsValue={moment(toDate).format(`DD/MM/yyyy | HH:mm`)}
                    visible={isStartDateVisible}
                    hideDatePicker={hideStartDatePicker}
                    parentCallback={setFromDate}
                    formatDate={setFfoDate}
                  />
                )}
              </View>
              <View style={styles.dateTimeChevronWrapper}>
                <Image
                  source={icons.sort_down}
                  style={styles.dateTimeChevron}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
              }}>
              {fromDate == '' && validate ? (
                <Text style={{color: 'red', marginLeft: 25, marginTop: 5}}>
                  * Vui lòng chọn ngày đi
                </Text>
              ) : new Date(FfoDate)?.getHours() - new Date().getHours() < 1 ? (
                <Text style={{color: 'red', marginLeft: 25, marginTop: 5}}>
                  * Chỉ được đặt xe trước giờ khởi hành 1 - 2 tiếng
                </Text>
              ) : null}
            </View>
            {/* Two way */}
            <TouchableOpacity
              style={[styles.dateTimeWrapper, {marginTop: 10}]}
              onPress={() => setIsEndDateVisible(true)}>
              <View style={styles.dateTimeWrapperCalendar}>
                <Image
                  style={styles.dateTimeCalendar}
                  source={icons.calendar}
                />
              </View>
              <View style={{flex: 0.95}}>
                {!toDate ? (
                  <EndDatetimePicker
                    firsValue={'Ngày về'}
                    visible={isEndDateVisible}
                    hideDatePicker={hideEndDatePicker}
                    parentCallback={setToDate}
                  />
                ) : new Date(toDate)?.getTime() -
                    new Date(fromDate)?.getTime() <
                  0 ? (
                  <EndDatetimePicker
                    firsValue={'Ngày về'}
                    visible={isEndDateVisible}
                    hideDatePicker={hideEndDatePicker}
                    parentCallback={setToDate}
                  />
                ) : (
                  <EndDatetimePicker
                    firsValue={moment(toDate).format(`DD/MM/yyyy | HH:mm`)}
                    visible={isEndDateVisible}
                    hideDatePicker={hideEndDatePicker}
                    parentCallback={setToDate}
                  />
                )}
              </View>
              <View style={styles.dateTimeChevronWrapper}>
                <Image
                  source={icons.sort_down}
                  style={styles.dateTimeChevron}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
              }}>
              {toDate == '' && validate ? (
                <Text style={{color: 'red', marginLeft: 25, marginTop: 5}}>
                  * Vui lòng chọn ngày về
                </Text>
              ) : new Date(toDate)?.getTime() - new Date().getTime() < 0 ? (
                <Text style={{color: 'red', marginLeft: 25, marginTop: 5}}>
                  * Vui lòng chọn ngày về lớn hơn hiện tại
                </Text>
              ) : new Date(toDate)?.getTime() - new Date(fromDate)?.getTime() <
                0 ? (
                <Text style={{color: 'red', marginLeft: 25, marginTop: 5}}>
                  * Vui lòng chọn ngày về lớn hơn ngày đi
                </Text>
              ) : null}
            </View>
          </View>
        )}

        {/* choose service */}
        {/* <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10
            }}>
            <TouchableOpacity
              style={styles.dateTimeWrapper}
              // onPress={}
            >
              <View style={styles.dateTimeWrapperCalendar}>
                <Image
                  style={styles.dateTimeCalendar}
                  source={icons.service_client}
                />
              </View>
              <View style={{flex: 0.95}}>
                <Text 
                  style={{
                    color: COLORS.black,
                    fontSize: 14,
                    marginLeft: 20,
                    fontWeight: '400'
                  }}
                >
                  {selectedValue}
                </Text>
              </View>
              <View style={styles.dateTimeChevronWrapper}>
                <Image
                  source={icons.sort_down}
                  style={styles.dateTimeChevron}
                />
              </View>
            </TouchableOpacity>
            <View style={{
              width: '100%'
            }}>
              {
                fromDate == '' &&  validate? 
                <Text style={{color: 'red', marginLeft: 25, marginTop: 5}}>*Vui lòng chọn ngày đi</Text>
                :
                null
              }
            </View>
          </View> */}

        {/* //----------book car-----------// */}

        <View
          style={{
            marginTop: 10,
            flex: 0.72,
            width: SIZES.width,
            alignItems: 'center',
          }}>
          <View
            style={{
              marginTop: 10,
              width: SIZES.width * 0.87,
            }}>
            <Text
              style={{
                color: COLORS.black,
                fontSize: SIZES.body2,
                fontWeight: 'bold',
              }}>
              Chọn xe
            </Text>
            {choosenCar.quantity == 0 && validate ? (
              <Text style={{color: 'red', marginLeft: 1, marginTop: 5}}>
                *Vui lòng chọn số lượng xe
              </Text>
            ) : null}
            <FlatList
              data={[...dataVehicle, {id: '69', plusImage: true}]}
              renderItem={({item}) => {
                if (item.plusImage) {
                  return (
                    <View
                      key={`${item.id}`}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {/* <View style={styles.bookCarWrapperBook}>
                        <TouchableOpacity
                          style={[
                            styles.bookCarWrapper,
                            {
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                          ]}>
                          <View
                            style={{
                              width: 60,
                              height: 60,
                              marginTop: 20,
                            }}>
                            <Image
                              style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'cover',
                                tintColor: COLORS.combobox,
                              }}
                              source={images.plus}
                            />
                          </View>

                          <Text
                            style={{
                              fontSize: SIZES.h2,
                              color: COLORS.combobox,
                              marginTop: 20,
                            }}>
                            Xe khác
                          </Text>
                        </TouchableOpacity>
                      </View> */}
                    </View>
                  );
                }
                return (
                  <View>
                    <RenderItem item={item} />
                  </View>
                );
              }}
              keyExtractor={item => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Header
          title={'Đặt xe ngay'}
          onPress={() => navigation.goBack()}
          styleArrow={{display: 'none'}}
        />
      </SafeAreaView>
      <ScrollView style={{marginBottom: '35%'}}>{RenderBody()}</ScrollView>
      <View style={{zIndex: 2}}>
        <HotLine />
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 20,
          backgroundColor: 'white',
          alignItems: 'center',
          position: 'absolute',
          bottom: Platform === 'ios' ? '30%' : '15%',
          top: '81%',
          zIndex: 1,
        }}>
        <View
          style={{
            width: '87%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Button
            buttonTitle={'Đặt Xe'}
            onPress={() => {
              if (
                fromLocation == '' ||
                toLocation == '' ||
                fromDate == '' ||
                choosenCar.quantity == 0 ||
                myItem.distance == '0 m' ||
                new Date(FfoDate)?.getHours() - new Date().getHours() < 1 ||
                new Date(toDate)?.getTime() - new Date().getTime() < 0
              ) {
                console.log('ok1');
                setValidate(true);
              } else {
                setValidate(false);
                console.log('ok', FfoDate);
                navigation.navigate('CarInformation', {
                  fromLocation,
                  toLocation,
                  checked,
                  fromDate,
                  toDate,
                  carName: choosenCar.name,
                  carId: choosenCar.id,
                  quantity: choosenCar.quantity,
                  fromLat,
                  fromLng,
                  toLat,
                  fromLat,
                  distance: myItem.distance,
                  userNote: '',
                });
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default BookVehicle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    position: 'relative',
  },

  //-------body--------//

  bodyContainer: {
    flex: 1,
  },

  //------Choose Location-------//
  chooseLocation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.height * 0.02,
  },
  chooseLocationLeft: {},
  chooseLocationCenter: {},
  chooseLocationRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  //---------radioButton---------//
  radioButtonWrapper: {
    width: SIZES.width,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //----------date-time---------//
  dateTimeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.input,
    height: 42,
    borderRadius: 10,
    borderRadius: 5,
    borderWidth: 0.2,
    borderColor: COLORS.primary,
  },
  dateTimeWrapperCalendar: {
    height: 'auto',
    width: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cee2ed',
    alignItems: 'center',
  },

  dateTimeCalendar: {
    flex: 1,
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },

  dateTimeInput: {
    marginLeft: 20,
    height: '100%',
  },

  dateTimeChevronWrapper: {
    height: 15,
    width: 15,
  },
  dateTimeChevron: {
    flex: 1,
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },

  //----------book-car---------//
  bookCarWrapperBook: {
    width: 156,
    height: 206,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginRight: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bookCarWrapper: {
    width: 150,
    height: 200,
    borderColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: 10,
  },
  bookCarImage: {
    width: '100%',
    height: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookCarTitle: {
    fontWeight: '400',
    fontSize: SIZES.body2,
    color: COLORS.black,
  },
  bookCarPrice: {
    fontSize: SIZES.body3,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  bookCarWrapperChoosen: {
    width: 150,
    height: 200,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
  },
  bookCarTitleChoosen: {
    fontWeight: '400',
    fontSize: SIZES.body2,
    color: COLORS.white,
  },
  bookCarPriceChoose: {
    fontSize: SIZES.body3,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  shadowBlue: {
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,

    elevation: 4,
    marginLeft: 5,
  },
});
