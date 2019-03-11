import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native';

class VerticalSeparator extends Component {
    /**
     * The classic render function.
     */
    render() {
        return (
            <View {...this.props} style={styles.separator}></View>
        );
    }
}

const styles = StyleSheet.create({
    separator: {
        width: 0,
        borderRightWidth: .3,
        borderColor: '#ddd',
    },
});

export default VerticalSeparator;

