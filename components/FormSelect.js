import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, ScrollView, Modal, TouchableNativeFeedback, TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';
import FormHeader from './FormHeader';

class FormSelect extends Component {
    state = {
        modalVisible: false,
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    componentWillUnmount() {
        this.setModalVisible(false);
    }
    
    optionSelected(item) {
        console.log(item);
        this.props.onChangeValue(item.value);
        this.setState({displayValue: item.label});
        this.setModalVisible(false);
    }

    getDisplayValue() {
        if (this.props.value && this.props.items.length) {
            let element = this.props.items.find((element) => {
                return element.value == this.props.value;
            });

            if (element) {
                return element.label;
            }
        }
    }

    /**
     * The classic render function.
     */
    render() {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        console.log('Bye!');
                        this.setModalVisible(false);
                    }}>
                    <View style={styles.outterModalView}>
                        <View style={styles.innerModalView}>
                            <FormHeader title={this.props.label.toUpperCase()} borderTop={true}></FormHeader>
                            <ScrollView>
                                {this.props.items.map((item, index) => 
                                    <TouchableNativeFeedback key={index} onPress={() => this.optionSelected(item)}>
                                        <View style={styles.itemBox}>
                                            <Text style={styles.itemLabel}>{item.label}</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                
                <TouchableNativeFeedback onPress={() => this.setModalVisible(true)}>
                    <View style={styles.textInputBox}>
                        {this.props.label && 
                            <Text style={styles.textInputLabel}>{this.props.label.toUpperCase()}</Text>
                        }
                        
                        <TextInput style={styles.textInput} value={this.getDisplayValue()} placeholder={this.props.placeholder} editable={false}></TextInput>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }
}

FormSelect.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.number,
    items: PropTypes.array.isRequired,

    onChangeValue: PropTypes.func,
};

const styles = StyleSheet.create({
    textInputBox: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: .3,
        borderColor: '#ddd',
        flex: 1,
    },
    textInputLabel: {
        fontSize: 14,
        color: '#9e9e9e',
    },
    textInput: {
        fontSize: 18,
        color: '#333',
    },
    picker: {
        backgroundColor: 'red',
        padding: 20,
    },

    itemBox: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: .3,
        borderColor: '#ddd',
    },
    itemLabel: {
        fontSize: 18,
        color: '#333',
    },
    outterModalView: {
        flex: 1,
        backgroundColor: '#00000080'
    },
    innerModalView: {
        width: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        maxHeight: 300,
    }
});

export default FormSelect;

