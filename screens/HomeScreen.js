import React from 'react';
import {ScrollView, Modal, Text, TouchableHighlight, StyleSheet, View, RefreshControl, TouchableOpacity, TouchableNativeFeedback, StatusBar, Vibration, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EntryPreview from '../components/EntryPreview';
import Entry from '../models/Entry';
import { Contacts } from 'expo';
import Calendar from '../components/Calendar';
import { SQLite } from 'expo';
import EntrySQL from '../models/EntrySQL';


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
            // console.debug('didBlur', payload);
            this.onRefresh();
        }
    );

    _(name, value) {
        this.setState({[name]: value});
    }


    async componentDidMount() {
        this.props.navigation.setParams({
            onPressAdd: this.onPressAdd,
            onPressSettings: this.onPressSettings,
            onPressCalendar: this.onPressCalendar,
        });

        // this.props.navigation.navigate('SettingsScreen');



        this.onRefresh();

        // this.setCalendarModalVisible(true);
        // console.log(this.state.month);



        let results = await EntrySQL.get(1);
       
        console.log(results.created_at);

        // let results = [];

        // let db = SQLite.openDatabase('words.sqlite');

        // console.log(db);

        // console.log('a');

        // db.transaction(tx => {
        //     // tx.executeSql(
        //     //     'drop table if exists items'
        //     // , [], (a, b) => {
        //     //     console.log(a);
        //     //     console.log(b);
        //     // });

        //     // tx.executeSql(
        //     //     'create table if not exists items (id integer primary key not null, entry text not null, date integer not null, created_at integer not null, updated_at integer not null)'
        //     // , [], (a, b) => {
        //     //     console.log(a);
        //     //     console.log(b);
        //     // });


        //     // tx.executeSql(
        //     //     'insert into items (entry, date, created_at, updated_at) values (?, ?, ?, ?)'
        //     // , [
        //     //     'this is the first entry',
        //     //     new Date().getTime(),
        //     //     new Date().getTime(),
        //     //     new Date().getTime(),
        //     // ], (a, b) => {
        //     //     console.log(a);
        //     //     console.log(b);
        //     // });

        //     console.log('b');

        //     // tx.executeSql(
        //     //     'show tables'
        //     // , [], (a, b) => {
        //     //     console.log(a);
        //     //     console.log(b);
        //     // });

        //     tx.executeSql(
        //         'select * from items'
        //     , [], (a, b) => {
        //         // console.log(a);
        //         // console.log(results);

        //         console.log('c');

        //         // console.log(b.rows._array);
        //         // results = b;
        //     });
        // });

        // console.log('d');

        // console.log(results);
        

    }

    onPressCalendar = () => {
        console.log('pressed');
        this.setCalendarModalVisible(true);
    }

    onPressAdd = () => {
        this.props.navigation.navigate('AddEntryScreen');
    }

    onPressSettings = () => {
        this.props.navigation.navigate('SettingsScreen');
    }

    onHoldEntry(entry) {
        console.log('Holding...');
        Vibration.vibrate(4);

        // Works on both iOS and Android
        Alert.alert(
            'Delete entry',
            'Are you sure you want to delete the selected entry?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => this.deleteEntry(entry)
                },
            ],
            {
                cancelable: true
            },
        );
    }

    deleteEntry(entry) {
        entry.destroy().then(() => {
            this.onRefresh();
        });
    }

    onRefresh() {
        console.log('Refreshing...');
        this.setState({refreshing: true});

        // Entry.all('date', 'DESC').then(entries => {
        //     this.setState({entries, refreshing: false});
        // });

        EntrySQL.all().then(entries => {
            this.setState({entries, refreshing: false});
        })
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
                    animationType="slide"
                    transparent={true}
                    visible={this.state.calendarModalVisible}
                    onRequestClose={() => {
                        this.setCalendarModalVisible(false);
                        Alert.alert('Modal has been closed.');
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
                            onLongPress={() => this.onHoldEntry(entry)}>
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
