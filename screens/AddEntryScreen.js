import React from 'react';
import {Text, View, StyleSheet, Alert, TouchableOpacity, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormInput from '../components/FormInput';
import FormHeader from '../components/FormHeader';
import FormDateInput from '../components/FormDateInput';
import Entry from '../models/Entry';

class AddEntryScreen extends React.Component {
    state = {
        entry: {
            entryText: '',
            date: new Date().getTime(),
            created_at: new Date().getTime(),
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

        let entry = new Entry(this.state.entry.entryText, this.state.entry.date);

        // console.log(entry);

        entry._save().then((resp) => {
            // console.log(entry);
            this.props.navigation.navigate('HomeScreen');
        });

        // console.log(this.state.entry);
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
            // <View style={styles.mainView}>
            //     <FormHeader title="Entry Details"></FormHeader>
            //     <FormInput label="Name"></FormInput>
            //     <FormDateInput label="Name"></FormDateInput>
            //     {/* <TextInput multiline={true} style={styles.textInput} value={this.state.entryText} onChangeText={(text) => this.setState({entryText: text})} scrollEnabled={false}></TextInput> */}
            // </View>
        )
    }
}

var styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    // textInput: {
    //     flex: 1, 
    //     textAlignVertical: 'top',
    // }
});

export default AddEntryScreen;