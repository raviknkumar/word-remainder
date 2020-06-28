import React, {useState, useEffect} from 'react';

import {StyleSheet, View, TouchableWithoutFeedback, Keyboard, RefreshControl, FlatList} from 'react-native';
import {Text, Appbar, Searchbar, Headline} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {fetchWordsBySearchText} from '../api/endpoints';
import {showToast} from '../commons/CommonUtils';
import Word from '../components/Word';
import Loading from "../components/Loading";
import {globalStyles} from "../styles/global";

const SearchScreen = ({navigation}) => {

    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [wordsLoading, setWordsLoading] = useState(false);
    const [emptyText, setEmptyText] = useState("Search Words By Text");
    const [words, setWords] = useState([]);

    const hideSearchBar = () => {
        setSearchVisible(false);
        Keyboard.dismiss();
    };

    useEffect(() => {

    }, []);

    const searchForWord = () => {
        console.log("Search Text: ", searchQuery);
        if(!searchQuery || searchQuery.length < 3){
            showToast("Search text must be atleast 3 letters long");
            return;
        }

        fetchWords(searchQuery);
    };

    const fetchWords = (text) => {
        let params = {};
        params.text = text;

        resetData();

        setWordsLoading(true);
        fetchWordsBySearchText(params).then(res=>{
            if(res.data.success){
                console.log("Data ", res.data.data);
                setWords(res.data.data);
                if(res.data.data.length === 0){
                    setEmptyText("Sorry, No Words are found for the given search text");
                }
                setWordsLoading(false);
            } else {
                showToast(res.data.errorMessage);
                setWordsLoading(false);
            }
        }).catch(err => {
           showToast(err.message);
            setWordsLoading(false);
        });

    };

    const resetData = () => {
        setWords([]); // reset previous results
    };

    const listEmptyView = () => {
        return (
            <View style={globalStyles.emptyContainer}>
                <View style={{alignItems:'center', justifyContent:'center'}}>
                    <Headline style={{textAlign: 'center', textAlignVertical: 'center'}}>
                        {emptyText}
                    </Headline>
                </View>
            </View>
        );
    };

    const renderWords = (word) => {
        return <Word word={word}/>
    };

    if(wordsLoading)
        return <Loading/>;

    return (

        <TouchableWithoutFeedback onPress={hideSearchBar}>
        <View style={styles.container}>
                    <Appbar.Header>

                        {!searchVisible && <Appbar.Content title="Search" subtitle={'Subtitle'}/>}

                        {searchVisible &&
                            <Animatable.View animation="fadeInRight" duration={500} style={{width: '90%', justifyContent: 'flex-end'}}>
                                <Searchbar
                                    placeholder="Search"
                                    onChangeText={text => setSearchQuery(text)}
                                    value={searchQuery}
                                    onIconPress={searchForWord}
                                />
                            </Animatable.View>
                        }

                        <Appbar.Action icon={searchVisible ? "arrow-right" : "magnify"} onPress={() => {
                            setSearchVisible(!searchVisible);
                        }}/>
                    </Appbar.Header>

            <View style={{flex:1}}>

                <FlatList
                    data={words}
                    keyExtractor={item => item.id.toString()}
                    ListEmptyComponent={listEmptyView}
                    renderItem={({item}) => (
                        renderWords(item)
                    )}/>
            </View>
        </View>
        </TouchableWithoutFeedback>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
});

