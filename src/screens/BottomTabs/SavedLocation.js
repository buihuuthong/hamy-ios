import React, { useState } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  Image,
  TouchableOpacity
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import {InputSearch} from "../../components"
import { COLORS, icons, images } from '../../constants'

const DATA = [
  {
    id: '0',
    title: 'Hạ Long',
    image: images.car4Sheet,
  },
  {
    id: '1',
    title: 'Hạ Long',
    image: images.car4Sheet,
  },
  {
    id: '2',
    title: 'Hạ Long',
    image: images.car4Sheet,
  },
  {
    id: '3',
    title: 'Hạ Long',
    image: images.car4Sheet,
  },
];

const BgHeader = () => {
  const [haveNotify, setHaveNotify] = useState(true);
  return (
      <ImageBackground
        source={images.mainImage}
        style={styles.imageBgMain}
        resizeMode='cover'
        imageStyle={{  
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <SafeAreaView style={{
          width: "90%",
          marginTop: 10, 
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <InputSearch
              placeholderText={"Nơi bạn muốn đến?"}
              underlineColorAndroid="transparent"
              style={{
                width: '90%'
              }}
          />
          <TouchableOpacity style={styles.notifyWrapper}>
            <View style={styles.myBellWrapper}>
              <Image 
                source={icons.bell}
                style={styles.myBell}
              />
            </View>
            {
              haveNotify ? 
              <View style={styles.haveNotification}></View>
              :
              <View></View>
            }
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
  )
}

const FlatListHor = () => {
  return (
    <View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
       <Text>Top Trending</Text>
       <TouchableOpacity>
         <Text>View all</Text>
       </TouchableOpacity>
      </View>
      <FlatList 
        data={DATA}
        // keyExtractor={}
      />
    </View>
  )
}

const FlatListVer = () => {
  return (
    <View>
       <Text></Text>
    </View>
  )
}

const HomeScreen = () => {
  return(
    <View style={styles.container}>

      <View style={styles.imageWrapper}>
        <Text style={{
          fontSize: 36,
          color: COLORS.grey,
          fontWeight: '500'
        }}>Coming Soon</Text>
        <Image style={styles.image} source={images.development}/>
      </View>
      {/* <View style={{
        width: '100%',      
        height: "30%",
      }}>
        {BgHeader()}
      </View>
      <View style={{
          width: '100%',
          flex: 1,
          alignItems: 'center'
      }}>
        <View style={{
          width: '90%',
        }}>
          <View>
            {FlatListHor()}
          </View>
          <View>
            {FlatListVer()}
          </View>
      </View>
      </View> */}
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'relative',
  },
  imageWrapper: {
    height: 200,
    width: "100%",
    
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
  },
  notifyWrapper: {
    marginLeft: 10,
    position: 'relative'
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
    top: -3
  },

});
