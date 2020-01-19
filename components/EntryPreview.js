import React from 'react';
import {
    StyleSheet, 
    Text, 
    View, 
    TouchableNativeFeedback
} from 'react-native';

class EntryPreview extends React.Component {
    /**
     * Holds months of the year in English.
     */
    months = [
        'Jan', 'Feb', 'Mar', 
        'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 
        'Oct', 'Nov', 'Dec'
    ];

    /**
     * Returns the name of a month in English. TODO: Localize this.
     * 
     * @param {int} month 
     */
    getMonthName(month) {
        return this.months[month].toUpperCase();
    }

    /**
     * Returns the day of the month with leading zero.
     * 
     * @param {int} day 
     */
    getDay(day) {
        if (day < 10) {
            return '0' + day;
        }
        return day;
    }

    /**
     * React Native Render function.
     */
    render() {
        return (
            <TouchableNativeFeedback {...this.props}>
                <View style={styles.entryBox}>
                    <View style={styles.entryBoxInner}>
                        <Text style={styles.entryDay}>{this.getDay(this.props.day)}</Text>
                        <Text style={styles.entryMonth}>{this.getMonthName(this.props.month)}</Text>
                    </View>
                    <View style={styles.entryBoxSummary}>
                        <Text style={styles.entryBoxSummaryText} numberOfLines={this.props.numberOfLines}>{this.props.text}</Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

/**
 * The stylesheet of this page.
 */
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