//component này là của Thông Bùi Hữu viết
import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {END_POINT_IMAGE} from '../../constants/endPoints';
const ChoseTour = ({route, navigation}) => {
  const [mark, setMark] = useState(false);
  const {
    image,
    description,
    id,
    name,
    phone,
    bankAccount,
    companyInfo,
    value,
    basePrice,
    destination,
  } = route.params;

  useEffect(() => {
    console.log(route.params);
  }, []);

  const Chose = () => {
    navigation.navigate('BookVehicle', {
      idTour: id,
      imageTour: image,
      descriptionTour: description,
      nameTour: name,
      companyInfoTour: companyInfo,
      phoneTour: phone,
      bankAccountTour: bankAccount,
      valueTour: value,
      isFromChooseTour: true,
      basePriceTour: basePrice,
      destinationTour: destination,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{uri: `${END_POINT_IMAGE}${image}`}}
        style={styles.image}>
        <TouchableOpacity
          style={styles.buttonSaveContainer}
          onPress={() => setMark(!mark)}>
          <Icon
            name={mark ? 'bookmark-sharp' : 'bookmark-outline'}
            size={25}
            color={mark ? '#ff0000' : '#000'}
          />
        </TouchableOpacity>
      </ImageBackground>

      <ScrollView style={styles.bottomView}>
        <Text style={styles.title}>{description}</Text>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => Chose()}>
        <Text style={styles.textButton}>Đặt Tour</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChoseTour;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: 220,
  },
  bottomView: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'column',
    width: '100%',
  },
  buttonSaveContainer: {
    alignItems: 'flex-end',
    marginRight: 20,
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#6c63ff',
    padding: 15,
    width: '90%',
    position: 'absolute',
    bottom: 30,
    borderRadius: 10,
  },
  textButton: {
    color: '#fff',
    fontSize: 18,
  },
});
