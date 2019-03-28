import React from 'react';
import {View, StyleSheet, Alert, TouchableOpacity, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormInput from '../components/FormInput';
import FormDateInput from '../components/FormDateInput';
import Entry from '../models/Entry';
import {ToastAndroid} from 'react-native';

class EntryScreen extends React.Component {
    state = {
        entry: new Entry()
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('entryId', false) ? 'Edit Entry' : 'New Entry',
            headerRight: (
                <TouchableOpacity onPress={navigation.getParam('onPressSave')}>
                    <View style={{marginRight: 10, width: 40, height: 40, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name="md-checkmark" size={25} style={{color: '#fff'}}/>
                    </View>
                </TouchableOpacity>
            )
        }
    };

    async componentDidMount() {
        this.props.navigation.setParams({
            onPressSave: this.onPressSave,
        });

        let entryId = this.props.navigation.getParam('entryId', null);

        if (entryId) {
            let entry = await Entry.get(entryId);
            this.setState({entry});
            console.log(entry);
        }
    }

    onPressSave = () => {
        this.saveEntry();
    }

    saveEntry() {
        // console.log(this.state.entry);

        if (this.state.entry.entry.trim() == '') {
            // Works on both iOS and Android.
            Alert.alert(
                'Invalid entry:',
                '- The content field cannot be empty.',
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

    render() {
        return (
            <ScrollView style={styles.mainView}>
                <FormInput 
                    value={this.state.entry.entry} 
                    multiline={true}
                    numberOfLines={10}
                    textInputStyle={styles.textInputStyle}
                    placeholder="How was your day?"
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
