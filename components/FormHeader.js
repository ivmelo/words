import React, { Component } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

class FormHeader extends Component {
    /**
     * The classic render function.
     */
    render() {
        return (
            <View style={[styles.headerBox, {borderTopWidth: this.props.borderTop ? 0.3 : 0}]}>
                <Text style={styles.headerTitle}>{this.props.title.toUpperCase()}</Text>
                {this.props.subtitle &&
                    <Text style={styles.headerSubtitle}>{this.props.subtitle}</Text>
                }
            </View>
        );
    }
}

FormHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
};

const styles = StyleSheet.create({
    headerBox: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: .3,
        borderColor: '#ddd',
    },
    headerTitle: {
        fontSize: 14,
        color: '#9e9e9e',
    },
    headerSubtitle: {
        marginTop: 5,
        fontSize: 14,
        color: '#9e9e9e',
    }
});

export default FormHeader;

