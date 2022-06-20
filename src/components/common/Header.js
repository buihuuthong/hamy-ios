import React from 'react'
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity, 
  Image
} from 'react-native'
import { COLORS, icons, SIZES } from '../../constants'

const Header = ({title, onPress, styleTitle, styleArrow}) => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={[styles.headerArrow, styleArrow]}
          onPress={onPress}
        >
          <Image source={icons.arrowLeft} style={styles.headerArrowIcon} />
        </TouchableOpacity>
        <View style={[styles.headerTextWrapper, styleTitle]}>
            <Text style={styles.headerTex}>{title}</Text>
        </View>
      </View>
    )
}

export default Header

const styles = StyleSheet.create({
      //-------header--------//
  headerContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: SIZES.width,
    marginBottom: 15,
    marginTop: 15
  },
  headerArrow: {
    position: 'absolute',
    width: SIZES.width * 0.18,
    height: SIZES.width * 0.18,
    padding: 10,
    left: 10,
  },
  headerArrowIcon: {
    flex: 1,
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  headerTex: {
    fontSize: SIZES.h2,
    color: COLORS.black,
    fontWeight: 'bold',
  },

})
