import React, {Component, useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {addMonthsToDate, getDateAsString, showToast} from '../commons/CommonUtils';
import {Card, Title, Paragraph, Button, Subheading} from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome'

import {fetchUser, fetchWordsByDateRange} from '../api/endpoints';
import Toast from "react-native-simple-toast";
import AvatarText from 'react-native-paper/src/components/Avatar/AvatarText';
import Loading from '../components/Loading';
import AsyncStorage from "@react-native-community/async-storage";


Array.prototype.groupBy = function (prop) {
    return this.reduce(function (groups, item) {
        const val = item[prop];
        groups[val] = groups[val] || []
        groups[val].push(item);
        return groups
    }, {})
};

export const DetailsScreenFc = ({navigation}) => {

    const prevMonths = 3;

    const [items, setItems] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [wordsLoading, setWordsLoading] = useState([]);

    useEffect(() => {

        console.log("UseEffect of Details Screen");
        let startDate = getDateAsString(addMonthsToDate(new Date(), -this.prevMonths));
        let endDate = getDateAsString(new Date());

        setStartDate(startDate);
        setCurrentDate(endDate);

        let params = {};
        params.date = endDate;
        params.months = 2;

        console.log("Load Words By Date Range");
        setWordsLoading(true);

        fetchWordsByDateRange(params).then(response => {
            if (response.data.success) {
                console.log("Resp Data For Words By Date Range", response.data)
                setItems(response.data.data.words);
                setWordsLoading(false);
            } else {
                showToast(response.data.errorMessage)
                setWordsLoading(false);
            }
        }).catch(error => {
            console.log(error);
            showToast(error.message);
            setWordsLoading(false);
        });
    }, []);

    const loadItems = (day) =>
    {

        // {"dateString": "2020-06-27", "day": 27, "month": 6, "timestamp": 1593216000000, "year": 2020}
        return items[day.dateString];
    }

    const renderItem = (item) =>
    {
        console.log("ItemName ", item.name, item.partsOfSpeech);
        let selectedItem = {
            ...item
        };

        return (
            <Card
                style={[styles.item, {height: item.height}]}
                onPress={() => {
                    this.navigateToWord(selectedItem)
                }}
            >
                <Card.Content style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Title style={{textAlignVertical: 'center'}}>{item.name}</Title>
                    <AvatarText label={item.name.charAt(0)} size={32}/>
                </Card.Content>
            </Card>
        );
    }

    const renderEmptyDate = (date) => {

        const emptyDate = new Date(date);
        let emptyDateAsString = getDateAsString(emptyDate);
        return (
            <Card style={styles.item}>
                <Card.Title title="No Words Found" subtitle=""/>
                <Card.Content style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon name={"exclamation-triangle"} color={"red"} size={28}/>
                    </View>
                    <View style={{flex: 3}}>
                        <Title>Sorry, There are no words to learn new For the date {emptyDateAsString}</Title>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    const renderEmptyData = () => {
        return (
            <Card style={styles.item}>
                <Card.Title title="No Words Found" subtitle=""/>
                <Card.Content style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon name={"exclamation-triangle"} color={"red"} size={28}/>
                    </View>
                    <View style={{flex: 3}}>
                        <Title>Sorry, There are no words</Title>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    const rowHasChanged = (r1, r2) =>
    {
        return r1.name !== r2.name;
    };

    const timeToString = (time) =>
    {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    const navigateToWord = (item) => {
        console.log("Item:", item);
        this.props.navigation.navigate('Word', {...item});
    };

    if (wordsLoading)
        return <Loading/>;

    return (
        <View style={{flex: 1}}>
            <Agenda
                items={items}
                loadItemsForMonth={(day)=> items[day.dateString]}
                selected={currentDate}
                renderItem={(item, firstItemInDay)=> {renderItem(item)}}
                renderEmptyDate={()=> {renderEmptyDate()}}
                renderEmptyData={()=> {renderEmptyData()}}
                rowHasChanged={(r1, r2)=>{rowHasChanged(r1, r2)}}
                minDate={startDate}
                maxDate={currentDate}
                pastScrollRange={prevMonths}
                futureScrollRange={0}
                hideArrows={false}
                hideExtraDays={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    container: {
        flex:1
    },
});
