import React, { Component } from 'react';
import {
    StyleSheet, 
    Text, 
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

class FormButton extends Component {
    /**
     * React Native Render function.
     */
    render() {
        return (
            <TouchableOpacity {...this.props} style={styles.buttonBox}>
                <Text style={styles.buttonText}>{this.props.label}</Text>
            </TouchableOpacity>
        );
    }
}

/**
 * Prop types for validation.
 */
FormButton.propTypes = {
    label: PropTypes.string,
};

/**
 * The stylesheet of this page.
 */
const styles = StyleSheet.create({
    buttonBox: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: .3,
        borderColor: '#ddd',
        flex: 1,
        backgroundColor: '#fff',
    },
    buttonText: {
        fontSize: 18,
        color: global.THEME_COLOR
    }
});

export default FormButton;

