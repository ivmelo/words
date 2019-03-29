import React from 'react';
import {ScrollView, Modal, Text, TouchableHighlight, StyleSheet, View, RefreshControl, TouchableOpacity, TouchableNativeFeedback, StatusBar, Vibration, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EntryPreview from '../components/EntryPreview';
import Calendar from '../components/Calendar';
import Entry from '../models/Entry';
import Migrations from '../migrations/Migrations';
import {SQLite} from 'expo';

var loremIpsum = require('lorem-ipsum-react-native');


class HomeScreen extends React.Component {
    state = {
        entries: [],
        refreshing: false,
        calendarModalVisible: false,

        year: 2019,
        month: new Date().getMonth(),
        monthEntries: [
            0,
            17,
            16,
            14,
            29,
            22,
            12,
            15,
            17,
            29,
            24,
            23
        ]
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Mar 2019',
            headerLeft: (
                <TouchableOpacity onPress={navigation.getParam('onPressSettings')}>
                    <View style={{marginLeft: 10, width: 40, height: 40, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name="md-settings" size={25} style={{color: '#fff'}}/>
                    </View>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity onPress={navigation.getParam('onPressCalendar')}>
                    <View style={{marginRight: 10, width: 40, height: 40, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name="md-calendar" size={25} style={{color: '#fff'}}/>
                    </View>
                </TouchableOpacity>
            )
        }
    };

    didBlurSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
            this.onRefresh();
        }
    );


    async populateEntries(start = new Date(), days = 10, ovewrite = true) {
        if (ovewrite) {
            await Entry.destroyAll();
        }

        date = start;

        for (let i = 0; i < days; i ++) {
            let text = loremIpsum({
                count: Math.floor(Math.random() * Math.floor(4)),
                units: 'paragraphs'
            });

            // Create example entry.
            let entry = new Entry();
            entry.entry = text;
            entry.date = date;
            await entry.save();

            console.log(i + ' entry created.');

            // Increment 1 day.
            date.setTime(date.getTime() + 1 * 86400000);
        }

    }


    async componentDidMount() {
        this.props.navigation.setParams({
            onPressAdd: this.onPressAdd,
            onPressSettings: this.onPressSettings,
            onPressCalendar: this.onPressCalendar,
        });

        // await Migrations.wipeDatabase();
        await Migrations.run();
        // await this.populateEntries(new Date(2019, 0, 1), 5, true);

        this.onRefresh();
    }

    onPressCalendar = () => {
        this.setCalendarModalVisible(true);
    }

    onPressAdd = () => {
        this.props.navigation.navigate('EntryScreen');
    }

    onPressSettings = () => {
        this.props.navigation.navigate('SettingsScreen');
    }

    onHoldEntry(entryId) {
        Vibration.vibrate(4);

        // Works on both iOS and Android
        Alert.alert(
            'Delete entry',
            'Are you sure you want to delete the selected entry?',
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => this.deleteEntry(entryId)
                },
            ],
            {
                cancelable: true
            },
        );
    }

    onPressEntry(entryId) {
        this.props.navigation.navigate('EntryScreen', {entryId});
    }

    deleteEntry(entryId) {
        Entry.get(entryId).then(async (entry) => {
            await entry.destroy();
            this.onRefresh();
        }).catch(error => console.log(error));
    }

    onRefresh() {
        console.log('Refreshing...');
        this.setState({refreshing: true});

        Entry.all('date', 'DESC').then(entries => {
            this.setState({entries, refreshing: false});
        }).catch(error => {
            console.log(error);
        });
    }
    
    setCalendarModalVisible(visible) {
        this.setState({calendarModalVisible: visible});
    }

    render() {
        return (
            <View style={styles.mainView}>
                <StatusBar backgroundColor="#2ecc71" barStyle="light-content" />

                <TouchableNativeFeedback onPress={() => this.onPressAdd()} useForeground={true}  background={TouchableNativeFeedback.Ripple('#aaa', true)}>
                    <View style={styles.floatingButton}>
                        <Ionicons name="md-add" size={30} style={{color: '#fff'}}/>
                    </View>
                </TouchableNativeFeedback>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.calendarModalVisible}
                    onRequestClose={() => {
                        this.setCalendarModalVisible(false);
                        // Alert.alert('Modal has been closed.');
                    }}>
                    <View style={styles.outterModalView}>
                        <View style={styles.innerModalView}>
                            <Calendar 
                                onSelectDate={(year, month) => {
                                    this.setState({year: this.state.year + 1});
                                    this.setState({year: year, month: month});

                                    console.log(year + '|' + month);
                                    this.setCalendarModalVisible(false);
                                }}
                                year={this.state.year}
                                monthEntries={this.state.monthEntries}
                                >
                            </Calendar>
                        </View>
                    </View>
                </Modal>

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                        />
                    }>

                    {this.state.entries.map((entry, index) =>
                        <EntryPreview
                            key={index}
                            text={entry.entry}
                            day={new Date(entry.date).getDate().toString()}
                            month={new Date(entry.date).getMonth()}
                            onLongPress={() => this.onHoldEntry(entry.id)}
                            onPress={() => this.onPressEntry(entry.id)}>
                        </EntryPreview>
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
    floatingButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#2ecc71',
        position: 'absolute',
        bottom: 20,                                                   
        right: 20,
        elevation: 1,
    },

    /** MODALS */
    outterModalView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000080'
    },
    innerModalView: {
        width: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0
    }
});

export default HomeScreen;
