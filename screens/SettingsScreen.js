import React from 'react';
import {Button, View, StyleSheet, AsyncStorage, TouchableOpacity, ScrollView, TouchableNativeFeedback} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Calendar from '../components/Calendar';
import FormInput from '../components/FormInput';
import FormHeader from '../components/FormHeader';
import FormSwitch from '../components/FormSwitch';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Entry from '../models/Entry';
import * as DocumentPicker from 'expo-document-picker';

class SettingsScreen extends React.Component {
    state = {
        name: '',
        fingerprintLock: false,
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
        // console.log(typeof needsAuth);
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
        let geiso = JSON.parse(string);

        geiso.forEach(async (record) => {
            // record.id = null;

            // console.log(record);

            // delete record.id;

            // console.log(record);

            let e = new Entry();
            e.date = new Date(record.date);
            e.created_at = new Date(record.created_at);
            e.updated_at = new Date(record.updated_at);
            e.entry = record.entry;
            await e.save();

            console.log(console.log(e));

            // console.log(record.id);
        });

        // console.log(resp);
        // console.log(geiso[0]);
        // console.log(string);
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

    daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }

    generateYear() {
        let year = 2019;

        let currentMonth = 0;
        let currentDay = 0;
        let currentDate = 0;
        
    }

    generateBlocks() {
        return (
            <View style={styles.hmColumn}>
                {this.generateBlock()}
                {this.generateBlock()}
                {this.generateBlock()}
                {this.generateBlock()}
                {this.generateBlock()}
                {this.generateBlock()}
                {this.generateBlock()}
            </View>
        );
    }

    generateBlock() {
        return (
            <View style={styles.hmBlock}></View>
        );
    }

    render() {
        return (
            <ScrollView>
                {/* <Text style={styles.header}>Hey {this.state.name}.</Text>
                <Text style={styles.subtitle}>You can use the fields below to customise this app to better suit your needs.</Text> */}

                <FormHeader title="Preference's" subtitle="You can use the fields below to customize the app appearance, settings and etc..."></FormHeader>
                <FormInput label="Your Name" value={this.state.name} onChangeText={(newText) => this.setState({name: newText})}></FormInput>

                <FormHeader title="Security" subtitle="You can secure your notes with a pin or fingerprint. You an also add a layer of security by encripting your notes."></FormHeader>
                <FormInput label="Pin"></FormInput>
                <FormInput label="Encryption"></FormInput>

                <FormInput label="Preview Lines" keyboardType="number-pad"></FormInput>

                <FormInput label="Fingerprints"></FormInput>

                <FormSwitch description="Fingerprint lock" thumbColor="#2ecc71" value={this.state.fingerprintLock} onValueChange={async (newValue) => {
                    let set = JSON.stringify({auth_enabled: newValue});
                    await AsyncStorage.setItem('auth_enabled', set);
                    console.log(set);
                    this.setState({fingerprintLock: newValue});
                }}></FormSwitch>

                <FormSwitch description="Display full entries" thumbColor="#2ecc71" value={this.state.displayFullEntries} onValueChange={async (newValue) => {
                    let set = JSON.stringify({display_full_entries: newValue});
                    await AsyncStorage.setItem('display_full_entries', set);
                    console.log(set);
                    this.setState({displayFullEntries: newValue});
                }}></FormSwitch>
                
                <Button
                    title="Backup Data"
                    color="#f194ff"
                    onPress={() => {
                        this.downloadFile();
                        console.log('hesy');
                    }}
                />

                <Button
                    title="Restore Backup"
                    color="#4fff19"
                    onPress={() => {
                        this.restoreBackup();
                        console.log('restoring');
                    }}
                />

                <Button
                    title="Clear Data"
                    color="#fff419"
                    onPress={() => {
                        this.clearData();
                        console.log('clear');
                    }}
                />
                



{/* 
                <Text style={styles.header}>2019</Text>
                <Text style={styles.subtitle} value={this.state.name} onChangeText={(newText) => this.setState({name: newText})}>JAN</Text> */}

                {/* <ScrollView style={styles.heatMapScroll} horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={styles.heatmap}>
                        <View style={styles.hmWeeks}>
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                            {this.generateBlocks()}
                        </View>
                    </View>
                </ScrollView> */}
            </ScrollView>
        )
    }
}

var colors = [
    '#007cbc',
    '#0099d2',
    '#009d50',
    '#74ae36',
    '#acc71a',
    '#ebaa12',
    '#e88810',
    '#e93510',
    '#e12b51',
    '#b4357c',
    '#6d3f97',
    '#464098',
    '#cccccc'
];


var monthEntries2 = [
    12,
    1,
    12,
    4,
    9,
    12,
    21,
    0,
    0,
    0,
    0,
    0
];

var styles = StyleSheet.create({
    mainView: {
        backgroundColor: '#f9f9f9',
    },
    header: {
        padding: 15,
        color: '#333',
        fontSize: 24,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 18,
        paddingHorizontal: 15,
        color: '#333'
    },




    calendarRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 15,
        marginRight: 5,
        marginBottom: 10,
    },
    calendarBlock: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#007cbc',
        marginRight: 10,
        borderRadius: 5,
    },
    calendarLabel: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    calendarStats: {
        color: '#fff',
        fontSize: 12,
    },
    calendarStatsLg: {
        fontSize: 18,
    },

    heatMapScroll: {
        // marginLeft: 15,
    },
    heatmap: {
        flexDirection: 'row',
    },
    hmColumn: {
        flexDirection: 'column',
    },
    hmWeeks: {
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
    },
    hmBlock: {
        backgroundColor: '#2ecc71',
        height: 20,
        width: 20,
        marginBottom: 3,
        marginRight: 3,
        textAlign: 'center',
        borderRadius: 3,
    },
    hmText: {
        color: '#fff',
        textAlign: 'center',
        flex: 1,
        justifyContent: 'space-between'
    }

});

export default SettingsScreen;