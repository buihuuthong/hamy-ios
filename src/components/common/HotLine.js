import React from 'react';
import {
  View,
  StyleSheet,
  Linking,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {COLORS, icons, images, SIZES} from '../../constants';

const ModalPoup = ({visible, children}) => {
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
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const HotLine = () => {
  // Linking.openURL(`telprompt:0975329977`)
  const [visible, setVisible] = React.useState(false);
  function onPressCall() {
    const url = 'telprompt:0975329977';
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url).catch(() => null);
      }
    });
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: SIZES.height * 0.1,
        right: 20,
      }}>
      <ModalPoup visible={visible}>
        <Text
          style={{
            fontSize: SIZES.body1,
            textAlign: 'center',
            color: COLORS.grey,
            marginBottom: 10,
          }}>
          097 5329977
        </Text>
        <View
          style={{
            flexDirection: 'row',
            borderTopWidth: 0.8,
            borderColor: COLORS.grey,
            height: 42,
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '50%',
              borderRightWidth: 0.8,
              borderColor: COLORS.grey,
            }}
            onPress={() => setVisible(prev => !prev)}>
            <Text
              style={{
                fontSize: SIZES.body2,
                color: COLORS.secondary,
                fontWeight: '500',
              }}>
              Hủy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '50%',
            }}
            onPress={() => onPressCall()}>
            <Text
              style={{
                fontSize: SIZES.body2,
                color: COLORS.secondary,
                fontWeight: '500',
              }}>
              Gọi
            </Text>
          </TouchableOpacity>
        </View>
      </ModalPoup>
      <TouchableOpacity
        style={[styles.bottomTabWrapper]}
        onPress={() => setVisible(true)}>
        <View style={[styles.iconWrapperBorder, styles.shadow]}>
          <View style={[styles.iconWrapper, styles.shadowBlue]}>
            <Image
              source={icons.phone}
              resizeMode="contain"
              style={[
                styles.iconStyle,
                styles.iconStyleSpecial,
                {
                  tintColor: 'white',
                },
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HotLine;

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
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    width: SIZES.width * 0.14,
    height: SIZES.width * 0.14,
    borderRadius: SIZES.width * 0.9,
    padding: 10,
  },

  iconStyleSpecial: {
    width: '100%',
    height: '100%',
  },

  bottomtabTextSpecial: {
    position: 'absolute',
    bottom: -30,
    fontWeight: 'bold',
    fontSize: 12,
    color: COLORS.black,
  },
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },

  shadowBlue: {
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },

  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingTop: 10,
    borderRadius: 10,
    elevation: 20,
  },
});
