import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView, TouchableNativeFeedback} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarBlock from './CalendarBlock';

class Calendar extends React.Component {
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
                <Text style={styles.header}>{this.props.year}</Text>

                <View style={styles.calendarRow}>
                    <CalendarBlock title="Jan" bgColor={colors[0]} total={31} amount={this.props.monthEntries[0]} onPress={() => this.props.onSelectDate(this.props.year, 1)}></CalendarBlock>
                    <CalendarBlock title="Feb" bgColor={colors[1]} total={new Date(this.props.year, 2, 0).getDate()} amount={this.props.monthEntries[1]} onPress={() => this.props.onSelectDate(this.props.year, 2)}></CalendarBlock>
                    <CalendarBlock title="Mar" bgColor={colors[2]} total={31} amount={this.props.monthEntries[2]} onPress={() => this.props.onSelectDate(this.props.year, 3)}></CalendarBlock>
                </View>

                <View style={styles.calendarRow}>
                    <CalendarBlock title="Apr" bgColor={colors[3]} total={30} amount={this.props.monthEntries[3]} onPress={() => this.props.onSelectDate(this.props.year, 4)}></CalendarBlock>
                    <CalendarBlock title="May" bgColor={colors[4]} total={31} amount={this.props.monthEntries[4]} onPress={() => this.props.onSelectDate(this.props.year, 5)}></CalendarBlock>
                    <CalendarBlock title="Jun" bgColor={colors[5]} total={30} amount={this.props.monthEntries[5]} onPress={() => this.props.onSelectDate(this.props.year, 6)}></CalendarBlock>
                </View>

                <View style={styles.calendarRow}>
                    <CalendarBlock title="Jul" bgColor={colors[6]} total={31} amount={this.props.monthEntries[6]} onPress={() => this.props.onSelectDate(this.props.year, 7)}></CalendarBlock>
                    <CalendarBlock title="Aug" bgColor={colors[7]} total={31} amount={this.props.monthEntries[7]} onPress={() => this.props.onSelectDate(this.props.year, 8)}></CalendarBlock>
                    <CalendarBlock title="Sep" bgColor={colors[8]} total={30} amount={this.props.monthEntries[8]} onPress={() => this.props.onSelectDate(this.props.year, 9)}></CalendarBlock>
                </View>

                <View style={styles.calendarRow}>
                    <CalendarBlock title="Oct" bgColor={colors[9]} total={31} amount={this.props.monthEntries[9]} onPress={() => this.props.onSelectDate(this.props.year, 10)}></CalendarBlock>
                    <CalendarBlock title="Nov" bgColor={colors[10]} total={30} amount={this.props.monthEntries[10]} onPress={() => this.props.onSelectDate(this.props.year, 11)}></CalendarBlock>
                    <CalendarBlock title="Dec" bgColor={colors[11]} total={31} amount={this.props.monthEntries[11]} onPress={() => this.props.onSelectDate(this.props.year, 12)}></CalendarBlock>
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
    '#464098',
    '#cccccc'
];

var styles = StyleSheet.create({
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

});

export default Calendar;