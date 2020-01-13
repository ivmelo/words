import React from 'react';
import {View, StyleSheet, AsyncStorage, TouchableOpacity, ScrollView, TouchableNativeFeedback} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Calendar from '../components/Calendar';
import FormInput from '../components/FormInput';
import FormHeader from '../components/FormHeader';
import FormSwitch from '../components/FormSwitch';

class SettingsScreen extends React.Component {
    state = {
        name: 'Ivanilson',
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
        console.log();
        console.log(needsAuth);
        console.log(typeof needsAuth);
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

                <FormInput label="Fingerprints"></FormInput>

                <FormSwitch description="Fingerprint lock" thumbColor="#2ecc71" value={this.state.fingerprintLock} onValueChange={async (newValue) => {
                    let set = JSON.stringify({auth_enabled: newValue});
                    await AsyncStorage.setItem('auth_enabled', set);
                    console.log(set);
                    this.setState({fingerprintLock: newValue});
                }}></FormSwitch>



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