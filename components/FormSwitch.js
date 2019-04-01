import React, { Component } from 'react';
import {StyleSheet, Text, View, Switch} from 'react-native';
import PropTypes from 'prop-types';

class FormSwitch extends Component {
    /**
     * The classic render function.
     */
    render() {
        return (
            <View style={styles.textInputBox}>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View>
                        <Text style={styles.displayText}>{this.props.description}</Text>
                    </View>
                    <Switch {...this.props}></Switch>
                </View>
                {/* <TextInput {...this.props} style={[styles.textInput, this.props.textInputStyle]}></TextInput> */}
            </View>
        );
    }
}

FormSwitch.propTypes = {
    label: PropTypes.string,
    description: PropTypes.string
};

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
    displayText: {
        fontSize: 18,
        color: '#333'
    }
});

export default FormSwitch;

