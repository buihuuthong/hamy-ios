import React, { useEffect, useState } from "react";
import { Modal, Text, View } from "react-native";
import moment from "moment";
import { COLORS, SIZES } from "../../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import DatePicker from 'react-native-date-picker'

const StartDatetimePicker = ({firsValue, hideDatePicker, visible, parentCallback, formatDate}) => {
  
  const [date, setDate] = useState(new Date());
  const [text, setText] = useState(firsValue);
  
  const onChange = (selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setText(moment(currentDate).format(`DD/MM/yyyy | HH:mm`))
    parentCallback(moment(currentDate).format(`YYYY-MM-DDTHH:mm:ss`))
    formatDate(new Date(currentDate).toLocaleString())
  };
  return (
    <View>
      <Text style={{marginLeft: 20, color: COLORS.black}}>{text}</Text>
      <DatePicker
        modal
        locale='vi'
        open={visible}
        date={date}
        onConfirm={(date) => {
          hideDatePicker()
          onChange(date)
        }}
        onCancel={() => {
          hideDatePicker()
        }}
      />
    </View>
  );
};

export default StartDatetimePicker;