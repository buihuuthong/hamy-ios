import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {COLORS, icons, images, SIZES} from '../../constants';
import moment from 'moment';
import {firebase} from '@react-native-firebase/auth';
import axios from 'axios';
import {END_POINT_API} from '../../constants/endPoints';

const InfoBookVehicle = ({route, navigation}) => {
  function formatCash(str) {
    const newStr = str
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ',') + prev;
      });
    return newStr + 'đ';
  }
  const [modalVisible, setModalVisible] = useState(false);

  const myItem = route.params.item;

  const handleCancle = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          axios
            .put(
              `${END_POINT_API}orders/my`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
                params: {
                  id: myItem.id,
                },
              },
            )
            .then(function (response) {
              console.log('ok');
              navigation.navigate('History');
            })
            .catch(function (err) {
              console.log(myItem);
              console.log('err: ', err);
            });
        });
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{width: '25%'}}>
            <IonIcon name="arrow-back-outline" style={styles.backIcon} />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
            }}>
            <Text style={styles.headerText}>Thông tin đặt xe</Text>
          </View>
          <View style={{width: '25%'}} />
        </View>
        <View>
          <View style={styles.boxContainer}>
            <View style={styles.paymentBox}>
              <Text style={styles.paymentText}>Thanh toán</Text>

              {myItem?.status !== 'PENDING' ? null : (
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Hủy chuyến</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.paymentBox}>
              <Text style={styles.ratesText}>Giá cước</Text>
              <Text style={styles.rates}>
                {
                  // console.log(myItem)
                  formatCash(`${(myItem?.orderDetails[0]).servicePrice}`)
                }
              </Text>
            </View>
            <View style={styles.line} />
            <View style={styles.paymentBox}>
              <Text style={styles.totalText}>Thanh toán</Text>
              <Text style={styles.total}>
                {formatCash(`${(myItem?.orderDetails[0]).finalPrice}`)}
              </Text>
            </View>
          </View>
          <View style={styles.boxContainer}>
            <View style={styles.boxHeader}>
              <Text style={styles.codeTripText}>
                Mã chuyến đi: <Text style={styles.codeTrip}>{myItem?.id}</Text>
              </Text>
              <Text style={styles.codeTripTime}>
                {`Ngày đón: ${moment(myItem.fromDateTime).format(
                  `DD/MM/YYYY  hh:mm`,
                )}`}
              </Text>
            </View>
            <View style={styles.line} />
            <View style={styles.boxItem}>
              <View style={{width: '5%', alignItems: 'center'}}>
                <Image source={icons.locationTo} />
              </View>
              <View style={{width: '80%'}}>
                <Text style={styles.fromTextTitle}>Điểm đón</Text>
                <Text style={styles.fromText}>{myItem.fromName}</Text>
              </View>
            </View>
            <View style={styles.boxItem}>
              <View style={{width: '5%', alignItems: 'center'}}>
                <Image source={icons.locationFrom} />
              </View>
              <View style={{width: '80%'}}>
                <Text style={styles.fromTextTitle}>Điểm đến</Text>
                <Text style={styles.fromText}>{myItem.toName}</Text>
              </View>
            </View>
          </View>
          <View style={styles.boxContainer}>
            <View style={styles.boxHeader}>
              <Text style={styles.Info}>Thông tin khách hàng</Text>
            </View>
            <View style={styles.boxInfo}>
              <Text style={styles.textInfoRight}>Họ và tên</Text>
              <Text style={styles.textInfoLeft}>{myItem.userName}</Text>
            </View>
            <View style={styles.boxInfo}>
              <Text style={styles.textInfoRight}>Số điện thoại</Text>
              <Text style={styles.textInfoLeft}>{myItem.userPhone}</Text>
            </View>
            <View style={styles.boxInfo}>
              <Text style={styles.textInfoRight}>Email</Text>
              <Text style={styles.textInfoLeft}>{myItem.userEmail}</Text>
            </View>
          </View>
          <View style={styles.boxContainer}>
            <View style={styles.boxHeader}>
              <Text style={styles.Info}>Ghi chú</Text>
            </View>
            <View style={styles.boxInfo}>
              <Text style={styles.textNote}>{myItem.userNote}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* ----Modal---- */}
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
              <Text style={styles.cancelFlight}>Xác nhận hủy chuyến</Text>
            </View>
            <View style={styles.line1} />
            <View style={styles.bottomButtonView}>
              <TouchableOpacity
                onPressIn={() => setModalVisible(!modalVisible)}
                style={styles.boxModal}>
                <Text style={styles.cancel}>Hủy</Text>
              </TouchableOpacity>
              <View style={styles.line2} />
              <TouchableOpacity
                style={styles.boxModal}
                onPress={() => handleCancle()}>
                <Text style={styles.confirm}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default InfoBookVehicle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backIcon: {
    fontSize: 30,
    padding: 20,
    color: '#6C63FF',
  },
  headerText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  boxContainer: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
  },
  paymentBox: {
    flexDirection: 'row',
    padding: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 5,
    width: '30%',
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: 'gray',
  },
  cancelText: {
    fontSize: 12,
    color: '#FF0000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  ratesText: {
    color: 'grey',
  },
  rates: {
    fontSize: 16,
    color: '#000',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'grey',
    marginVertical: 5,
  },
  totalText: {
    fontSize: 18,
    color: '#000',
  },
  total: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  boxHeader: {
    paddingHorizontal: 15,
  },
  boxItem: {
    flexDirection: 'row',
    padding: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  codeTripText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  codeTripTime: {
    color: 'grey',
  },
  fromTextTitle: {
    color: 'grey',
  },
  fromText: {
    color: '#000',
    fontWeight: 'bold',
  },
  boxInfo: {
    flexDirection: 'row',
    padding: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  Info: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  textInfoRight: {
    color: 'grey',
  },
  textInfoLeft: {
    color: '#000',
    fontWeight: 'bold',
  },
  textNote: {
    color: '#000',
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
    textTransform: 'uppercase',
  },
});
