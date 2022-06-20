import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import {HotLine} from '../../components';
import {FlatList} from 'react-native-gesture-handler';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import Icon from 'react-native-vector-icons/Ionicons';
import {InputSearch} from '../../components';
import {COLORS, icons, images} from '../../constants';
import {firebase} from '@react-native-firebase/auth';
import axios from 'axios';
import {END_POINT_API, END_POINT_IMAGE} from '../../constants/endPoints';

const HomeScreen = ({route, navigation}) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nameTour, setNameTour] = useState('');
  const [refreshing, setRefreshing] = useState(true);

  const getMyTour = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          // <------ Check this line
          axios
            .get(`${END_POINT_API}tours/my`, {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            })
            .then(function (res) {
              setData(res.data);
              setRefreshing(false);
            })
            .catch(function (err) {
              console.log(err);
            })
            .finally(() => setIsLoading(false));
        });
      }
    });
  };

  useEffect(() => {
    getMyTour();
  }, []);

  const findTours = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken().then(function (idToken) {
          // <------ Check this line
          axios
            .get(`${END_POINT_API}tours/my`, {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
              params: {
                name: nameTour,
              },
            })
            .then(function (res) {
              setSearchData(res.data);
              setSearch(true);
              setRefreshing(false);
            })
            .catch(function (err) {
              console.log(err);
            })
            .finally(() => setIsLoading(false));
        });
      }
    });
  };

  const onRefresh = () => {
    setData([]);
    getMyTour();
  };

  const RenderItem = ({item, index}) => {
    return (
      <View key={index} style={styles.slideContainer}>
        <TouchableOpacity>
          <Image style={styles.slideImage} source={item.image} />
          <View style={styles.slideTitleContainer}>
            <View />
            <View style={styles.location}>
              <Icon name="location-outline" size={16} color="#fff" />
              <Text style={styles.slideTitle}>{item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const RenderItemColumn = ({item, index}) => {
    const [mark, setMark] = useState(false);
    const choseTour = () => {
      navigation.navigate('ChoseTour', {
        id: item.id,
        image: item.image,
        description: item.description,
        name: item.name,
        companyInfo: item.companyInfo,
        phone: item.phone,
        bankAccount: item.bankAccount,
        value: item.value,
        destinations: item.destinations,
        basePrice: item.basePrice,
      });
    };
    return (
      <ImageBackground
        style={styles.columnImage}
        borderRadius={10}
        source={{uri: `${END_POINT_IMAGE}${item.image}`}}>
        <TouchableOpacity
          style={styles.columnTitleContainer}
          onPress={() => choseTour()}>
          <View style={styles.columnHeader}>
            <View style={styles.columnHeaderRight}>
              <Icon name="location-outline" size={16} color="#fff" />
              <Text style={styles.slideTitle}>{item.name}</Text>
            </View>
            <TouchableOpacity onPress={() => setMark(!mark)}>
              <Icon
                name={mark ? 'bookmark-sharp' : 'bookmark-outline'}
                size={25}
                color={mark ? '#ff0000' : '#fff'}
              />
            </TouchableOpacity>
          </View>
          <View />
          <View style={styles.messageContainer}>
            <Text numberOfLines={4} style={{color: '#fff'}}>
              {item.description}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
              {item.basePrice} đ
            </Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    );
  };

  const BgHeader = () => {
    const [haveNotify, setHaveNotify] = useState(true);
    return (
      <ImageBackground
        source={images.banner}
        style={styles.imageBgMain}
        resizeMode="cover"
        imageStyle={{
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}>
          <SafeAreaView
            style={{
              width: '90%',
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <InputSearch
              placeholderText={'Nơi bạn muốn đến?'}
              underlineColorAndroid="transparent"
              style={{
                width: '90%',
              }}
              value={nameTour}
              onChangeText={value => setNameTour(value)}
              returnKeyType="search"
              onSubmitEditing={findTours}
            />
            <TouchableOpacity style={styles.notifyWrapper}>
              <View style={styles.myBellWrapper}>
                <Image source={icons.bell} style={styles.myBell} />
              </View>
              {haveNotify ? (
                <View style={styles.haveNotification}></View>
              ) : (
                <View></View>
              )}
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </ImageBackground>
    );
  };

  const FlatListVer = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 10,
          }}>
          <View>
            <Text
              style={{
                color: '#000',
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'left',
              }}>
              Danh sách tours
            </Text>
          </View>
        </View>
        {refreshing && isLoading ? (
          <ActivityIndicator size="large" color="#6c63ff" />
        ) : (
          <FlatList
            data={search ? searchData : data}
            renderItem={({item, index}) => (
              <RenderItemColumn item={item} index={index} />
            )}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={() => {
              return (
                <View
                  style={{
                    marginBottom: 80,
                  }}
                />
              );
            }}
            refreshControl={
              <RefreshControl
                //Pull to refresh
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        )}
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: '#e7cf55'}} />
      <SafeAreaView style={styles.container}>
        <View
          style={{
            width: '100%',
            height: '30%',
          }}>
          {BgHeader()}
        </View>
        <View
          style={{
            width: '95%',
            flex: 1,
          }}>
          {FlatListVer()}
        </View>
        <HotLine />
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    height: 200,
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  imageBgMain: {
    flex: 1,
    alignItems: 'center',
    height: 195,
  },
  notifyWrapper: {
    marginLeft: 10,
    position: 'relative',
  },
  myBellWrapper: {
    height: 25,
    width: 25,
  },
  myBell: {
    flex: 1,
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  haveNotification: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    position: 'absolute',
    borderColor: COLORS.black,
    borderWidth: 0.3,
    right: 3,
    top: -3,
  },
  slideContainer: {
    marginRight: 20,
  },
  slideImage: {
    width: 120,
    height: 200,
    borderRadius: 10,
  },
  slideTitleContainer: {
    position: 'absolute',
    flexDirection: 'column',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  location: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  columnImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  columnTitleContainer: {
    width: '100%',
    backgroundColor: 'rgba(33, 33, 33, 0.5)',
    height: '100%',
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  columnHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageContainer: {
    paddingHorizontal: 10,
  },
  priceContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  dateTimeContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});
