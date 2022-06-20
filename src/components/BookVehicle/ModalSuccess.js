import React, {useEffect} from 'react';
import {View, StyleSheet, Modal, Text, Animated, Image} from 'react-native';

import {images} from '../../constants';
import {COLORS, SIZES} from '../../constants';

const ModalPoup = ({visible, children, style}) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={[styles.modalBackGround]}>
        <Animated.View
          style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const ModalSuccess = ({visible}) => {
  return (
    <View>
      <ModalPoup visible={visible}>
        <View
          style={{
            height: '40%',
            width: '40%',
          }}>
          <Image
            source={images.tick}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </View>
        <View style={{
          paddingHorizontal: '10%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: SIZES.h1,
            fontWeight: 'bold',
            color: COLORS.black,
            paddingVertical: 10
          }}>Thành công</Text>
          <Text style={{
            fontSize: SIZES.body3,
            color: COLORS.black
          }}>
            Cảm ơn bạn đã sử dụng dịch vụ.
          </Text>
          <Text style={{
            fontSize: SIZES.body3,
            color: COLORS.black
          }}> Vui lòng kiểm tra lại Gmail.</Text>
        </View>
      </ModalPoup>
    </View>
  );
};

export default ModalSuccess;

const styles = StyleSheet.create({
  iconWrapperBorder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: SIZES.width * 0.15,
    height: SIZES.width * 0.15,
    borderRadius: SIZES.width * 0.75,
    padding: 10,
    zIndex: 1,
  },

  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    height: '35%',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 10
  },
});
