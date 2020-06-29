import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import {Avatar, Card, Paragraph, Subheading} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';

const Word = ({route, navigation}) => {

    const {colors} = useTheme();
    const theme = useTheme();

    const {id, name, meaning, date, partsOfSpeech, sentence, synonymDtos} = route;

    const writeToClipboard = async (word) => {
        await Clipboard.setString(word.name);
        Alert.alert('Copied to Clipboard!');
    };

    return (
        <Card style={{marginHorizontal: 12, marginVertical: 10}}>

            <Card.Title
                title={route.params.name}
                subtitle={route.params.partsOfSpeech}
                left={(props) => <Avatar.Text size={32} label={route.params.name.charAt(0)}/>}
                right={
                    (props) => <Text style={{marginRight: 10, color: colors.text}}
                                     onPress={() => writeToClipboard(route.params.name)}>
                        <Icon name="ios-copy" size={24}/>
                    </Text>
                }
                subtitleStyle={{fontSize: 16}}/>

            <View style={{height: 2.5, marginHorizontal: 20, backgroundColor: colors.background}}/>

            <Card.Content style={{marginTop: 10, marginLeft: 5}}>
                <Text>Meaning</Text>
                <Subheading style={styles.textStyle}>{route.params.meaning}</Subheading>

                <Text>Sentence</Text>
                <Subheading style={styles.textStyle}>{route.params.sentence}</Subheading>

                <Paragraph>Synonyms</Paragraph>

                <View style={{marginLeft: 10}}>
                    {route.params.synonymDtos.map((synonym, index) => (
                        <View key={index} style={{flexDirection: 'row', marginVertical: 3}}>
                            <Text>
                                <Icon name="ios-arrow-forward" size={18}/>
                            </Text>
                            <Text style={{marginLeft: 10}}>{synonym.word}</Text>
                        </View>
                    ))}
                </View>

            </Card.Content>

        </Card>
    );
};

const styles = StyleSheet.create({
    container: {},
});

export default Word;
