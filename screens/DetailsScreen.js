import React, {Component} from 'react';
import {View, Text, StyleSheet ,Alert, TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {addMonthsToDate, getDateAsString, showToast} from '../commons/CommonUtils';
import {Card, Title, Paragraph, Button, Subheading} from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome'

import {fetchUser, fetchWordsByDateRange} from '../api/endpoints';
import Toast from "react-native-simple-toast";
import AvatarText from 'react-native-paper/src/components/Avatar/AvatarText';
import Loading from '../components/Loading';
import {useTheme} from '@react-navigation/native';


Array.prototype.groupBy = function(prop) {
    return this.reduce(function(groups, item) {
        const val = item[prop];
        groups[val] = groups[val] || []
        groups[val].push(item);
        return groups
    }, {})
};

export default class DetailsScreen extends Component {

    prevMonths = 3;

    constructor(props) {
        super(props);

        this.state = {
            items: {},
            startDate: "",
            currentDate: "",
            wordsLoading: false
        };
    }

    componentDidMount(): void {

        let startDate = getDateAsString(addMonthsToDate(new Date(), -this.prevMonths));
        let endDate = getDateAsString(new Date());
        this.setState({startDate: startDate, currentDate: endDate})

        let params = {};
        params.date = endDate;
        params.months = 2;

        console.log("Load Words By Date Range");
        this.setState({wordsLoading: true});

        fetchWordsByDateRange(params).then(response => {
            if(response.data.success){
                console.log("Resp Data For Words By Date Range", response.data)
                this.setState({
                    items: response.data.data.words,
                    wordsLoading: false
                })
            } else {
                showToast(response.data.errorMessage)
                this.setState({wordsLoading: false});
            }
        })
            .catch(error => {
                console.log(error);
                showToast(error.message);
                this.setState({wordsLoading: false});
            });

        // let sampleData = this.getSampleData();
        // this.setState({items:sampleData.data.words});
    }

    render() {

        if(this.state.wordsLoading)
            return <Loading/>;

        return (
            <View style={{flex:1}}>
                <Agenda
                    items={this.state.items}
                    loadItemsForMonth={this.loadItems.bind(this)}
                    selected={this.state.currentDate}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    renderEmptyData={this.renderEmptyData.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    minDate={this.state.startDate}
                    maxDate={this.state.currentDate}
                    pastScrollRange={this.prevMonths}
                    futureScrollRange={0}
                    hideArrows={false}
                    // markingType={'period'}
                    // markedDates={{
                    //    '2017-05-08': {textColor: '#43515c'},
                    //    '2017-05-09': {textColor: '#43515c'},
                    //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
                    //    '2017-05-21': {startingDay: true, color: 'blue'},
                    //    '2017-05-22': {endingDay: true, color: 'gray'},
                    //    '2017-05-24': {startingDay: true, color: 'gray'},
                    //    '2017-05-25': {color: 'gray'},
                    //    '2017-05-26': {endingDay: true, color: 'gray'}}}
                    // monthFormat={'yyyy'}
                    // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
                    //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
                    // hideExtraDays={false}
                />
            </View>
        );
    }

    loadItems(day) {

        // {"dateString": "2020-06-27", "day": 27, "month": 6, "timestamp": 1593216000000, "year": 2020}
        return this.state.items[day.dateString];
    }

    renderItem(item) {
        console.log("ItemName ", item.name, item.partsOfSpeech);
        let selectedItem = {
            ...item
        };

        return (
            <Card
                style={[styles.item, {height: item.height}]}
                onPress={()=>{this.navigateToWord(selectedItem)}}
            >
                <Card.Content style={{flexDirection:'row', justifyContent: 'space-between', alignItems:'center'}}>
                    <Title style={{textAlignVertical: 'center'}}>{item.name}</Title>
                    <AvatarText label={item.name.charAt(0)} size={32}/>
                </Card.Content>
            </Card>
        );
    }

    renderEmptyDate = (date) => {

        const emptyDate = new Date(date);
        let emptyDateAsString = getDateAsString(emptyDate);
        return (
            <Card style={styles.item}>
                <Card.Title title="No Words Found" subtitle="" />
                <Card.Content style={{flexDirection:'row'}}>
                    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <Icon name={"exclamation-triangle"} color={"red"} size={28}/>
                    </View>
                    <View style={{flex:3}}>
                        <Title>Sorry, There are no words to learn new For the date {emptyDateAsString}</Title>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    renderEmptyData = () => {
        return (
            <Card style={styles.item}>
                <Card.Title title="No Words Found" subtitle="" />
                <Card.Content style={{flexDirection:'row'}}>
                    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <Icon name={"exclamation-triangle"} color={"red"} size={28}/>
                    </View>
                    <View style={{flex:3}}>
                        <Title>Sorry, There are no words</Title>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    navigateToWord = (item) => {
        console.log("Item:", item);
        this.props.navigation.navigate('Word', {...item});
    };
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex:1,
        paddingTop: 30
    },
    container: {
        flex: 1,
    },
});
