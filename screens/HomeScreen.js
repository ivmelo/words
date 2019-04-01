import React from 'react';
import {ScrollView, Modal, Text, TouchableHighlight, StyleSheet, View, RefreshControl, TouchableOpacity, TouchableNativeFeedback, StatusBar, Vibration, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EntryPreview from '../components/EntryPreview';
import Calendar from '../components/Calendar';
import Entry from '../models/Entry';
import Migrations from '../migrations/Migrations';

var loremIpsum = require('lorem-ipsum-react-native');

function setYearMonth(year, month) {
    return (previousState, currentProps) => {
        return {
            ...previousState,
            year: year,
            month: month
        };
    };
}

class HomeScreen extends React.Component {
    state = {
        entries: [],
        refreshing: false,
        calendarModalVisible: false,
        year: 2019,
        month: new Date().getMonth(),
        monthEntriesCount: [
            null, null, null, null, null, null,
            null, null, null, null, null, null
        ],
        themeColor: '#2ecc71',
        headerTitle: 'What?'
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('headerTitle', 'Words'),
            headerStyle: {
                backgroundColor: navigation.getParam('themeColor', '#2ecc71'),
            },
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

        // this.populateEntries(new Date(2010, 0, 1), 365 * 10, true);

        // await this.updateEntriesCountByMonth();
    }

    onPressCalendar = () => {
        this.setCalendarModalVisible(true);
    }

    onPressAdd = () => {
        this.props.navigation.navigate('EntryScreen', {year: this.state.year, month: this.state.month});
    }

    onPressSettings = () => {
        this.props.navigation.navigate('SettingsScreen');
    }

    setThemeColor(color) {
        this.setState({themeColor: color});
        this.props.navigation.setParams({themeColor: color});
        // this.props.navigation.setParams({headerTitle: 'Hooray!'});
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
        Entry.find(entryId).then(async (entry) => {
            await entry.destroy();
            this.onRefresh();
        }).catch(error => console.log(error));
    }

    dateSelected(year, month, color) {
        Vibration.vibrate(4);

        let yearChanged = false;
        if (year != this.state.year) {
            yearChanged = true;
        }

        this.props.navigation.setParams({
            headerTitle: monthNames[month - 1] + ' ' + year,
        });

        // this.setThemeColor(color);

        // Only update if date has changed.
        if (year !== this.year && month - 1 !== this.month) {
            this.setState({year: year, month: month - 1}, () => {
                this.onRefresh();
            });
        }

        if (! yearChanged) {
            this.setCalendarModalVisible(false);
        }
    }

    async updateEntriesCountByMonth() {
        
        let entryCount = [];

        // this.setState({refreshing: true});

        // Set to and from dates.
        let fromYear = this.state.year;
        let toYear = this.state.year;

        for (let m = 0; m < 12; m++) {
            let fromMonth = m;
            
            let toMonth = fromMonth < 12 ? fromMonth + 1 : 0;
            toYear = fromMonth < 12 ? toYear : toYear + 1;
            
            await Entry.q()
            .where('date', '>=', new Date(fromYear, fromMonth, 1).getTime())
            .where('date', '<', new Date(toYear, toMonth, 1).getTime())
            .orderBy('date', 'desc')
            .get()
            .then(entries => {
                entryCount.push(entries.length);
            })
            .catch(err => console.log(err));
        }

        this.setState({monthEntriesCount: entryCount});
    }

    onRefresh() {
        this.setState({refreshing: true});

        // Set to and from dates.
        let fromYear = this.state.year;
        let fromMonth = this.state.month;
        
        let toYear = this.state.year;
        let toMonth = this.state.month + 1;

        if (fromMonth == 11) {
            toYear++;
            toMonth = 0;
        }

        Entry.q()
        .where('date', '>=', new Date(fromYear, fromMonth, 1).getTime())
        .where('date', '<', new Date(toYear, toMonth, 1).getTime())
        .orderBy('date', 'desc')
        .get()
        .then(entries => {
            this.setState({entries, refreshing: false});
        })
        .catch(err => console.log(err));
    }
    
    setCalendarModalVisible(visible) {
        this.updateEntriesCountByMonth();
        this.setState({calendarModalVisible: visible});
    }

    render() {
        return (
            <View style={styles.mainView}>
                <StatusBar backgroundColor={this.state.themeColor} barStyle="light-content" />

                <TouchableNativeFeedback onLongPress={() => {
                    this.setThemeColor('#5B3256');
                }} onPress={() => this.onPressAdd()} useForeground={true}  background={TouchableNativeFeedback.Ripple('#aaa', true)}>
                    <View style={[styles.floatingButton, {backgroundColor: this.state.themeColor}]}>
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
                                onSelectDate={(year, month, color) => {this.dateSelected(year, month, color)}}
                                year={this.state.year}
                                month={this.state.month}
                                monthEntries={this.state.monthEntriesCount}
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

const monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December'
];

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
