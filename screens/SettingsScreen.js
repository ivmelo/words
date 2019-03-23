import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView, TouchableNativeFeedback} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocalAuthentication } from 'expo';

class SettingsScreen extends React.Component {
    state = {
        
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Settings',
            headerRight: (
                <View style={{marginRight: 15}}>
                    <TouchableOpacity onPress={navigation.getParam('onPressAdd')}>
                        <Ionicons name="md-checkmark" size={25} style={{color: '#fff'}}/>
                    </TouchableOpacity>
                </View>
            )
        }
    };

    componentDidMount() {
        LocalAuthentication.hasHardwareAsync().then((hasHardware => {
            console.log(hasHardware);

            console.log('please, place fingerprint!');

            LocalAuthentication.authenticateAsync().then(authenticated => {
                console.log(authenticated);
            }).catch(error => console.log(error));
        })).catch(error => console.log(error));
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
            <View>
                <Text style={styles.header}>Hey Ivanilson.</Text>
                <Text style={styles.subtitle}>You can use the fields below to customise this app to better suit your needs.</Text>

                <Text style={styles.header}>2019</Text>
                <Text style={styles.subtitle}>JAN</Text>

                <ScrollView style={styles.heatMapScroll} horizontal={true} showsHorizontalScrollIndicator={false}>
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
                </ScrollView>

                <View>
                    <Text style={styles.header}>2019</Text>

                    <View style={styles.calendarRow}>
                        <TouchableNativeFeedback>
                            <View style={[styles.calendarBlock, {backgroundColor: colors[0]}]}>
                                <Text style={styles.calendarLabel}>JAN</Text>
                            </View>
                        </TouchableNativeFeedback>

                        <TouchableNativeFeedback>                
                            <View style={[styles.calendarBlock, {backgroundColor: colors[1]}]}>
                                <Text style={styles.calendarLabel}>FEB</Text>
                            </View>
                        </TouchableNativeFeedback>

                        <View style={[styles.calendarBlock, {backgroundColor: colors[2]}]}>
                            <Text style={styles.calendarLabel}>MAR</Text>
                        </View>
                    </View>

                    <View style={styles.calendarRow}>
                        <View style={[styles.calendarBlock, {backgroundColor: colors[3]}]}>
                            <Text style={styles.calendarLabel}>APR</Text>
                        </View>
                        <View style={[styles.calendarBlock, {backgroundColor: colors[4]}]}>
                            <Text style={styles.calendarLabel}>MAY</Text>
                        </View>
                        <View style={[styles.calendarBlock, {backgroundColor: colors[5]}]}>
                            <Text style={styles.calendarLabel}>JUN</Text>
                        </View>
                    </View>

                    <View style={styles.calendarRow}>
                        <View style={[styles.calendarBlock, {backgroundColor: colors[6]}]}>
                            <Text style={styles.calendarLabel}>JUL</Text>
                        </View>
                        <View style={[styles.calendarBlock, {backgroundColor: colors[7]}]}>
                            <Text style={styles.calendarLabel}>AUG</Text>
                        </View>
                        <View style={[styles.calendarBlock, {backgroundColor: colors[8]}]}>
                            <Text style={styles.calendarLabel}>SEP</Text>
                        </View>
                    </View>

                    <View style={styles.calendarRow}>
                        <View style={[styles.calendarBlock, {backgroundColor: colors[9]}]}>
                            <Text style={styles.calendarLabel}>OCT</Text>
                        </View>
                        <View style={[styles.calendarBlock, {backgroundColor: colors[10]}]}>
                            <Text style={styles.calendarLabel}>NOV</Text>
                        </View>
                        <View style={[styles.calendarBlock, {backgroundColor: colors[11]}]}>
                            <Text style={styles.calendarLabel}>DEC</Text>
                        </View>
                    </View>
                </View>
            </View>
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
    '#464098'
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