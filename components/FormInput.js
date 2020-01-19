import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import PropTypes from 'prop-types';

class FormHeader extends Component {
    /**
     * React Native Render function.
     */
    render() {
        return (
            <View style={styles.textInputBox}>
                {this.props.label && 
                    <Text style={styles.textInputLabel}>{this.props.label.toUpperCase()}</Text>
                }
                <TextInput {...this.props} style={[styles.textInput, this.props.textInputStyle]}></TextInput>
            </View>
        );
    }
}

/**
 * Prop types for validation.
 */
FormHeader.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
};

/**
 * The stylesheet of this page.
 */
const styles = StyleSheet.create({
    textInputBox: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: .3,
        borderColor: '#ddd',
        flex: 1,
        backgroundColor: '#fff',
    },
    textInputLabel: {
        fontSize: 14,
        color: '#9e9e9e',
    },
    textInput: {
        fontSize: 18,
        color: '#333'
    }
});

export default FormHeader;

