import React, { useState } from 'react';
import {View, TextInput, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {COLORS, icons, SIZES} from '../../constants';

const Input = ({
  labelValue,
  placeholderText,
  onChangeText,
  onChange,
  style,
  myOnPress,
  myTouchStyle,
  myOnPressDelete,
  isEmpty,
  ...rest
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.margin}>
        <TextInput
        editable
          value={labelValue}
          numberOfLines={1}
          placeholder={placeholderText}
          placeholderTextColor="#666"
          onChangeText={onChangeText}
          style={[style, {color: COLORS.black, paddingRight: 50, paddingLeft: 10}]}
          {...rest}
        />
      </View>
      {
        isEmpty ?   
        <TouchableOpacity 
          style={[styles.locationInputWrapper, myTouchStyle]}
          onPress={myOnPress}
        >
          <Image resizeMode='contain' source={icons.locationInput} style={styles.styleImage} />
        </TouchableOpacity>
        :
        <TouchableOpacity 
          style={[styles.locationInputWrapper, myTouchStyle]}
          onPress={myOnPressDelete}
        >
          <Image resizeMode='contain' source={icons.cancle} style={[styles.styleImage, {
            width: '40%',
            height: '40%'
          }]} />
        </TouchableOpacity>
      }
      
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    borderRadius: 20,
    padding: SIZES.width <= 360 ? 1 : 5,
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  margin: {
    width: '100%',
  },
  styleImage: {
    width: '50%',
    height: '50%',
    marginRight: 10
  },
  locationInputWrapper: {
    height: SIZES.width * 0.12,
    width: SIZES.width * 0.13,
    // backgroundColor: 'black',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    top: 0,
    right: 0,
    zIndex: 0
  },
});
