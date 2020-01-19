import React from 'react';
import {
    View,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
    Modal,
    Text,
    Vibration,
    Button,
} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import FormInput from '../components/FormInput';
import Entry from '../models/Entry';
import {Calendar} from 'react-native-calendars';

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
        markedDates: {}
    }

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
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <TouchableOpacity onPress={navigation.getParam('onPressCalendar')} style={[styles.rightMenuIcon, styles.marginRight5]}>
                                    <AntDesign name="calendar" size={25} style={{ color: '#fff' }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={navigation.getParam('onPressSave')} style={styles.rightMenuIcon}>
                                    <AntDesign name="check" size={25} style={{ color: '#fff' }} />
                                </TouchableOpacity>
                            </View>
                            ) : (
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <TouchableOpacity onPress={navigation.getParam('onPressDelete')} style={[styles.rightMenuIcon, styles.marginRight5]}>
                                    <AntDesign name="delete" size={25} style={{ color: '#fff' }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={navigation.getParam('onPressEdit')} style={styles.rightMenuIcon}>
                                    <AntDesign name="edit" size={25} style={{ color: '#fff' }} />
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
            let year = this.props.navigation.getParam('year', false);
            let month = this.props.navigation.getParam('month', false);

            // Creates a new Entry() object based on the selected date in the previous screen.
            entry = new Entry();
            if (year && month) {
                entry.date = new Date(year, month, 1);
            } else {
                entry.date = new Date();
            }
        }

        // Convert date to ISO 8006 date and set as markedDates index.
        let markedDates = {};

        let day = entry.date.getDate() < 10 ? '0' + String(entry.date.getDate()) : entry.date.getDate();
        let month = (entry.date.getMonth() + 1) < 10 ? '0' + String(entry.date.getMonth() + 1) : (entry.date.getMonth() + 1);
        let year = entry.date.getFullYear();
        let isoDate = year + '-' + month + '-' + day;

        // Sets date as marked in the calendar.
        markedDates[isoDate] = {
            selected: true, 
            selectedColor: global.THEME_COLOR
        };

        if (! entryId) {
            this.props.navigation.setParams({
                isEditing: true
            });
        }

        this.setTitle(this.getWrittenDate(entry.date));
        this.setState({
            entry, 
            isEditing: ! entryId,
            markedDates
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
        this.setState({isEditing: true});
    }

    /**
     * Called when calendar is pressed.
     */
    onPressCalendar = () => {
        this.setState({isCalendarVisible: ! this.state.isCalendarVisible})
    }

    /**
     * Called when the delete button is pressed.
     */
    onPressDelete = () => {
        // console.log('deletePressed');
        Vibration.vibrate(4);

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
        // First mark date as selected in the calendar.
        let markedDates = {};

        markedDates[day.dateString] = {
            selected: true, 
            selectedColor: global.THEME_COLOR
        };

        // Create a new date object with the new date to replace the current one in entry.
        let date = new Date(day.year, day.month - 1, day.day);

        this.setState(prevState => ({
            entry: {
                ...prevState.entry,
                date: date,
            },
            markedDates
        }));

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
        this.setState({isCalendarVisible: visible});
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
            <ScrollView style={styles.mainView}>
                <FormInput
                    value={this.state.entry.entry}
                    multiline={true}
                    style={{ backgroundColor: '#afafaf' }}
                    numberOfLines={10}
                    editable={this.state.isEditing}
                    textInputStyle={styles.textInputStyle}
                    // autoFocus={true} // Focus input on componentDidMount.
                    placeholder="How was your day?" // TODO: Translate this.
                    onChangeText={(text) => this.setState(prevState => ({
                        entry: {
                            ...prevState.entry,
                            entry: text
                        }
                    }))}
                ></FormInput>
                
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isCalendarVisible}
                    onRequestClose={() => {
                        this.setCalendarVisible(false);
                    }}>
                    <View style={styles.outterModalView}>
                        <View style={styles.innerModalView}>
                            <Calendar
                                current={this.state.entry.date}
                                markedDates={this.state.markedDates}
                                onDayPress={(day) => this.onChangeDate(day)}
                            />
                            <TouchableOpacity
                                onPress={() => 
                                    this.setCalendarVisible(false)
                                }
                                style={[styles.calendarButtonBox, {backgroundColor: global.THEME_COLOR}]}
                                activeOpacity={0.5}
                            >
                                <Text style={styles.calendarButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
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

/**
 * The stylesheet of this page.
 */
var styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    textInputStyle: {
        textAlignVertical: 'top',
        textAlign: 'left'
    },
    rightMenuIcon: {
        marginRight: 10, width: 40, height: 40, flex: 1, alignItems: 'center', justifyContent: 'center'
    },
    marginRight5: {
        marginRight: 5
    },

    outterModalView: {
        flex: 1,
        backgroundColor: '#00000080'
    },
    innerModalView: {
        width: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
    },
    calendarButtonBox: {
        // backgroundColor: global.THEME_COLOR,
        backgroundColor: 'red',
        marginTop: 5,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 10,
        padding: 10
    },
    calendarButtonText: {
        color: '#fff', 
        fontSize: 18,
        textAlign: 'center'
    }
});

export default EntryScreen;
