import React from 'react';
import {
    View, 
    StyleSheet, 
    Alert, 
    TouchableOpacity, 
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
            title: navigation.getParam('entryId', false) ? 'Edit Entry' : '',
            headerRight: (
                <TouchableOpacity onPress={navigation.getParam('onPressSave')}>
                    <View style={{marginRight: 10, width: 40, height: 40, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name="md-checkmark" size={25} style={{color: '#fff'}}/>
                    </View>
                </TouchableOpacity>
            )
        }
    };

    /**
     * React Native LifeCycle. Called when component is mounted.
     */
    async componentDidMount() {
        this.props.navigation.setParams({
            onPressSave: this.onPressSave,
        });

        // Gets entry id from the navigation bar.
        let entryId = this.props.navigation.getParam('entryId', null);

        if (entryId) {
            let entry = await Entry.find(entryId);
            this.setState({entry});
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
            this.setState({entry});
        }
    }

    /**
     * Saves the current entry.
     */
    onPressSave = () => {
        this.saveEntry();
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
                <FormDateInput label="Date" value={this.state.entry.date.getTime()}
                    onChangeDate={(date) => this.setState(prevState => ({
                        entry: {
                            ...prevState.entry,
                            date: new Date(date)
                        }
                    }))}
                ></FormDateInput>
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
        textAlignVertical: 'top'
    }
});

export default EntryScreen;
