import React from 'react';
import {
    View, 
    StyleSheet, 
    Alert, 
    TouchableOpacity, 
    ScrollView
} from 'react-native';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import FormInput from '../components/FormInput';
import FormDateInput from '../components/FormDateInput';
import Entry from '../models/Entry';
import {ToastAndroid} from 'react-native';

/**
 * The Entry screen of the app. Used to add and edit entries.
 */
class EntryScreen extends React.Component {
    /**
     * Holds the state of this screen.
     */
    state = {
        isEditing: true,
        entry: new Entry()
    }

    /**
     * Defines the navigation options of this screen including header title, color, buttons, etc...
     */
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('headerTitle', ''),
            headerRight: (
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={navigation.getParam('onPressEdit')} style={[styles.rightMenuIcon, styles.marginRight5]}>
                        <AntDesign name="calendar" size={25} style={{color: '#fff'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigation.getParam('onPressEdit')} style={[styles.rightMenuIcon, styles.marginRight5]}>
                        <AntDesign name="edit" size={25} style={{color: '#fff'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigation.getParam('onPressSave')} style={styles.rightMenuIcon}>
                        <AntDesign name="check" size={25} style={{color: '#fff'}}/>
                    </TouchableOpacity>
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
        });

        // Gets entry id from the navigation bar.
        let entryId = this.props.navigation.getParam('entryId', null);

        if (entryId) {
            let entry = await Entry.find(entryId);
            this.updateTitle(entry.date.toLocaleDateString());
            this.setState({entry, isEditing: false});
        } else {
            let year = this.props.navigation.getParam('year', false);
            let month = this.props.navigation.getParam('month', false);

            // Creates a new Entry() object based on the selected date in the previous screen.
            let entry = new Entry();
            if (year && month) {
                entry.date = new Date(year, month, 1);
            } else {
                entry.date = new Date();
            }
            this.updateTitle(entry.date.toLocaleDateString());
            this.setState({entry, isEditing: true});
        }
    }

    /**
     * Updates the page title. Default: App Name. Usually: Current selected month.
     * 
     * @param {string} title The string to be set as title of this page. 
     */
    updateTitle(title) {
        this.props.navigation.setParams({
            headerTitle: title,
        });
    }

    /**
     * Saves the current entry.
     */
    onPressSave = () => {
        this.saveEntry();
    }

    /**
     * Lets user edit the current entry.
     */
    onPressEdit = () => {
        this.setState({isEditing: ! this.state.isEditing});
    }

    /**
     * Handles saving the current entry.
     */
    saveEntry() {
        // Checks if there is content in the text field.
        if (this.state.entry.entry.trim() == '') {
            // Works on both iOS and Android.
            Alert.alert(
                'Error',
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
                    style={{backgroundColor: '#afafaf'}}
                    numberOfLines={10}
                    editable={this.state.isEditing}
                    textInputStyle={styles.textInputStyle}
                    placeholder="How was your day?" // TODO: Translate this.
                    onChangeText={(text) => this.setState(prevState => ({
                        entry: {
                            ...prevState.entry,
                            entry: text
                        }
                    }))}
                ></FormInput>
                {/* <FormDateInput label="Date" value={this.state.entry.date.getTime()}
                    onChangeDate={(date) => this.setState(prevState => ({
                        entry: {
                            ...prevState.entry,
                            date: new Date(date)
                        }
                    }))}
                ></FormDateInput> */}
            </ScrollView>
        )
    }
}

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
    }
});

export default EntryScreen;
