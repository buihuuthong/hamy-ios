import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native';
import {AuthContext} from '../../navigation/AuthProvider';
import IonIcon from 'react-native-vector-icons/Ionicons';
import auth,{firebase} from '@react-native-firebase/auth';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

import {HotLine} from '../../components';
import {END_POINT_API} from '../../constants/endPoints';

const Account = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDelete, setmodalDelete] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
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
                setUserName(res.data.name);
              })
              .catch(function (err) {
                console.log(err);
              });
          });
        }
      });
    }),
  );

  const deleteUser = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          // <------ Check this line
          console.log("Id Token: ", idToken);
          axios
            .put(`${END_POINT_API}users/disable`,{}, {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            })
            .then(function (res) {
              console.log('success');
              auth().signOut()
            })
            .catch(function (err) {
              console.log(err.response.data.code);
            });
        });
      }
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          source={require('../../assets/icon/Android/drawable-xxxhdpi/user-circle.png')}
          style={styles.userIcon}
        />
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <View style={styles.userMenuContainer}>
        <View style={styles.userMenu}></View>
        {/* <TouchableOpacity style={styles.button}>
                    <View style={styles.right}>
                        <IonIcon name="wallet-outline" style={styles.menuIcon}/>
                        <Text style={styles.menuText}>T??i kho???n ng??n h??ng</Text>
                    </View>
                    <View>
                        <IonIcon name='chevron-forward-outline' style={styles.nextIcon} />
                    </View>
                </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigation.navigate('UserInfo')}
          style={styles.button}>
          <View style={styles.right}>
            <IonIcon name="person-outline" style={styles.menuIcon} />
            <Text style={styles.menuText}>Th??ng tin t??i kho???n</Text>
          </View>
          <View>
            <IonIcon name="chevron-forward-outline" style={styles.nextIcon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setmodalDelete(true)}
          style={styles.button}>
          <View style={styles.right}>
            <IonIcon
              name="close-circle-outline"
              style={[styles.menuIcon, {color: 'red'}]}
            />
            <Text style={styles.menuText}>X??a t??i kho???n</Text>
          </View>
          <View>
            <IonIcon name="chevron-forward-outline" style={styles.nextIcon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.button}>
          <View style={styles.right}>
            <IonIcon name="log-out-outline" style={styles.menuIcon} />
            <Text style={styles.menuText}>????ng xu???t</Text>
          </View>
          <View>
            <IonIcon name="chevron-forward-outline" style={styles.nextIcon} />
          </View>
        </TouchableOpacity>
      </View>

      <HotLine />
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
              <Text style={styles.cancelFlight}>
                B???n c?? mu???n ????ng xu???t kh??ng?
              </Text>
            </View>
            <View style={styles.line1} />
            <View style={styles.bottomButtonView}>
              <TouchableOpacity
                onPressIn={() => setModalVisible(!modalVisible)}
                style={styles.boxModal}>
                <Text style={styles.cancel}>Kh??ng</Text>
              </TouchableOpacity>
              <View style={styles.line2} />
              <TouchableOpacity
                style={styles.boxModal}
                onPress={() => logout()}>
                <Text style={styles.confirm}>C??</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDelete}
        onRequestClose={() => {
          setmodalDelete(!modalDelete);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { borderColor: 'red'}]}>
            <View style={styles.headerModal}>
              <Text style={styles.cancelFlight}>
                X??c nh???n x??a t??i kho???n
              </Text>
            </View>
            <View style={styles.line1} />
            <View style={styles.bottomButtonView}>
              <TouchableOpacity
                onPressIn={() => setmodalDelete(!modalDelete)}
                style={styles.boxModal}>
                <Text style={styles.cancel}>Hu???</Text>
              </TouchableOpacity>
              <View style={styles.line2} />
              <TouchableOpacity
                style={styles.boxModal}
                onPress={() => deleteUser()}
              >
                <Text style={[styles.confirm, { color: 'red'}]}>X??c nh???n</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5D2FF',
    position: 'relative',
  },
  userInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  userIcon: {
    tintColor: '#6C63FF',
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000',
    margin: 20,
  },
  userMenuContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  userMenu: {
    margin: 5,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    margin: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  menuIcon: {
    fontSize: 25,
    color: '#6C63FF',
  },
  menuText: {
    color: '#000',
    fontSize: 14,
    marginLeft: 10,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextIcon: {
    color: '#000',
    fontSize: 20,
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
