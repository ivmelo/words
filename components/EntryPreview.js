import React from 'react';
import {StyleSheet, Text, View, TouchableNativeFeedback} from 'react-native';

class EntryPreview extends React.Component {
    months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    getMonthName(month) {
        return this.months[month].toUpperCase();
    }

    getDay(day) {
        if (day < 10) {
            return '0' + day;
        }
        return day;
    }

    render() {
        return (
            <TouchableNativeFeedback {...this.props}>
                <View style={styles.entryBox}>
                    <View style={styles.entryBoxInner}>
                        <Text style={styles.entryDay}>{this.getDay(this.props.day)}</Text>
                        <Text style={styles.entryMonth}>{this.getMonthName(this.props.month)}</Text>
                    </View>
                    <View style={styles.entryBoxSummary}>
                        <Text style={styles.entryBoxSummaryText} >{this.props.text}</Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

var styles = StyleSheet.create({
    entryBox: {
        flexDirection: 'row',
        borderColor: '#ddd',
        borderBottomWidth: .3,
        backgroundColor: '#fff'
    },
    entryBoxInner: {
        paddingLeft: 15,
        paddingVertical: 15,
        flex: 1,
    },
    entryBoxSummary: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        flex: 5
    },
    entryDay: {
        fontSize: 28,
        color: '#444',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    entryMonth: {
        fontSize: 18,
        color: '#444',
        textAlign: 'center'
    },
    entryBoxSummaryText: {
        fontSize: 18,
        color: '#333'
    }
});

export default EntryPreview;