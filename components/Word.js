import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Avatar, Card, Paragraph, Subheading} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import {writeToClipboard} from "../commons/CommonUtils";

const Word = ({word}) => {

    const {colors} = useTheme();
    const theme = useTheme();

    return (
        <Card style={{marginHorizontal: 12, marginVertical: 10}}>

            <Card.Title
                title={word.name}
                subtitle={word.partsOfSpeech}
                left={(props) => <Avatar.Text size={32} label={word.name.charAt(0)}/>}
                right={
                    (props) => <Text style={{marginRight: 10, color: colors.text}}
                                     onPress={() => writeToClipboard(word)}>
                        <Icon name="ios-copy" size={24}/>
                    </Text>
                }
                subtitleStyle={{fontSize: 16}}/>

            <View style={{height: 2.5, marginHorizontal: 20, backgroundColor: colors.background}}/>

            <Card.Content style={{marginTop: 10, marginLeft: 5}}>
                <Text>Meaning</Text>
                <Subheading style={styles.textStyle}>{word.meaning}</Subheading>

                <Text>Sentence</Text>
                <Subheading style={styles.textStyle}>{word.sentence}</Subheading>

                <Paragraph>Synonyms</Paragraph>

                <View style={{marginLeft: 10}}>
                    {word.synonymDtos.map((synonym, index) => (
                        <View key={synonym.id} style={{flexDirection: 'row', marginVertical: 3}}>
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
