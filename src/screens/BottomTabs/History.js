import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';

import {HotLine} from '../../components';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator} from 'react-native-paper';
import {firebase} from '@react-native-firebase/auth';
import moment from 'moment';
import axios from 'axios';
import {COLORS, SIZES} from '../../constants';
import {useFocusEffect} from '@react-navigation/native';
import {END_POINT_API} from '../../constants/endPoints';

const History = ({navigation}) => {
  const [historyData, setHistoryData] = useState([]);
  const [loader, setLoader] = useState(false);

  const getOrderHistoryData = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          axios
            .get(`${END_POINT_API}orders/my`, {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            })
            .then(function (response) {
              setHistoryData(prev => [...prev, ...response.data]);
              setLoader(true);
            })
            .catch(function (err) {
              console.log('err: ', err);
            })
            .finally(() => {
              setLoader(false);
            });
        });
      }
    });
  };

  const onRefresh = () => {
    setLoader(true);
    setHistoryData([]);
    getOrderHistoryData();
  };

  const renderItem = ({item}) => {
    return (
      <View key={item.id} style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemHeaderText}>
            Mã chuyến đi: <Text style={styles.itemHeaderCode}>{item.id}</Text>
          </Text>
          {
            <TouchableOpacity
              onPress={() => navigation.navigate('InfoBookVehicle', {item})}
              style={[
                styles.activeTrue,
                item.status === 'PENDING'
                  ? {backgroundColor: '#01b1ed'}
                  : item.status === 'IN_PROGRESS'
                  ? {backgroundColor: '#f6ac4b'}
                  : item.status === 'DONE'
                  ? {backgroundColor: '#92b853'}
                  : {backgroundColor: '#dd6966'},
              ]}>
              <Text style={styles.activeText}>
                {item.status === 'PENDING'
                  ? 'Đang đợi'
                  : item.status === 'IN_PROGRESS'
                  ? 'Đang xử lý'
                  : item.status === 'DONE'
                  ? 'Đã xong'
                  : 'Đã hủy'}
              </Text>
            </TouchableOpacity>
          }
        </View>
        <View style={styles.lineWrapper}>
          <View style={styles.line}></View>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Image
              source={require('../../assets/icon/Android/drawable-hdpi/car.png')}
              style={styles.iconCar}
            />
            <Text style={styles.footerText}>
              {item.orderDetails[0].vehicleName}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Image
              source={require('../../assets/icon/Android/drawable-hdpi/calendar.png')}
              style={styles.icon}
            />
            <Text style={styles.footerText}>
              {moment(item.toDateTime).format(`DD/MM/yyyy | HH:mm`)}
            </Text>
          </View>

          <View style={styles.footerItem}>
            <Image
              source={require('../../assets/icon/Android/drawable-hdpi/location.png')}
              style={[styles.icon, {width: 22, height: 22}]}
            />
            <Text style={styles.footerText}>{item.fromName}</Text>
          </View>

          <View style={styles.footerItem}>
            <Image
              source={require('../../assets/icon/Android/drawable-hdpi/locationto.png')}
              style={styles.iconTo}
            />
            <Text style={styles.footerText}>{item.toName}</Text>
          </View>
        </View>
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      console.log('onRefresh');
      onRefresh();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 15,
          }}>
          <Text style={styles.headerText}>Lịch sử đặt xe</Text>
        </View>
      </View>
      <FlatList
        data={historyData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListFooterComponent={() => {
          return (
            <View
              style={{
                marginBottom: 80,
              }}
            />
          );
        }}
      />
      {loader ? (
        <View
          style={{
            position: 'absolute',
            height: SIZES.height,
            width: SIZES.width,
            backgroundColor: COLORS.white,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="small" color={COLORS.secondary} />
        </View>
      ) : null}

      <HotLine />
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  backIcon: {
    fontSize: 30,
    padding: 20,
    color: '#6C63FF',
  },
  headerText: {
    fontSize: SIZES.h2,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  itemContainer: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  itemHeader: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemHeaderText: {
    fontSize: 16,
    color: '#000',
  },
  itemHeaderCode: {
    fontWeight: 'bold',
  },
  lineWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: '98%',
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, .3)',
    marginVertical: 5,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  iconCar: {
    width: 25,
    height: 20,
    tintColor: '#000',
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: '#000',
  },
  iconTo: {
    width: 25,
    height: 25,
  },
  footerText: {
    color: '#000',
    marginLeft: 20,
    paddingRight: 34,
  },
  activeTrue: {
    padding: 5,
    width: '25%',
    borderRadius: 5,
    alignItems: 'center',
  },
  activeFalse: {
    backgroundColor: '#ff0000',
    padding: 5,
    width: '25%',
    borderRadius: 5,
    alignItems: 'center',
  },
  activeText: {
    color: '#fff',
  },
});
