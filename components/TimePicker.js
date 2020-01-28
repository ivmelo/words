import React from 'react';
import {
    View, 
    StyleSheet, 
    Modal,
    TouchableOpacity,
    Text
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import FormHeader from '../components/FormHeader';

class TimePicker extends React.Component {
    renderHourPicker(hour) {
        return (
            <TouchableOpacity style={[styles.timePickerOption, this.props.hour === hour ? styles.timePickerOptionSelected : []]}
                onPress={() => this.props.onTimeChange(hour, this.props.minute, this.props.ampm)}
                >
                <Text style={[
                    styles.timePickerOptionText, 
                    this.props.hour === hour ? styles.timePickerOptionTextSelected : []
                ]}>{hour}</Text>
            </TouchableOpacity>
        );
    }

    renderMinutePicker(minute) {
        return (
            <TouchableOpacity style={styles.timePickerOption}
                onPress={() => this.props.onTimeChange(this.props.hour, minute, this.props.ampm)}
                >
                <Text style={[
                    styles.timePickerOptionText, 
                    this.props.minute === minute ? styles.timePickerOptionTextSelected : []
                ]}>{minute}</Text>
            </TouchableOpacity>
        );
    }


    /**
     * React Native Render function.
     */
    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => this.props.onRequestClose()}>
                <View style={styles.outterModalView}>
                    <View style={styles.innerModalView}>
                        <View style={styles.timePickerBox}>
                            <Text style={styles.timePickerPreview}>{this.props.hour}:{this.props.minute}{this.props.ampm}</Text>
                            <FormHeader title="Hours"></FormHeader>
                            <View style={styles.timePickerRow}>
                                {this.renderHourPicker(1)}
                                {this.renderHourPicker(2)}
                                {this.renderHourPicker(3)}
                                {this.renderHourPicker(4)}
                                {this.renderHourPicker(5)}
                                {this.renderHourPicker(6)}
                            </View>
                            <View style={styles.timePickerRow}>
                                {this.renderHourPicker(7)}
                                {this.renderHourPicker(8)}
                                {this.renderHourPicker(9)}
                                {this.renderHourPicker(10)}
                                {this.renderHourPicker(11)}
                                {this.renderHourPicker(12)}
                            </View>


                            <FormHeader title="Minutes"></FormHeader>

                            <View style={styles.timePickerRow}>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>00</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>10</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>20</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>30</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>40</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>50</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.timePickerRow}>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>05</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>15</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>25</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>35</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>45</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>55</Text>
                                </TouchableOpacity>
                            </View>


                            <View style={styles.timePickerRow}>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>AM</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.timePickerOption}>
                                    <Text style={styles.timePickerOptionText}>PM</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => this.props.onRequestClose()}
                            style={[styles.calendarButtonBox, {backgroundColor: global.THEME_COLOR}]}
                            activeOpacity={0.5}
                        >
                            <Text style={styles.calendarButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}

FormDateInput.propTypes = {
    hour: PropTypes.number,
    minute: PropTypes.string,
    ampm: PropTypes.string,
    onTimeChange: PropTypes.func,
};

/**
 * The stylesheet of this component.
 */
var styles = StyleSheet.create({
    /** Time Picker */
    timePickerBox: {
        // padding: 15,
    },  
    timePickerPreview: {
        alignSelf: 'center',
        color: '#444',
        fontSize: 30,
        padding: 10
    },

    typeHeader: {
        color: '#444',
        // marginTop: 10,
        textAlign: 'center',
        fontSize: 16,
    },

    timePickerRow: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        // marginTop: 10,
        padding: 15,
    },
    timePickerOption: {
        // borderColor: 'red',
        // borderWidth: 1,
        // flex: 1,
        flexDirection: 'row',
        // justifyContent: 'space-around',
        // width: '16.66%',
        // alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    timePickerOptionText: {
        fontSize: 18,
        color: '#444'
        // flex: 1,
        // flexDirection: 'column',
        // justifyContent: 'space-around',
        // textAlign: 'center',
        // alignContent: 'center',
        // borderRadius: 40
    },
    timePickerOptionSelected: {
        backgroundColor: global.THEME_COLOR,
    },
    timePickerOptionTextSelected: {
        color: '#fff'
    },

    /** Modal */
    outterModalView: {
        flex: 1,
        backgroundColor: '#00000080',
    },
    innerModalView: {
        width: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
    },

    /** Button */
    calendarButtonBox: {
        // backgroundColor: global.THEME_COLOR,
        marginTop: 5,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 10,
        padding: 10
    },
    calendarButtonText: {
        color: '#fff', 
        fontSize: 18,
        textAlign: 'center'
    }
});

export default TimePicker;
