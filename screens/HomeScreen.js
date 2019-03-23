import React from 'react';
import {ScrollView, StyleSheet, View, RefreshControl, TouchableOpacity, StatusBar, Vibration, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EntryPreview from '../components/EntryPreview';
import Entry from '../models/Entry';
import { Contacts } from 'expo';

class HomeScreen extends React.Component {
    state = {
        entries: [],
        refreshing: false,
    }

    static navigationOptions = {
        title: 'Words',
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Words',
            headerLeft: (
                <View style={{marginLeft: 20}}>
                    <TouchableOpacity onPress={navigation.getParam('onPressSettings')}>
                        <Ionicons name="md-settings" size={25} style={{color: '#fff'}}/>
                    </TouchableOpacity>
                </View>
            ),
            headerRight: (
                <View style={{marginRight: 15}}>
                    <TouchableOpacity onPress={navigation.getParam('onPressAdd')}>
                        <Ionicons name="md-calendar" size={25} style={{color: '#fff'}}/>
                    </TouchableOpacity>
                </View>
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

    async componentDidMount() {
        this.props.navigation.setParams({
            onPressAdd: this.onPressAdd,
            onPressSettings: this.onPressSettings,
        });

        this.props.navigation.navigate('SettingsScreen');

        this.onRefresh();
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
        // this.setState({refreshing: false});
        // setTimeout(, 1000);

        Entry.all('date', 'DESC').then(entries => {
            // console.log(entries);
            this.setState({entries, refreshing: false});
        });
    }

    render() {
        return (
            <View style={styles.mainView}>
                <StatusBar backgroundColor="#2ecc71" barStyle="light-content" />

                <ScrollView
                    refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.onRefresh()}
                            />
                        }
                    >

                    {this.state.entries.map((entry, index) =>
                        <EntryPreview key={index} text={entry.text} day={new Date(entry.date).getDate().toString()} month={new Date(entry.date).getMonth()} onLongPress={() => this.onHoldEntry(entry)}></EntryPreview>
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
});

export default HomeScreen;