import React from 'react';
import {
    StyleSheet, 
    AsyncStorage, 
    ScrollView, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import Entry from '../models/Entry';
import FormInput from '../components/FormInput';
import FormHeader from '../components/FormHeader';
import FormSwitch from '../components/FormSwitch';
import FormSelect from '../components/FormSelect';
import FormButton from '../components/FormButton';

class SettingsScreen extends React.Component {
    state = {
        name: '',
        fingerprintLock: false,
        selectedItem: 1,
        restoreBackupLabel: 'Restore backup',
        selectItems: [
            {
                label: '#007cbc',
                value: 1
            },
            {
                label: '#0099d2',
                value: 2
            },
            {
                label: '#009d50',
                value: 3
            }
        ]
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Settings',
        }
    };

    async componentDidMount() {
        let needsAuth = await AsyncStorage.getItem('auth_enabled');
        let naobj = JSON.parse(needsAuth);
        this.setState({fingerprintLock: naobj.auth_enabled});

        let displayFullEntries = await AsyncStorage.getItem('display_full_entries');
        console.log();
        console.log(displayFullEntries);
        let dfeobj = JSON.parse(displayFullEntries);
        this.setState({displayFullEntries: dfeobj.display_full_entries});
    }

    async componentWillUnmount() {
        console.log('unmounting...');
    }

    async clearData() {
        Entry.destroyAll().then(async (entries) => {
            console.log('ok');
        }).catch(err => {
            console.log(err);
        });
    }

    async restoreBackup() {
        let resp = await DocumentPicker.getDocumentAsync();
        let string = await FileSystem.readAsStringAsync(resp.uri);
        let entrySet = JSON.parse(string);

        let totalEntries = entrySet.length;

        for(let i = 0; i < totalEntries; i++) {
            let record = entrySet[i];
            let entry = new Entry();
            entry.date = new Date(record.date);
            entry.created_at = new Date(record.created_at);
            entry.updated_at = new Date(record.updated_at);
            entry.entry = record.entry;

            await entry.save();

            this.setState({
                restoreBackupLabel: 'Importing entries... [' + i + '/' + totalEntries + ']'
            });
            console.log(i);
        }

        this.setState({
            restoreBackupLabel: 'Restore backup'
        });
        

        // geiso.forEach(async (record) => {
        //     // Creates new entry object.
        //     let e = new Entry();
        //     e.date = new Date(record.date);
        //     e.created_at = new Date(record.created_at);
        //     e.updated_at = new Date(record.updated_at);
        //     e.entry = record.entry;

        //     // Saves async while waiting.
        //     await e.save();
        // });
    }
    

    async downloadFile() {
        let entries = Entry.all().then(async (entries) => {
            let entries_json = JSON.stringify(entries);
            console.log(entries_json);
            // let enstr = JSON.stringify(entries);
            // console.log(enstr);
            let fileName ='words-' + Date.now() + '.json';
            const fileUri = FileSystem.cacheDirectory + fileName;
            await FileSystem.writeAsStringAsync(fileUri, entries_json, { encoding: FileSystem.EncodingType.UTF8 });
            await Sharing.shareAsync(FileSystem.cacheDirectory + fileName);
        }).catch((err) => {
            console.log('error');
        });

        console.log(entries);



        // const fileUri = FileSystem.cacheDirectory + 'demo.txt';
        // await FileSystem.writeAsStringAsync(fileUri, "Hello World", { encoding: FileSystem.EncodingType.UTF8 });
        // await Sharing.shareAsync(FileSystem.cacheDirectory + 'demo.txt');
        console.log('oks');
    }

    render() {
        return (
            <ScrollView>
                {/* <Text style={styles.header}>Hey {this.state.name}.</Text>
                <Text style={styles.subtitle}>You can use the fields below to customise this app to better suit your needs.</Text> */}

                <FormHeader title="General"></FormHeader>
                <FormButton
                    label="About Words"
                    onPress={() => {
                        console.log('about');
                    }}
                ></FormButton>
                <FormInput label="Your Name" value={this.state.name} onChangeText={(newText) => this.setState({name: newText})}></FormInput>

                <FormHeader title="Security" subtitle="You can secure your notes with a 6-8 digit PIN or fingerprint. You will be prompted with a login screen every time you open the app."></FormHeader>
                <FormButton
                    label="Set PIN"
                    onPress={() => {
                        console.log('set pin');
                    }}
                ></FormButton>

                <FormSwitch description="Fingerprint lock" thumbColor="#2ecc71" value={this.state.fingerprintLock} onValueChange={async (newValue) => {
                    let set = JSON.stringify({auth_enabled: newValue});
                    await AsyncStorage.setItem('auth_enabled', set);
                    console.log(set);
                    this.setState({fingerprintLock: newValue});
                }}></FormSwitch>


                <FormHeader title="Appearance"></FormHeader>
                <FormInput label="Preview Lines" keyboardType="number-pad"></FormInput>


                <FormSelect label="demo" items={this.state.selectItems} value={this.state.selectedItem} onChangeValue={(v) => {
                    this.setState({selectedItem: v});
                    let color = this.state.selectItems[v];
                    global.THEME_COLOR = color.label;
                    // console.log();
                }}></FormSelect>

                <FormHeader title="Data" subtitle="You can use this section to backup your data or import a previous backup. Make sure you do this regularly in order to keep your entries safe. This is the only way of restoring your data in case your device is lost, broken or stolen."></FormHeader>

                <FormButton
                    label="Backup entries"
                    onPress={() => {
                        this.downloadFile();
                    }}
                ></FormButton>

                <FormButton
                    label={this.state.restoreBackupLabel}
                    onPress={() => {
                        this.restoreBackup();
                    }}
                ></FormButton>

                <FormButton
                    label="Delete all entries"
                    onPress={() => {
                        this.clearData();
                    }}
                ></FormButton>

                <FormHeader
                    subtitle="Words for Android is developed with ❤ in beautiful Kingston, ON, Canada by Ivan Melo."
                ></FormHeader>
            </ScrollView>
        )
    }
}

var styles = StyleSheet.create({

});

export default SettingsScreen;