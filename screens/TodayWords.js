import React, {useEffect, useState} from 'react';
import {FlatList, Keyboard, Modal, RefreshControl, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Appbar, Avatar, Card, Headline, Paragraph, Subheading, Text} from 'react-native-paper';

import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import Clipboard  from "@react-native-community/clipboard";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//import WordForm from './WordForm';
import {fetchWordsForToday} from '../api/endpoints';
import {getDateAsString, showToast} from '../commons/CommonUtils';
import Loading from '../components/Loading';
import Toast from 'react-native-simple-toast';
import {globalStyles} from "../styles/global";

const TodaysWords = (props) => {

    let [words, setWords] = useState([]);
    let [wordsLoading, setWordsLoading] = useState(false);

    useEffect(() => {

        console.log("TodayWords Use Effect, Fetch Words");
        fetchTodaysWords();

    },[]);

    const {colors} = useTheme();
    const theme = useTheme();

    const [refreshing, setRefreshing] = React.useState(false);
    const [modal, setModal] = useState(false);
    const [text, setText] = useState("");

    const fetchTodaysWords = () => {
        let params = {};
        setWordsLoading(true);
        params.date = getDateAsString(new Date());

        fetchWordsForToday(params).then(res => {
            if(res.data.success){
                setWordsLoading(false);
                setWords(res.data.data);
                // console.log("Words For Today", res.data.data);
            } else {
                showToast(res.data.errorMessage);
                setWordsLoading(false);
            }
        }).catch(err=>{
            setWordsLoading(false);
        });
    }

    const onRefresh = () => {
        setRefreshing(true);
        fetchTodaysWords();
        setRefreshing(false);
    };

    const writeToClipboard = async (word) => {
        await Clipboard.setString(word.name);
        alert('Copied to Clipboard!');
    };

    const hideModal = () => {
        setModal(false);
    };
    const showModal = () => {
        setModal(true);
    };

    const listEmptyView = () => {
        return (
            <View style={globalStyles.emptyContainer}>
                <View style={{alignItems:'center', justifyContent:'center'}}>
                    <Headline style={{textAlign: 'center', textAlignVertical: 'center'}}> Sorry, No Words are found for the current day. please check after some time</Headline>
                </View>
            </View>
        );
    };

    const renderWords = (word) => {

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
            </Card>);
    };

    if(wordsLoading)
        return <Loading/>;

    return (
        <View style={{flex: 1}}>

            <Appbar.Header style={{backgroundColor: colors.main}}>
                <Appbar.Action icon="menu" onPress={() => props.navigation.openDrawer()}/>
                <Appbar.Content title="Today Words"/>
            </Appbar.Header>

            <FlatList
                data={words}
                keyExtractor={item => item.id.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                ListEmptyComponent={listEmptyView}
                renderItem={({item}) => (
                    renderWords(item)
                )}/>


            <Modal visible={modal} animationType='slide' onRequestClose={hideModal}>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <View style={{...styles.modalContent, backgroundColor:colors.background}}>

                        <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', backgroundColor:colors.main}}>
                            <Headline style={{marginLeft:5}}>Add A Word</Headline>
                            <MaterialIcons name='close' size={24}
                                           style={{...styles.modalToggle, ...styles.modalClose, borderColor:colors.text, color: colors.text}}
                                           onPress={() => hideModal()}/>
                        </View>

                    </View>

                </TouchableWithoutFeedback>
            </Modal>

        </View>
    );
};

export default TodaysWords;

const styles = StyleSheet.create({
    textStyle: {
        marginBottom: 10,
        marginLeft: 10,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        flex: 1,
    },
    modalToggle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
        marginRight: 5,
        marginVertical:5
    },
    mainContainer: {
        alignItems:'center',
        justifyContent: 'center',
        flex:1,
        margin: 10,
        marginTop: 50,
    }
});
