import {Platform, StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    paragraph: {
        marginVertical: 8,
        lineHeight: 20,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        marginBottom: 5,
    },
    errorText: {
        color: '#FF0000',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 6,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    emptyContainer: {
        alignItems:'center',
        justifyContent: 'center',
        flex:1,
        margin: 10,
        marginTop: 50,
    }
});
