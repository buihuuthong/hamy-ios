import React, {Component, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {COLORS, icons, SIZES} from '../../constants';
import axios from 'axios';
import {Header, InputVehicle, LocationToFrom, Button} from '../../components';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
import Geolocation from '@react-native-community/geolocation';
// edit logging messages
Logger.setLogCallback(log => {
    const { message } = log;
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
  const [myposition, setMyPosition] = useState([105.854159778, 21.028195403]);
  const [mypositionName, setMyPositionName] = useState('');
  const myItem = route.params;
  
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        setMyPosition([position.coords.longitude, position.coords.latitude])  
        getMyPosition([position.coords.longitude, position.coords.latitude])
      },
      err => {
        console.log('getCurrentPosition.error', err);
      },
      { 
        timeout: 1000,
      },
    )
  }, [])
  
  const handleUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        setMyPosition([position.coords.longitude, position.coords.latitude])  
        getMyPosition([position.coords.longitude, position.coords.latitude])
      },
      err => {
        console.log('getCurrentPosition.error', err);
      },
      { 
        timeout: 1000,
      },
    )
  }
  const getMyPosition = pickedPosition => {
    axios
      .get(
        `https://rsapi.goong.io/Geocode?latlng=${pickedPosition[1]},%20${pickedPosition[0]}&api_key=ey43gSeqDkJBv39eLDzpGQrY9V86S2cb2ITuBc5l`,
      )
      .then(response => {
        const myRes = response.data.results[0].formatted_address;
        console.log(myRes);
        setMyPositionName(myRes);
      })
      .catch(function (err) {
        console.log('err: ', err);
      });
  };

  return (
    <View style={styles.page}>
      <SafeAreaView>
        <Header
          title={'Chọn điểm trên bản đồ'}
          onPress={() => navigation.goBack()}
          styleTitle={{marginRight: '10%'}}
        />
      </SafeAreaView>
      <View style={styles.bodyContainer}>
        <View style={styles.chooseLocation}>
          <View style={[styles.chooseLocationCenter, {flex: 0.9}]}>
            <TouchableOpacity style={{zIndex: 1}}>
              <InputVehicle
                placeholderText="Chọn điểm đi/đến"
                style={{
                  backgroundColor: COLORS.input,
                  height: 42,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
                labelValue={mypositionName ? mypositionName : 'Chọn điểm'}
                editable={false}
                isEmpty={true}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          onPress={feature => {
            setMyPosition([...feature.geometry.coordinates]);
            getMyPosition([...feature.geometry.coordinates]);
            console.log(myposition);
          }}
          styleJSON={`https://tiles.goong.io/assets/goong_light_v2.json?api_key=2E6PTjM83XdVHBq6dbDaiYpQj15UTkt9wWPSHdf8`}>
          <View>
            <MapboxGL.Camera
              zoomLevel={17}
              centerCoordinate={myposition}
              animationMode={'flyTo'}
              animationDuration={0}></MapboxGL.Camera>
            <MapboxGL.PointAnnotation
              id="0"
              coordinate={myposition}
              selected={false}>
              <View
                style={{
                  height: 30,
                  width: 30,
                  backgroundColor: 'red',
                  borderRadius: 50,
                  borderColor: '#fff',
                  borderWidth: 3,
                }}
              />
              <MapboxGL.Callout
                title={`${mypositionName}`}
                containterStyle={{flex: 1, background: '#fff'}}
              />
            </MapboxGL.PointAnnotation>
          </View>
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
              if (myItem.isTextInput === 'fromInput') {
                navigation.push('ChooseLocation', {
                  fromLocation: mypositionName,
                  fromLat: myposition[1],
                  fromLng: myposition[0],
                  toLocation: myItem.toLocation,
                  toLat: myItem.toLat,
                  toLng: myItem.toLng,
                  distance: '',
                });
              } else {
                navigation.push('ChooseLocation', {
                  fromLocation: myItem.fromLocation,
                  fromLat: myItem.fromLat,
                  fromLng: myItem.fromLng,
                  toLocation: mypositionName,
                  toLat: myposition[1],
                  toLng: myposition[0],
                  distance: '',
                });
              }
            }}
            stylebtn={styles.shadowBlue}
          />
        </View>
      </View>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          zIndex: 100,
        }}
        onPress={() => handleUserLocation()}
      >
        <View
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={{
              width: '60%',
              height: '60%',
            }}
            source={icons.my_location}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  icon: {
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
    iconSize: Platform.OS === 'android' ? 1 : 0.5,
    iconOffset: [0, 5],
    textField: '2%',
    textSize: 14,
  },
  page: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 40,
    position: 'relative',
  },
  container: {
    flex: 0.9,
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
    flex: 0.1,
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
    position: 'absolute',
    top: -100,
  },

  locationFrom: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
});
