import React from 'react';
import {View, StyleSheet, Alert, TouchableOpacity, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormInput from '../components/FormInput';
import FormDateInput from '../components/FormDateInput';
import Entry from '../models/Entry';
import {ToastAndroid} from 'react-native';

class AddEntryScreen extends React.Component {
    state = {
        entry: {
            entryText: '',
            date: new Date().getTime(),
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'New Entry',
            headerRight: (
                <TouchableOpacity onPress={navigation.getParam('onPressSave')}>
                    <View style={{marginRight: 10, width: 40, height: 40, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name="md-checkmark" size={25} style={{color: '#fff'}}/>
                    </View>
                </TouchableOpacity>
            )
        }
    };

    componentDidMount() {
        this.props.navigation.setParams({
            onPressSave: this.onPressSave,
        });
    }

    onPressSave = () => {
        this.saveEntry();
    }

    saveEntry() {
        if (this.state.entry.entryText.trim() == '') {
            // Works on both iOS and Android.
            Alert.alert(
                'Invalid entry:',
                '- The content field cannot be empty.',
            );
            return;
        }

        let entry = new Entry();
        entry.entry = this.state.entry.entryText;
        entry.date = new Date(this.state.entry.date);

        entry.save().then(e => {
            ToastAndroid.show('Entry saved.', ToastAndroid.SHORT);
            this.props.navigation.goBack();
        }).catch(err => console.log(err));
    }

    render() {
        return (
            <ScrollView style={styles.mainView}>
                <FormInput 
                    value={this.state.entry.entryText} 
                    multiline={true}
                    numberOfLines={10}
                    textInputStyle={styles.textInputStyle}
                    placeholder="How was your day?"
                    onChangeText={(text) => this.setState(prevState => ({
                        entry: {
                            ...prevState.entry,
                            entryText: text
                        }
                    }))}
                ></FormInput>
                <FormDateInput label="Date" value={this.state.entry.date}
                    onChangeDate={(date) => this.setState(prevState => ({
                        entry: {
                            ...prevState.entry,
                            date: date
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

export default AddEntryScreen;
