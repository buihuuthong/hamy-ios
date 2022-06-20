import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { icons, SIZES } from '../../constants'

const LocationToFrom = () => {
    return (
        <View style={styles.container}>
            <View style={styles.locationToWrapper}>    
                <Image 
                    source={icons.locationTo}
                    style={styles.locationTo}
                />
            </View>
            <View style={styles.dotWrapper}></View>
            <View style={styles.dotWrapper}></View>
            <View style={styles.dotWrapper}></View>
            <View style={styles.locationFromWrapper}>    
                <Image 
                    source={icons.locationFrom}
                    style={styles.locationFrom}
                />
            </View>
        </View>
    )
}

export default LocationToFrom

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    locationToWrapper: {
        height: 22,
        width: 22
    },

    locationTo: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain'
    },

    locationFromWrapper:{
        height: 30,
        width: 30
    },

    locationFrom: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain'
    },

    dotWrapper: {
        height: 4,
        width: 4,
        borderRadius: 10,
        borderWidth:1,
        marginVertical: 3,
        borderColor: "#333"
    },

    dot: {
        marginVertical: 2,
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain'
    },

})
