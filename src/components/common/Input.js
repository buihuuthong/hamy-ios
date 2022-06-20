import React from 'react';
import {View, TextInput, StyleSheet, Image} from 'react-native';
import {icons, SIZES} from '../../constants';

const FormInput = ({
  labelValue,
  placeholderText,
  onChangeText,
  onChange,
  style,
  ...rest
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.margin}>
        <TextInput
          value={labelValue}
          numberOfLines={1}
          placeholder={placeholderText}
          placeholderTextColor="#666"
          onChangeText={onChangeText}
          style={style}
          {...rest}
        />
      </View>
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    borderRadius: 20,
    padding: SIZES.width <= 360 ? 1 : 5,
  },
  margin: {
    width: '100%',
  },
});
