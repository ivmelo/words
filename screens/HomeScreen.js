import React from 'react';
import {
    ScrollView, 
    StyleSheet, 
    View, 
    RefreshControl, 
    TouchableOpacity, 
    StatusBar, 
    Vibration, 
    Alert,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import EntryPreview from '../components/EntryPreview';
import CalendarModal from '../components/CalendarModal';
import Entry from '../models/Entry';
import Migrations from '../migrations/Migrations';

// TODO: Properly import this.
var loremIpsum = require('lorem-ipsum-react-native');

/**
 * The home and "Main" screen of the app.
 */
class HomeScreen extends React.Component {
    /**
     * Holds the state of this screen.
     */
    state = {
        entries: [],
        refreshing: false,
        calendarModalVisible: false,
        year: new Date().getFullYear(), // Starts at current year and month.
        month: new Date().getMonth(),
        numberOfLines: 5,
        markedDates: {}
    }

    /**
     * Defines the navigation options of this screen including header title, color, buttons, etc...
     */
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('headerTitle', 'Words'),
            headerStyle: {
                backgroundColor: navigation.getParam('themeColor', global.THEME_COLOR),
            },
            headerLeft: (
                <TouchableOpacity onPress={navigation.getParam('onPressSettings')}>
                    <View style={{marginLeft: 10, width: 40, height: 40, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <AntDesign name="setting" size={25} style={{color: '#fff'}}/>
                    </View>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity onPress={navigation.getParam('onPressCalendar')}>
                    <View style={{marginRight: 10, width: 40, height: 40, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <AntDesign name="calendar" size={25} style={{color: '#fff'}}/>
                    </View>
                </TouchableOpacity>
            )
        }
    };

    /**
     * Refreshes content when page is focusing.
     */
    didBlurSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
            this.onRefresh();
        }
    );

    /**
     * React Native LifeCycle. Called when component is mounted.
     */
    async componentDidMount() {
        this.props.navigation.setParams({
            onPressAdd: this.onPressAdd,
            onPressSettings: this.onPressSettings,
            onPressCalendar: this.onPressCalendar,
        });

        // -> Uncomment this line to wipe all databases and start from scratch.
        // await Migrations.wipeDatabase();

        // -> Run the SQLite migrations.
        await Migrations.run();

        // -> Create fake entries for testing.
        // this.populateEntries(new Date(2018, 0, 1), 365 * 2 + 10, true);

        // -> Update the entries counter in the calendar component.
        // await this.updateEntriesCountByMonth();
    }

    /**
     * Called when calendar menu button is pressed.
     */
    onPressCalendar = () => {
        this.setCalendarModalVisible(true);
    }

    /**
     * Called when settings menu button is pressed.
     */
    onPressSettings = () => {
        this.props.navigation.navigate('SettingsScreen');
    }

    /**
     * Called when floating add button is pressed.
     */
    onPressAdd = () => {
        this.props.navigation.navigate('EntryScreen', {
            year: this.state.year, 
            month: this.state.month,
            isEditing: true
        });
    }

    /**
     * Called when an entry is pressed.
     * 
     * @param {int} entryId The entry ID of the pressed entry.
     */
    onPressEntry(entry) {
        this.props.navigation.navigate('EntryScreen', {
            entryId: entry.id,
            entryDate: entry.date,
            isEditing: false,
        });
    }

    /**
     * Called when an entry from the list is pressed and held.
     * 
     * @param {int} entryId The entry ID of the pressed element.
     */
    onHoldEntry(entryId) {
        Vibration.vibrate(4);

        // Displays alert to confirm the deletion of the entry.
        Alert.alert(
            'Delete entry',
            'Are you sure you want to delete the selected entry?',
            [{
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => this.deleteEntry(entryId)
            }],
            {
                cancelable: true
            },
        );
    }

    /**
     * Deletes the entry with the passed id.
     * 
     * @param {int} entryId The entry id of the entry to be deleted.
     */
    deleteEntry(entryId) {
        Entry.find(entryId).then(async (entry) => {
            await entry.destroy();
            this.onRefresh();
        }).catch(error => console.log(error));
    }

    /**
     * Called when month changes in the calendar.
     * 
     * @param {int} year The selected year.
     * @param {int} month The selected month.
     */
    onMonthChange(year, month) {
        this.setState({year: year, month: month - 1});
    }

    /**
     * Updates the page title using the navigation prop. Default: App Name. Usually: Current selected month.
     * 
     * @param {string} title The string to be set as title of this page. 
     */
    updateTitle(title) {
        this.props.navigation.setParams({
            headerTitle: title,
        });
    }

    /**
     * Updates entries on the screen.
     */
    onRefresh() {
        this.setState({refreshing: true});
        this.updateTitle(monthNames[this.state.month] + ' ' + this.state.year);

        // Set to and from dates.
        let fromYear = this.state.year;
        let fromMonth = this.state.month;
        
        let toYear = this.state.year;
        let toMonth = this.state.month + 1;

        // Handles december.
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
        .catch(err => {
            console.log(err);
            this.setState({refreshing: false});
        });
    }

    /**
     * Updates markers in the calendar.
     * In this app's context, it will mark every day with an entry in the calendar.
     * 
     * @param {Array} entries 
     */
    updateCalendarMarkers() {        
        Entry.q()
        .distinct('date')
        .getArray()
        .then(entries => {
            // Convert date to ISO 8006 date and set as markedDates index.
            let markedDates = {};

            entries.forEach(entry => {
                let date = new Date(entry.date);
                let day = date.getDate() < 10 ? '0' + String(date.getDate()) : date.getDate();
                let month = (date.getMonth() + 1) < 10 ? '0' + String(date.getMonth() + 1) : (date.getMonth() + 1);
                let year = date.getFullYear();
                let isoDate = year + '-' + month + '-' + day; // YYYY-MM-DD

                markedDates[isoDate] = {
                    marked: true,
                    activeOpacity: 0,
                };
            });

            this.setState({markedDates});
        }).catch(err => {
            console.log(err);
        });
    }

    /**
     * Sets the visibility of the calendar (month/year picker).
     * 
     * @param {boolean} visible If the modal should be visible.
     */
    setCalendarModalVisible(visible) {
        if (visible) {
            this.updateCalendarMarkers();
        } else {
            this.onRefresh();
        }
        this.setState({calendarModalVisible: visible});
    }

    /**
     * React Native Render function.
     */
    render() {
        return (
            <View style={styles.mainView}>
                <StatusBar backgroundColor={global.THEME_COLOR} barStyle="light-content" />

                <TouchableOpacity 
                    style={[styles.floatingButton, {backgroundColor: global.THEME_COLOR}]}
                    onLongPress={() => {
                    Vibration.vibrate(5);
                }} onPress={() => this.onPressAdd()} useForeground={true}>
                    <Ionicons name="ios-add" size={35} style={{color: '#fff'}}/>
                </TouchableOpacity>

                <CalendarModal
                    onRequestClose={() => this.setCalendarModalVisible(false)}
                    visible={this.state.calendarModalVisible}
                    current={new Date(this.state.year, this.state.month, 1)}
                    markedDates={this.state.markedDates}
                    onMonthChange={(newDate) => this.onMonthChange(newDate.year, newDate.month)}
                    >
                </CalendarModal>

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
                            onPress={() => this.onPressEntry(entry)}
                            numberOfLines={this.state.numberOfLines}>
                        </EntryPreview>
                    )}
                </ScrollView>
            </View>
        )
    }
}

/**
 * Month names in english.
 * TODO: Localize app.
 */
const monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December'
];

/**
 * The stylesheet of this page.
 */
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
        backgroundColor: global.THEME_COLOR,
        position: 'absolute',
        bottom: 20,                                                   
        right: 20,
        elevation: 1,
    },
});

export default HomeScreen;
