import React from 'react';
import {ScrollView, StyleSheet, Text, View, TouchableNativeFeedback, TouchableOpacity, StatusBar} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EntryPreview from '../components/EntryPreview';
import Entry from '../models/Entry';

class HomeScreen extends React.Component {
    state = {
        entries: [
            // {
            //     text: 'I need to enable user defined repeats for local notifications, for example reminders for pills every 12 hours, or every 2 days.',
            //     date: new Date(2018, 2, 15).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'Currently it is not possible because schedulingOptions param for function scheduleLocalNotificationAsync takes only string repeat with options: ‘minute’, ‘hour’, ‘day’, ‘week’, ‘month’ and ‘year’. There is no way to specify the amount of that repeat interval - for example 5 hours.',
            //     date: new Date(2018, 2, 14).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'I need to enable user defined repeats for local notifications, for example reminders for pills every 12 hours, or every 2 days.',
            //     date: new Date(2018, 2, 13).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'Currently it is not possible because schedulingOptions param for function scheduleLocalNotificationAsync takes only string repeat with options: ‘minute’, ‘hour’, ‘day’, ‘week’, ‘month’ and ‘year’. There is no way to specify the amount of that repeat interval - for example 5 hours.',
            //     date: new Date(2018, 2, 11).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'I need to enable user defined repeats for local notifications, for example reminders for pills every 12 hours, or every 2 days.',
            //     date: new Date(2018, 2, 10).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'Currently it is not possible because schedulingOptions param for function scheduleLocalNotificationAsync takes only string repeat with options: ‘minute’, ‘hour’, ‘day’, ‘week’, ‘month’ and ‘year’. There is no way to specify the amount of that repeat interval - for example 5 hours.',
            //     date: new Date(2018, 2, 9).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'I need to enable user defined repeats for local notifications, for example reminders for pills every 12 hours, or every 2 days.',
            //     date: new Date(2018, 2, 8).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'Currently it is not possible because schedulingOptions param for function scheduleLocalNotificationAsync takes only string repeat with options: ‘minute’, ‘hour’, ‘day’, ‘week’, ‘month’ and ‘year’. There is no way to specify the amount of that repeat interval - for example 5 hours.',
            //     date: new Date(2018, 2, 5).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'I need to enable user defined repeats for local notifications, for example reminders for pills every 12 hours, or every 2 days.',
            //     date: new Date(2018, 2, 3).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'Currently it is not possible because schedulingOptions param for function scheduleLocalNotificationAsync takes only string repeat with options: ‘minute’, ‘hour’, ‘day’, ‘week’, ‘month’ and ‘year’. There is no way to specify the amount of that repeat interval - for example 5 hours.',
            //     date: new Date(2018, 2, 2).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'I need to enable user defined repeats for local notifications, for example reminders for pills every 12 hours, or every 2 days.',
            //     date: new Date(2018, 2, 1).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'Currently it is not possible because schedulingOptions param for function scheduleLocalNotificationAsync takes only string repeat with options: ‘minute’, ‘hour’, ‘day’, ‘week’, ‘month’ and ‘year’. There is no way to specify the amount of that repeat interval - for example 5 hours.',
            //     date: new Date(2018, 1, 28).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'I need to enable user defined repeats for local notifications, for example reminders for pills every 12 hours, or every 2 days.',
            //     date: new Date(2018, 1, 27).getTime(),
            //     created_at: new Date().getTime()
            // },
            // {
            //     text: 'Currently it is not possible because schedulingOptions param for function scheduleLocalNotificationAsync takes only string repeat with options: ‘minute’, ‘hour’, ‘day’, ‘week’, ‘month’ and ‘year’. There is no way to specify the amount of that repeat interval - for example 5 hours.',
            //     date: new Date(2018, 1, 26).getTime(),
            //     created_at: new Date().getTime()
            // }
        ]
    }

    static navigationOptions = {
        title: 'Words',
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Words',
            headerLeft: (
                <View style={{marginLeft: 20}}>
                    <TouchableOpacity onPress={navigation.getParam('onPressSettings')}>
                        <Ionicons name="md-settings" size={25} style={{color: '#fff'}}/>
                    </TouchableOpacity>
                </View>
            ),
            headerRight: (
                <View style={{marginRight: 15}}>
                    <TouchableOpacity onPress={navigation.getParam('onPressAdd')}>
                        <Ionicons name="md-add" size={25} style={{color: '#fff'}}/>
                    </TouchableOpacity>
                </View>
            )
        }
    };

    componentDidMount() {
        this.props.navigation.setParams({
            onPressAdd: this.onPressAdd,
            onPressSettings: this.onPressSettings,
        });

        Entry._all().then(entries => {
            console.log(entries);
            this.setState({entries});
        });
    }

    onPressAdd = () => {
        this.props.navigation.navigate('AddEntryScreen');
    }

    onPressSettings = () => {
        this.props.navigation.navigate('SettingsScreen');
    }

    render() {
        return (
            <View style={styles.mainView}>
                <StatusBar backgroundColor="#2ecc71" barStyle="light-content" />

                <ScrollView>
                    {this.state.entries.map((entry, index) =>
                        <EntryPreview key={index} text={entry.text} day={new Date(entry.date).getDate().toString()} month={new Date(entry.date).getMonth()}></EntryPreview>
                    )}
                </ScrollView>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
});

export default HomeScreen;