import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import {Text} from 'react-native-paper';

export default class Loading extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text style={{marginLeft:20}}>Loading...</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 20,
        zIndex: 20
    }
});
