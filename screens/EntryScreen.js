import React from 'react';
import {
    View,
    Alert,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
    KeyboardAvoidingView
} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import FormInput from '../components/FormInput';
import Entry from '../models/Entry';
import CalendarModal from '../components/CalendarModal';
import Styles from '../styles/style';
import Constants from 'expo-constants';

/**
 * The Entry screen of the app. Used to add and edit entries.
 */
class EntryScreen extends React.Component {
    /**
     * Holds the state of this screen.
     */
    state = {
        isEditing: false,
        isCalendarVisible: false,
        entry: new Entry(),
        markedDates: {},
        markedDatesCache: {},
    }

    _formInput = null;
    _scrollView = null;

    /**
     * Defines the navigation options of this screen including header title, color, buttons, etc...
     */
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('headerTitle', ''),
            headerRight: (
                <View>
                    {navigation.getParam('isEditing') ? // Initial value comes from HomeScreen.js. Will only be true when creating a new entry. When viewing an entry, editing will be disabled until user presses edit button.
                        (
                            <View style={Styles.flexDirectionRow}>
                                <TouchableOpacity onPress={navigation.getParam('onPressCalendar')}>
                                    <AntDesign name="calendar" style={[Styles.navbarIcon, Styles.marginRightLg]}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={navigation.getParam('onPressSave')}>
                                    <AntDesign name="check" style={[Styles.navbarIcon, Styles.marginRightLg]}/>
                                </TouchableOpacity>
                            </View>
                            ) : (
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <TouchableOpacity onPress={navigation.getParam('onPressDelete')}>
                                    <AntDesign name="delete" style={[Styles.navbarIcon, Styles.marginRightLg]}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={navigation.getParam('onPressEdit')}>
                                    <AntDesign name="edit" style={[Styles.navbarIcon, Styles.marginRightLg]}/>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            )
        }
    };

    /**
     * React Native LifeCycle. Called when component is mounted.
     */
    async componentDidMount() {
        this.props.navigation.setParams({
            onPressSave: this.onPressSave,
            onPressEdit: this.onPressEdit,
            onPressCalendar: this.onPressCalendar,
            onPressDelete: this.onPressDelete,
        });

        // Gets entry id from the navigation bar.
        let entryId = this.props.navigation.getParam('entryId', null);
        let entry;

        if (entryId) {
            entry = await Entry.find(entryId);
        } else {
            let template = new Date();
            let year = this.props.navigation.getParam('year', null);
            let month = this.props.navigation.getParam('month', null);
            let day = template.getDate();

            // Creates a new Entry() object based on the selected date in the previous screen.
            entry = new Entry();

            if (year == null || month == null) {
                year = template.getFullYear();
                month = template.getMonth();
            } 

            entry.date = new Date(year, month, day);
        }

        if (! entryId) {
            this.props.navigation.setParams({
                isEditing: true
            });
        }

        this.setTitle(this.getWrittenDate(entry.date));
        this.setState({
            entry, 
            isEditing: ! entryId,
        }, () => {
            if (! entryId) {
                // If creating a new entry, focus on text input.
                this._formInput.focus();
            }
        });
    }

    /**
     * Updates the page title. Default: App Name. Usually: Current selected month.
     * 
     * @param {string} title The string to be set as title of this page. 
     */
    setTitle(title) {
        this.props.navigation.setParams({
            headerTitle: title,
        });
    }

    /**
     * Updates the page title. Default: App Name. Usually: Current selected month.
     * 
     * @param {boolean} isEditing If the navbar is in edit mode.
     */
    setEditingNav(isEditing) {
        this.props.navigation.setParams({
            isEditing: isEditing,
        });
    }

    /**
     * Saves the current entry.
     */
    onPressSave = () => {
        this.saveEntry();
    }

    /**
     * Called when edit button is pressed.
     */
    onPressEdit = () => {        
        this.props.navigation.setParams({
            isEditing: true
        });
        this.setState({isEditing: true}, () => {
            // When editing an entry, focus on text input.
            this._formInput.focus();

            // Scrolls to botton after form input is focused.
            setTimeout(() => {
                this._scrollView.scrollToEnd();
            }, 250);
        });
    }

    /**
     * Called when calendar is pressed.
     */
    onPressCalendar = () => {
        this.setCalendarVisible(! this.state.isCalendarVisible);
    }

