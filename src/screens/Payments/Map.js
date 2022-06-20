import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import MapboxGL, {Logger} from '@react-native-mapbox-gl/maps';
import {COLORS, icons, SIZES} from '../../constants';
import axios from 'axios';
import {Header, InputVehicle, LocationToFrom, Button} from '../../components';

// edit logging messages
Logger.setLogCallback(log => {
  const {message} = log;
  if (
    message.match('Request failed due to a permanent error: Canceled') ||
    message.match('Request failed due to a permanent error: Socket Closed')
  ) {
    return true;
  }
  return false;
});

const Map = ({route, navigation}) => {
  const accessToken =
    'sk.eyJ1IjoiYmFjaHBoYW0iLCJhIjoiY2t2MHJ4c2Z5MGhpbzJucGEzanR6MTcwMSJ9.yw4ml_gIs6tZjNXnpMw1MA';
  MapboxGL.setAccessToken(accessToken);
  // const myItem = route.params;
  const [myItem, setMyItem] = useState(route.params);

  const distance = useRef(route.params.distance);

  const onFocus = () => {
    if (myItem.toLocation !== '' && myItem.fromLocation !== '') {
      navigation.navigate('ChooseLocation', {
        toLocation: myItem.toLocation,
        fromLocation: myItem.fromLocation,
        toLat: myItem.toLat,
        toLng: myItem.toLng,
        fromLat: myItem.fromLat,
        fromLng: myItem.fromLng,
        distance: distance.current,
      });
    } else {
      navigation.navigate('ChooseLocation', {
        toLat: 0,
        toLng: 0,
        fromLat: 0,
        fromLng: 0,
        distance: '',
      });
    }
  };

  const calMyDistance = () => {
    if (
      myItem.fromLat !== 0 &&
      myItem.fromLng !== 0 &&
      myItem.toLat !== 0 &&
      myItem.toLng !== 0
    ) {
      axios
        .get('https://rsapi.goong.io/DistanceMatrix', {
          params: {
            origins: `${myItem.fromLat},${myItem.fromLng}`,
            destinations: `${myItem.toLat},${myItem.toLng}`,
            vehicle: 'car',
            api_key: 'ey43gSeqDkJBv39eLDzpGQrY9V86S2cb2ITuBc5l',
          },
        })
        .then(response => {
          const myRes = response.data.rows[0].elements[0].distance.text;
          console.log(myRes);
          console.log(myRes.slice(-2));
          if (myRes.slice(-2) == 'km') {
            distance.current = myRes;
            console.log(distance.current);
          } else {
            console.log(myRes);
            distance.current = (parseInt(myRes) / 1000).toString() + ' km';
            console.log('my distance', distance.current);
          }
        })
        .catch(function (err) {
          console.log('err: ', err.message);
        });
    }
  };

  useEffect(() => {
    calMyDistance();
  }, [myItem]);

  const onSwapLocation = () => {
    const newItem = {
      toLocation: myItem.fromLocation,
      fromLocation: myItem.toLocation,
      toLat: myItem.fromLat,
      toLng: myItem.fromLng,
      fromLat: myItem.toLat,
      fromLng: myItem.toLng,
      distance: distance.current,
    };
    setMyItem(newItem);
  };

  return (
    <View style={styles.page}>
      <SafeAreaView>
        <Header
          title={'Điểm đến'}
          onPress={() => navigation.goBack()}
          styleTitle={{marginRight: '40%'}}
        />
      </SafeAreaView>
      <View style={styles.bodyContainer}>
        <View style={styles.chooseLocation}>
          <View style={[styles.chooseLocationLeft, {flex: 0.15}]}>
            <LocationToFrom />
          </View>
          <View style={[styles.chooseLocationCenter, {flex: 0.7}]}>
            <TouchableOpacity onPress={() => onFocus()}>
              <InputVehicle
                placeholderText="Nhập điểm đi"
                style={{
                  backgroundColor: COLORS.input,
                  height: 42,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
                labelValue={
                  myItem.fromLocation ? myItem.fromLocation : 'Nhập điểm đi'
                }
                editable={false}
                isEmpty={true}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onFocus()}>
              <InputVehicle
                placeholderText="Nhập điểm đến"
                style={{
                  backgroundColor: COLORS.input,
                  height: 42,
                  borderRadius: 10,
                }}
                labelValue={
                  myItem.toLocation ? myItem.toLocation : 'Nhập điểm đến'
                }
                editable={false}
                isEmpty={true}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onSwapLocation}
            style={[styles.chooseLocationRight, {flex: 0.15}]}>
            <Image source={icons.swap} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          styleJSON={`https://tiles.goong.io/assets/goong_light_v2.json?api_key=2E6PTjM83XdVHBq6dbDaiYpQj15UTkt9wWPSHdf8`}>
          {!myItem.fromLat ? null : (
            <View>
              <MapboxGL.Camera
                zoomLevel={17}
                centerCoordinate={[myItem.toLng, myItem.toLat]}
                animationMode={'flyTo'}
                animationDuration={0}></MapboxGL.Camera>
              <MapboxGL.PointAnnotation
                id="0"
                coordinate={[myItem.fromLng, myItem.fromLat]}>
                <View
                  style={{
                    height: 30,
                    width: 30,
                    backgroundColor: COLORS.secondary,
                    borderRadius: 50,
                    borderColor: '#fff',
                    borderWidth: 3,
                  }}></View>
                <MapboxGL.Callout
                  title={`${myItem.fromLocation}`}
                  containterStyle={{
                    flex: 1,
                    background: '#fff',
                  }}
                />
              </MapboxGL.PointAnnotation>
              <MapboxGL.PointAnnotation
                id="1"
                coordinate={[myItem.toLng, myItem.toLat]}>
                <View
                  style={{
                    position: 'relative',
                    zIndex: -1,
                  }}>
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                    }}>
                    <View style={[styles.locationFromWrapper]}>
                      <Image
                        source={icons.locationFrom}
                        style={styles.locationFrom}
                      />
                    </View>
                  </View>
                </View>
                <MapboxGL.Callout
                  title={`${myItem.toLocation}`}
                  containterStyle={{
                    flex: 1,
                    background: '#fff',
                  }}
                />
              </MapboxGL.PointAnnotation>
            </View>
          )}
        </MapboxGL.MapView>
      </View>
      {/* submit form */}
      <View
        style={[
          {
            position: 'absolute',
            width: '100%',
            height: 20,
            alignItems: 'center',
            position: 'absolute',
            bottom: '5%',
            zIndex: 1,
          },
        ]}>
        <View
          style={{
            width: '87%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Button
            buttonTitle={'Tiếp tục'}
            onPress={() => {
              if (
                myItem.fromLat == 0 ||
                myItem.fromLng == 0 ||
                myItem.toLat == 0 ||
                myItem.toLng == 0 ||
                !distance.current
              ) {
                console.log('ok1');
              } else {
                navigation.navigate('BookVehicle', {
                  toLocation: myItem.toLocation,
                  fromLocation: myItem.fromLocation,
                  fromLat: myItem.fromLat,
                  fromLng: myItem.fromLng,
                  toLat: myItem.toLat,
                  toLng: myItem.toLng,
                  distance: distance.current,
                });
              }
            }}
            stylebtn={styles.shadowBlue}
          />
        </View>
      </View>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 60,
    position: 'relative',
  },
  container: {
    flex: 0.84,
    width: SIZES.width,
    marginTop: 20,
    zIndex: -1,
  },
  map: {
    flex: 1,
  },
  //------Choose Location-------//
  chooseLocation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.height * 0.02,
    backgroundColor: COLORS.white,
  },
  chooseLocationLeft: {},
  chooseLocationCenter: {},
  chooseLocationRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    flex: 0.16,
    zIndex: 1,
    backgroundColor: COLORS.white,
  },
  shadowBlue: {
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 6,
  },
  locationFromWrapper: {
    height: 30,
    width: 30,
  },

  locationFrom: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
});
