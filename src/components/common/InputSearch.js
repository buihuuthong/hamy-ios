import React from 'react';
import { StyleSheet, TextInput, View, Image} from 'react-native';
import { width, height, COLORS, icons } from '../../constants';

const InputSearch = ({lableValue, placeholderText, iconType, style, ...rest}) => {
    return (
       <View style={[styles.inputContainer, style]}>
           <Image 
                source={icons.loupe}
                resizeMode='contain'
                style={{
                    width:18,
                    height:18,
                    tintColor: COLORS.grey,
                    margin: 10
                }}
            />
           <TextInput
                value={lableValue}
                style={styles.input}
                placeholder={placeholderText}
                placeholderTextColor= {COLORS.black}
                {...rest}
           />
       </View>
    )
}

export default InputSearch;

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        borderRadius: 5,
        flexDirection: "row",
        alignItems: 'center', 
        backgroundColor: COLORS.input,
    },
    input: {  
        padding: 5,
        flex: 1,
        fontSize: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