    /**
     * Called when the delete button is pressed.
     */
    onPressDelete = () => {
        // Displays alert to confirm the deletion of the entry.
        Alert.alert(
            'Delete entry',
            'Are you sure you want to delete this entry?',
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Ok', onPress: async () => {
                        let entry = this.state.entry;
                        await entry.destroy();
                        this.props.navigation.goBack();
                    }
                },
            ],
            {
                cancelable: true
            },
        );
    }

    /**
     * Called when the user picks a date in the calendar.
     * 
     * @param {Date} date 
     */
    onChangeDate(day) {
        let markedDates = JSON.parse(JSON.stringify(this.state.markedDatesCache));

        if (typeof markedDates[day.dateString] !== 'undefined') {
            markedDates[day.dateString]['selected'] = true;
            markedDates[day.dateString]['selectedColor'] = global.THEME_COLOR;
        } else {
            markedDates[day.dateString] = {
                selected: true,
                selectedColor: global.THEME_COLOR
            }
        }

        // Create a new date object with the new date to replace the current one in entry.
        let date = new Date(day.year, day.month - 1, day.day);
        let entry = this.state.entry;
        entry.date = date;

        this.setState({
        //     entry,
            markedDates
        });

        this.setTitle(this.getWrittenDate(date));
    }
    
    /**
     * Returns the date writen in English.
     * 
     * @param {Date} date the date object. 
     */
    getWrittenDate(date) {
        return monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    }

    /**
     * Sets the visibility of the calendar model.
     * 
     * @param {boolean} visible 
     */
    setCalendarVisible(visible) {
        if (visible) {
            this.updateCalendarMarkers();
        }

        this.setState({isCalendarVisible: visible});
    }

    /**
     * Updates markers in the calendar.
     * In this app's context, it will mark every day with an entry in the calendar.
     * 
     * @param {Array} entries 
     */
    updateCalendarMarkers() {        
        let entryDate = this.state.entry.getIsoDate();

        Entry.q()
        .distinct('date')
        .getArray()
        .then(entries => {
            // Convert date to ISO 8006 date and set as markedDates index.
            let markedDatesCache = {};

            entries.forEach(entry => {
                let date = new Date(entry.date);
                let day = date.getDate() < 10 ? '0' + String(date.getDate()) : date.getDate();
                let month = (date.getMonth() + 1) < 10 ? '0' + String(date.getMonth() + 1) : (date.getMonth() + 1);
                let year = date.getFullYear();
                let isoDate = year + '-' + month + '-' + day; // YYYY-MM-DD

                markedDatesCache[isoDate] = {
                    marked: true,
                    activeOpacity: 0,
                };
            });

            let markedDates = JSON.parse(JSON.stringify(markedDatesCache));
            
            if (typeof markedDates[entryDate] !== 'undefined') {
                markedDates[entryDate]['selected'] = true;
                markedDates[entryDate]['selectedColor'] = global.THEME_COLOR;
            } else {
                markedDates[entryDate] = {
                    selected: true,
                    selectedColor: global.THEME_COLOR
                }
            }

            this.setState({
                markedDates,
                markedDatesCache
            });
        }).catch(err => {
            console.log(err);
        });
    }

    /**
     * Handles saving the current entry.
     */
    saveEntry() {
        // Checks if there is content in the text field.
        if (this.state.entry.entry.trim() == '') {
            // Works on both iOS and Android.
            Alert.alert(
                'Oops!',
                'The entry content cannot be empty.',
            );
            return;
        }

        let entry = new Entry(this.state.entry);

        // If no id, the entry is being updated.
        let feedbackMsg = this.state.entry.id === null ? 'Entry saved' : 'Entry updated';

        entry.save().then(e => {
            ToastAndroid.show(feedbackMsg, ToastAndroid.SHORT);
            this.props.navigation.goBack();
        }).catch(err => console.log(err));
    }

    /**
     * React Native Render function.
     */
    render() {
        return (                
            <KeyboardAvoidingView 
                style={{flex: 1}}
                behavior={Constants.appOwnership === 'expo' ? 'height' : 'padding'}
                keyboardVerticalOffset={80} // Compensates for the navigation bar.
                > 
                
                <ScrollView 
                    style={Styles.appBackground} 
                    ref={(component) => this._scrollView = component}>
                    <FormInput
                        value={this.state.entry.entry}
                        multiline={true}
                        scrollEnabled={false}
                        numberOfLines={10}
                        editable={this.state.isEditing}
                        // autoFocus={true} // Focus input on componentDidMount.
                        placeholder="How was your day?" // TODO: Translate this.
                        onRef={(component) => this._formInput = component}
                        onChangeText={(text) => {
                            this.setState(prevState => ({
                                entry: {
                                    ...prevState.entry,
                                    entry: text
                                }
                            }))
                        }}
                    ></FormInput>
                </ScrollView>

                <CalendarModal
                    visible={this.state.isCalendarVisible}
                    onRequestClose={() => this.setCalendarVisible(false)}
                    current={this.state.entry.date}
                    markedDates={this.state.markedDates}
                    onDayPress={(day) => this.onChangeDate(day)}
                ></CalendarModal>
            </KeyboardAvoidingView>
        )
    }
}

/**
 * Abbr. month names in english.
 */
const monthNames = [
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'
];

export default EntryScreen;
