import React from 'react';
import {Text, View, StyleSheet, Alert, TouchableOpacity, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormInput from '../components/FormInput';
import FormHeader from '../components/FormHeader';
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
                <View style={{marginRight: 15}}>
                    <TouchableOpacity onPress={navigation.getParam('onPressSave')}>
                        <Text style={{color: '#fff', fontSize: 18}}>Save</Text>
                    </TouchableOpacity>
                </View>
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
            // Works on both iOS and Android
            Alert.alert(
                'Invalid entry:',
                '- The content field cannot be empty.',
            );
            return;
        }

        let entry = new Entry();
        entry.text = this.state.entry.entryText;
        entry.date = new Date(this.state.entry.date);

        entry.save().then(e => {
            ToastAndroid.show('Entry saved.', ToastAndroid.SHORT);
            this.props.navigation.goBack();
        }).catch(err => console.log(err));
    }

    render() {
        return (
            <ScrollView style={styles.mainView}>
                <FormDateInput label="Date" value={this.state.entry.date}
                    onChangeDate={(date) => this.setState(prevState => ({
                        entry: {
                            ...prevState.entry,
                            date: date
                        }
                    }))}
                ></FormDateInput>
                <FormInput 
                    label="Content" 
                    value={this.state.entry.entryText} 
                    multiline={true} 
                    onChangeText={(text) => this.setState(prevState => ({
                        entry: {
                            ...prevState.entry,
                            entryText: text
                        }
                    }))}
                ></FormInput>
            </ScrollView>
        )
    }
}

var styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
});

export default AddEntryScreen;