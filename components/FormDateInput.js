import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableNativeFeedback, DatePickerAndroid} from 'react-native';
import PropTypes from 'prop-types';

class FormDateInput extends Component {
    displayDatePicker = async () => {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                date: this.props.value ? new Date(this.props.value) : new Date(), // Today...
                mode: 'calendar'
            });

            if (action !== DatePickerAndroid.dismissedAction) {
                let date = new Date(year, month, day);
                this.props.onChangeDate(date.getTime());
            }
        } catch ({code, message}) {
          console.warn('Cannot open date picker', message);
        }
    }

    /**
     * Returns a formatted date for display.
     */
    getDisplayDate() {
        if (this.props.value && this.props.value != '') {
            return new Date(this.props.value).toLocaleDateString('en-US', {year: 'numeric'});
        }
        return '';
    }

    /**
     * The classic render function.
     */
    render() {
        return (
            <TouchableNativeFeedback onPress={() => this.displayDatePicker()}>
                <View style={[styles.textInputBox, styles.separateRight]}>
                    {this.props.label && 
                        <Text style={styles.textInputLabel}>{this.props.label.toUpperCase()}</Text>
                    }
                    <TextInput {...this.props} style={styles.textInput} value={this.getDisplayDate()} editable={false}></TextInput>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

FormDateInput.propTypes = {
    value: PropTypes.number,
    label: PropTypes.string,
    onChangeDate: PropTypes.func,
};

const styles = StyleSheet.create({
    textInputBox: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: .3,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    textInputLabel: {
        fontSize: 14,
        color: '#9e9e9e',
    },
    textInput: {
        fontSize: 18,
        color: '#333',
    }
});

export default FormDateInput;

