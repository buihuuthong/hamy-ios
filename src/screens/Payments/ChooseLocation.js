import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { debounce } from "lodash";
import {
  InputVehicle,
  LocationToFrom,
  Button,
  Header,
} from '../../components';
import { ActivityIndicator } from 'react-native-paper'

import {COLORS, icons, images, SIZES} from '../../constants';
import axios from 'axios';

const ChooseLocation = ({route, navigation}) => {
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [result, setResult] = useState([]);
  const [fromFocus, setFromFocus] = useState(false);
  const [toFocus, setToFocus] = useState(false);
  const [validate, setValidate] = useState(false);
  const [myItem, setMyItem] = useState({}) 
  const [clickOneTime, setClickOnceTime] = useState(false);
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    const newItem = route.params;
    console.log('newItem', newItem);
    setMyItem(newItem);
    if(newItem){
      setFromLocation(newItem.fromLocation);
      setToLocation(newItem.toLocation);
    }
  }, [])

  const RenderBody = () => {
    const [isFromEmpty, setIsFromEmpty] = useState(true);
    const [isToEmpty, setIsToEmpty] = useState(true);
    function fromOnFocus() {
      setShowModalSearch(true);
      setFromFocus(true)
      setToFocus(false)
    }

    function fromOnBlur() {
      setShowModalSearch(false);
      setFromFocus(false)
      setToFocus(true)
      setIsFromEmpty(true)
      if(!myItem.fromLat && result !== []){ 
        setFromLocation(result[0]?.description);
        callToSetFromLatLng(result[0]?.place_id);
      }
    }

    function toOnFocus() {
      setShowModalSearch(true);
      setFromFocus(false)
      setToFocus(true)
    }

    function toOnBlur() {
      setShowModalSearch(false);
      setFromFocus(true)
      setToFocus(false)
      setIsToEmpty(true)
      if(!myItem.toLat && result !== []){ 
        setToLocation(result[0].description);
        callToSetToLatLng(result[0].place_id);
      }
    }
    
    const callToSetFromLatLng = (placeId) => {
      axios
      .get(
        `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=ey43gSeqDkJBv39eLDzpGQrY9V86S2cb2ITuBc5l`,
      )
      .then((response) => {
        const myRes = response.data
        myItem.fromLat = myRes.result.geometry.location.lat;
        myItem.fromLng = myRes.result.geometry.location.lng;
        console.log('from', myItem.fromLat);
        console.log('from', myItem.fromLng);
      })
      .catch(function (err) {
        console.log('err: ', err);
      });
    }

    const callToSetToLatLng = (placeId) => {
      axios
      .get(
        `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=ey43gSeqDkJBv39eLDzpGQrY9V86S2cb2ITuBc5l`,
      )
      .then((response) => {
        const myRes = response.data
        myItem.toLat = myRes.result.geometry.location.lat;
        myItem.toLng = myRes.result.geometry.location.lng;
        
        console.log('to', myItem.toLat);
        console.log('to', myItem.toLng);
      })
      .catch(function (err) {
        console.log('err: ', err);
      });
    }

    const fromLocationDebounce = useCallback(debounce((text) => {
      console.log('ok');
      axios
      .get(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=ey43gSeqDkJBv39eLDzpGQrY9V86S2cb2ITuBc5l&input=${text}`,
      )
      .then(response => {
        const myRes = response.data.predictions;
        myRes.map(item => {
          setResult(response.data.predictions);
        });
      })
      .catch(function (err) {
        console.log('this is result: ', err);
      })
      .finally(() => {
        setLoader(false)
      });
    }, 1000), []);

    function fromLocationChange(text) {
      setLoader(true)
      setFromLocation(text);
      fromLocationDebounce(text)
      if(text){
        setIsFromEmpty(false)
      }else{
        setIsFromEmpty(true)
      }
    }

    const toLocationDebounce = useCallback(debounce((text) => {
      console.log('ok');
      axios
      .get(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=ey43gSeqDkJBv39eLDzpGQrY9V86S2cb2ITuBc5l&input=${text}`,
      )
      .then(response => {
        const myRes = response.data.predictions;
        myRes.map(item => {
          setResult(response.data.predictions);
        });
      })
      .catch(function (err) {
        console.log('this is result: ', err);
      })
      .finally(() => {
        setLoader(false)
      });
    }, 1000), []);

    function toLocationChange(text) {
      setLoader(true)
      setToLocation(text);
      toLocationDebounce(text);
      if(text){
        setIsToEmpty(false)
      }else{
        setIsToEmpty(true)
      }
    }

    return (
      <View style={styles.bodyContainer}>
        {/* //----------Choose location-----------// */}
        <View style={styles.chooseLocation}>
          <View style={[styles.chooseLocationLeft, {flex: 0.1}]}>
            <LocationToFrom />
          </View>
          <View style={[styles.chooseLocationCenter, {flex: 0.8}]}>
            <InputVehicle
              placeholderText="Tìm điểm đi"
              labelValue={fromLocation}
              style={{
                backgroundColor: COLORS.input,
                height: 42,
                borderRadius: 10,
                marginBottom: 10,
              }}
              onChangeText={text => fromLocationChange(text)}
              onFocus={() => fromOnFocus()}
              onBlur={() => fromOnBlur()}
              myOnPress={() =>
                navigation.navigate('ChooseLocationOnMap', {
                  fromLocation,
                  toLocation,
                  fromLat: myItem.fromLat,
                  fromLng: myItem.fromLng,
                  toLat: myItem.toLat,
                  toLng: myItem.toLng,
                  isTextInput: 'fromInput',
                })
              }
              isEmpty={isFromEmpty}
              myOnPressDelete={() => setFromLocation('')}
            />
            <InputVehicle
              placeholderText="Tìm điểm đến"
              labelValue={toLocation}
              style={{
                backgroundColor: COLORS.input,
                height: 42,
                borderRadius: 10,
              }}
              onChangeText={text => toLocationChange(text)}
              onFocus={() => toOnFocus()}
              onBlur={() => toOnBlur()}
              myOnPress={() =>
                navigation.navigate('ChooseLocationOnMap', {
                  fromLocation,
                  toLocation,
                  fromLat: myItem.fromLat,
                  fromLng: myItem.fromLng,
                  toLat: myItem.toLat,
                  toLng: myItem.toLng,
                  isTextInput: 'toInput',
                })
              }
              myOnPressDelete={() => setToLocation('')}
              isEmpty={isToEmpty}
            />
          </View>
        </View>
        <View
          style={{
            width: '100%',
          }}>
          {validate ? (
            <Text style={{color: 'red', marginTop: 5, marginLeft: 30}}>
              *Vui lòng chọn điểm đi, điểm đến
            </Text>
          ) : null}
        </View>
        <View
          style={{
            width: '100%',
          }}>
          {clickOneTime ? (
            <Text style={{color: 'red', marginTop: 5, marginLeft: 30}}>
              *Vui nhấn 1 lần nữa để xác nhận
            </Text>
          ) : null}
        </View>
        {/* //-----pagination-----// */}
        <View
          style={{
            width: SIZES.width,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: SIZES.width * 0.9,
              height: 3,
              backgroundColor: COLORS.primary,
              marginVertical: 10,
            }}></View>
        </View>
        {/* /--------the places------/ */}
        <View>
          {
            loader ? 
            <ActivityIndicator size="small" color={COLORS.secondary} />
            :
            null
          }
          <FlatList
            data={result}
            renderItem={({item, index}) => {
              const handleChooseLocation = () => {
                if (toFocus === false) {
                  setToLocation(item.description);
                  callToSetToLatLng(item.place_id);
                } else if (fromFocus === false) {
                  setFromLocation(item.description);
                  callToSetFromLatLng(item.place_id);
                }
              };

              return (
                <TouchableOpacity
                  key={`${index}`}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                  }}
                  onPress={() => handleChooseLocation()}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                      marginTop: 2,
                    }}>
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                      }}
                      source={icons.place}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      marginVertical: 10,
                    }}>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: SIZES.body3,
                        fontWeight: 'bold',
                      }}>
                      {item.structured_formatting.main_text}
                    </Text>
                    <Text style={{color: COLORS.grey, marginTop: 2}}>
                      {item.structured_formatting.secondary_text}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={{
        marginTop: '4%'
      }}>
        <Header
          title={'Chọn lộ trình đi'}
          onPress={() => navigation.goBack()}
          styleTitle={{marginRight: '30%'}}
        />
      </SafeAreaView>
      {RenderBody()}
      {/* //----------submit form-----------// */}
      {showModalSearch ? null : (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: 20,
            backgroundColor: 'white',
            alignItems: 'center',
            position: 'absolute',
            bottom: '5%',
            zIndex: 1,
          }}>
          <View
            style={{
              width: '87%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Button
              buttonTitle={'Tiếp tục'}
                onPress={() => {
                  if(
                    myItem.fromLat == 0 ||
                    myItem.fromLng == 0 ||
                    myItem.toLat == 0 ||
                    myItem.toLng == 0
                  ){
                    console.log('ok1');
                    setValidate(true);
                    setClickOnceTime(false)
                  }else if(
                    myItem.fromLat != 0 &&
                    myItem.fromLng != 0 &&
                    myItem.toLat != 0 &&
                    myItem.toLng != 0 
                  ){
                    setValidate(false)
                    navigation.navigate('Map', {
                      toLocation, 
                      fromLocation,
                      fromLat: myItem.fromLat,
                      fromLng: myItem.fromLng,
                      toLat: myItem.toLat,
                      toLng: myItem.toLng,
                      distance: ''
                    })
                  }
                }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default ChooseLocation;

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
    marginTop: SIZES.height * 0.0001,
  },
  chooseLocationLeft: {},
  chooseLocationCenter: {},
  chooseLocationRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
