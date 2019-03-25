import React from 'react';
import {View, StyleSheet, Text, TouchableNativeFeedback} from 'react-native';

class CalendarBlock extends React.Component {
    render() {
        return (
            <TouchableNativeFeedback {...this.props}>
                <View style={[styles.calendarBlock, {backgroundColor: this.props.bgColor}]}>
                    {this.props.total &&
                        <Text style={styles.calendarStats}><Text style={styles.calendarStatsLg}>{this.props.amount ? this.props.amount : '0'}</Text>/{this.props.total}</Text>
                    }
                    <Text style={styles.calendarLabel}>{this.props.title.toUpperCase()}</Text>
                </View>
            </TouchableNativeFeedback>
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

export default CalendarBlock;