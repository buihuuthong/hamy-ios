import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import { COLORS, SIZES } from '../../constants';

const ButtonLarge = ({buttonTitle, stylebtn, styleBtnText, ...rest}) => {
    return (
       <TouchableOpacity style={[styles.buttonContainer, stylebtn]} {...rest}>
           <View style={styles.stylebtnText}>
            <Text style={[styles.buttonText, styleBtnText]}>{buttonTitle}</Text>
           </View>
       </TouchableOpacity>
    )
};

export default ButtonLarge;

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 10,
    },
    stylebtnText: {
        height: SIZES.height * 0.06,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: SIZES.body2,
        fontWeight: 'bold',
    }
})
