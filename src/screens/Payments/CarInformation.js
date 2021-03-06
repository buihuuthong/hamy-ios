import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TextInput,
  Keyboard,
} from 'react-native';
import {Header, Button, LocationToFromCommon} from '../../components';
import {COLORS, SIZES} from '../../constants';
import {firebase} from '@react-native-firebase/auth';
import axios from 'axios';
import {END_POINT_API} from '../../constants/endPoints';

const CarInformation = ({route, navigation}) => {
  const [myitem, setItem] = useState({});
  const [myPrice, setMyPrice] = useState({});

  const calOrderRequest = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          axios
            .get(`${END_POINT_API}orders/calculate`, {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
              params: {
                isRoundTrip: myitem?.checked === 'first' ? false : true,
                serviceId: 1,
                value: parseFloat(myitem.distance),
                vehicleCount: parseInt(myitem.quantity),
                vehicleId: parseInt(myitem.carId),
              },
            })
            .then(function (response) {
              console.log('CarInformation', myitem.checked);
              console.log('CarInformation', response.data);
              setMyPrice(response.data);
            })
            .catch(function (err) {
              console.log('err: ', err);
            });
        });
      }
    });
  };
  useEffect(() => {
    const newItem = route.params;
    setItem(newItem);
  }, []);

  useEffect(() => {
    if (myitem) {
      calOrderRequest();
    }
  }, [myitem]);

  function formatCash(str) {
    if (!str && str !== 0) {
      return '';
    }
    return Math.round(parseFloat(str?.toString()?.replace(/[^0-9]/g, '')))
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const RenderBody = () => {
    const [userNoteInPut2, setUserNoteInPut2] = useState('');
    const [myFocus, setMyFocus] = useState(false);

    function onFocus() {
      setMyFocus(true);
    }

    function onBlur() {
      setMyFocus(false);
    }

    function onChangeMyInPut2(text) {
      setUserNoteInPut2(text);
      myitem.userNote = text;
    }
    return (
      <ScrollView
        style={myFocus ? {marginBottom: 100} : {marginBottom: 0}}
        keyboardShouldPersistTaps="handled">
        <SafeAreaView style={{flex: 1, marginTop: '6%'}}>
          <Header
            title={'Th??ng tin gi?? xe'}
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
            {/* //----infoPlace-----// */}
            <View style={styles.infoPlace}>
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
                  <Text style={styles.infoPlaceTitle}>??i???m ??i</Text>
                  <Text style={styles.infoPlaceDescription}>
                    {myitem.fromLocation}
                  </Text>
                </View>
                <View style={[styles.infoPlaceItem]}>
                  <Text style={styles.infoPlaceTitle}>??i???m ?????n</Text>
                  <Text style={styles.infoPlaceDescription}>
                    {myitem.toLocation}
                  </Text>
                </View>
              </View>
            </View>
            {/* //----infoTour-----// */}
            <View style={styles.infoTour}>
              <View style={styles.infoTourItem}>
                <Text style={styles.infoTourItemTilte}>Kho???ng c??ch</Text>
                <Text style={styles.infoTourItemSubTilte}>
                  {myitem.distance}
                </Text>
              </View>
              <View style={styles.infoTourItem}>
                <Text style={styles.infoTourItemTilte}>Lo???i xe</Text>
                <Text style={styles.infoTourItemSubTilte}>
                  {myitem.carName}
                </Text>
              </View>
              <View style={styles.infoTourItem}>
                <Text style={styles.infoTourItemTilte}>H??nh tr??nh</Text>
                <Text style={styles.infoTourItemSubTilte}>
                  {myitem.checked === 'first' ? '1 chi???u' : '2 chi???u'}
                </Text>
              </View>
            </View>
            {/* //----totalPrice-----// */}
            <View style={styles.totalPrice}>
              <View style={{flex: 0.8}}>
                <View style={styles.totalPriceItem}>
                  <Text style={styles.totalPriceKeyItem}>S??? l?????ng xe</Text>
                  <Text style={styles.totalPriceValueItem}>
                    {myitem.quantity}
                  </Text>
                </View>
                <View style={styles.totalPriceItem}>
                  <Text style={styles.totalPriceKeyItem}>Qu??ng ???????ng</Text>
                  <Text style={styles.totalPriceValueItem}>
                    {myitem.distance}
                  </Text>
                </View>
                <View style={styles.totalPriceItem}>
                  <Text style={styles.totalPriceKeyItem}>
                    S??? ti???n ???????c gi???m
                  </Text>
                  <Text style={styles.totalPriceValueItem}>
                    {myPrice.discount
                      ? formatCash(`${myPrice.discount}`) + ' ??'
                      : '0 ??'}
                  </Text>
                </View>
                <View style={styles.totalPriceTotal}>
                  <Text style={styles.totalPriceKeyTotal}>Th??nh ti???n</Text>
                  <Text style={styles.totalPriceValueTotal}>
                    {myPrice.finalPrice
                      ? formatCash(`${myPrice.finalPrice}`) + ' ??'
                      : '0 ??'}
                  </Text>
                </View>
              </View>
              <View style={{flex: 0.8}}></View>
            </View>
            {/* //----userNote-----// */}
            <View style={styles.userNote}>
              <Text style={{paddingLeft: 2, paddingTop: 20}}>Ghi ch??</Text>
              <TextInput
                style={styles.postInput}
                value={userNoteInPut2}
                onChangeText={text => onChangeMyInPut2(text)}
                multiline={true}
                placeholder="G???i t??i tr?????c khi ?????n 10p"
                underlineColorAndroid="transparent"
                require={true}
                onSubmitEditing={Keyboard.dismiss}
                //textAlignVertical="top                                                                                                                           "
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
              />
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
            buttonTitle={'Thanh to??n'}
            stylebtn={{
              backgroundColor: 'white',
              borderWidth: 1.5,
              borderColor: COLORS.primary,
            }}
            styleBtnText={{
              color: COLORS.primary,
            }}
            onPress={() => {
              navigation.navigate('Payments', {
                fromLocation: myitem.fromLocation,
                toLocation: myitem.toLocation,
                checked: myitem.checked,
                fromDate: myitem.fromDate,
                toDate: myitem.toDate,
                carId: myitem.carId,
                quantity: myitem.quantity,
                fromLat: myitem.fromLat,
                carName: myitem.carName,
                fromLng: myitem.fromLng,
                toLat: myitem.toLat,
                fromLat: myitem.fromLat,
                userNote: myitem.userNote,
                distance: myitem.distance,
                servicePrice: myPrice.totalPrice,
                discount: myPrice.discount,
                vat: myPrice.vat,
                finalPrice: myPrice.finalPrice,
                payType: '',
              });
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default CarInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    position: 'relative',
  },

  //----infoPlace-----//
  infoPlace: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: COLORS.grey,
    flexDirection: 'row',
    paddingVertical: '5%',
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
    borderBottomWidth: 0.6,
    borderColor: COLORS.grey,
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
    fontSize: SIZES.h4,
    color: COLORS.black,
    fontWeight: '500',
  },

  //----totalPrice-----//

  totalPrice: {
    width: '100%',
    borderBottomWidth: 0.9,
    borderColor: COLORS.grey,
  },
  totalPriceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 20,
  },
  totalPriceKeyItem: {
    fontSize: SIZES.body3,
    color: COLORS.black,
  },
  totalPriceValueItem: {
    fontSize: SIZES.body2,
    color: COLORS.black,
    fontWeight: '500',
  },
  totalPriceTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginVertical: 30,
  },
  totalPriceKeyTotal: {
    fontSize: SIZES.body2,
    color: COLORS.black,
  },
  totalPriceValueTotal: {
    fontSize: SIZES.h2,
    color: 'red',
    fontWeight: '700',
  },
  //----userNote-----//
  userNote: {
    width: '100%',
  },
  postInput: {
    fontSize: 12,
    borderColor: '#42435b',
    borderWidth: 1,
    marginVertical: 20,
    borderRadius: 10,
    alignItems: 'flex-start',
    color: COLORS.black,
    paddingHorizontal: 10,
    paddingVertical: 40,
  },
});
