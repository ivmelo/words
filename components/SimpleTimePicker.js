import React from 'react';
import {
    View, 
    StyleSheet, 
    Modal,
    TouchableOpacity,
    Text
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import PropTypes from 'prop-types';

class SimpleTimePicker extends React.Component {
    /**
     * Increase the Hour counter.
     */
    increaseHours() {
        let hour = this.props.hour;
        hour++;
        if (hour == 13) {
            hour = 1;
        }
        this.props.onTimeChange(hour, this.props.minute, this.props.ampm);
    }

    /**
     * Decrease the Hour counter.
     */
    decreaseHours() {
        let hour = this.props.hour;
        hour--;
        if (hour == 0) {
            hour = 12;
        }
        this.props.onTimeChange(hour, this.props.minute, this.props.ampm);
    }

    /**
     * Increase the Minute counter.
     */
    increaseMinutes() {
        let minute = this.props.minute;
        minute += 5;
        if (minute >= 60) {
            minute = 0;
        }
        this.props.onTimeChange(this.props.hour, minute, this.props.ampm);
    }

    /**
     * Decrease the Minute counter.
     */
    decreaseMinutes() {
        let minute = this.props.minute;
        minute -= 5;
        if (minute < 0) {
            minute = 55;
        }
        this.props.onTimeChange(this.props.hour, minute, this.props.ampm);
    }

    /**
     * Toggles AM/PM values.
     */
    toggleAmPm() {
        let ampm = this.props.ampm;
        if (ampm.toUpperCase() == 'AM') {
            this.props.onTimeChange(this.props.hour, this.props.minute, 'PM');
        } else {
            this.props.onTimeChange(this.props.hour, this.props.minute, 'AM');
        }
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
                        
                        <View style={styles.mainContainer}>
                            <View style={styles.timeUnitContainer}>
                                <TouchableOpacity style={styles.changeTimeButton} onPress={() => this.increaseHours()}>
                                    <AntDesign name="up" style={styles.buttonIconStyle}/>
                                </TouchableOpacity>
                                <Text style={styles.timeUnitText}>{this.props.hour}</Text>
                                <TouchableOpacity style={styles.changeTimeButton} onPress={() => this.decreaseHours()}>
                                    <AntDesign name="down" style={styles.buttonIconStyle}/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.separatorContainer}>
                                <Text style={styles.secondaryUnitText}>:</Text>
                            </View>
                            <View style={styles.timeUnitContainer}>
                                <TouchableOpacity style={styles.changeTimeButton} onPress={() => this.increaseMinutes()}>
                                    <AntDesign name="up" style={styles.buttonIconStyle}/>
                                </TouchableOpacity>
                                <Text style={styles.timeUnitText}>
                                    {this.props.minute < 10 ? '0' + this.props.minute : this.props.minute}
                                </Text>
                                <TouchableOpacity style={styles.changeTimeButton} onPress={() => this.decreaseMinutes()}>
                                    <AntDesign name="down" style={styles.buttonIconStyle}/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.separatorContainer}></View>
                            <View style={styles.timeUnitContainer}>
                                <TouchableOpacity style={styles.changeTimeButton} onPress={() => this.toggleAmPm()}>
                                    <AntDesign name="up" style={styles.buttonIconStyle}/>
                                </TouchableOpacity>
                                <Text style={styles.secondaryUnitText}>{this.props.ampm.toUpperCase()}</Text>
                                <TouchableOpacity style={styles.changeTimeButton} onPress={() => this.toggleAmPm()}>
                                    <AntDesign name="down" style={styles.buttonIconStyle}/>
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

SimpleTimePicker.propTypes = {
    hour: PropTypes.number,
    minute: PropTypes.number,
    ampm: PropTypes.string,
    onTimeChange: PropTypes.func,
};

/**
 * The stylesheet of this component.
 */
var styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 40,
        justifyContent: 'space-between'
    },
    timeUnitContainer: { 
        width: '25%',
        justifyContent: 'center'
    },
    separatorContainer: {
        width: '5%',
        justifyContent: 'center'
    },
    changeTimeButton: {
        alignItems: 'center',
    },
    timeUnitText: {
        fontSize: 50,
        textAlign: 'center',
        color: '#444',
        marginVertical: 20
    },
    secondaryUnitText: {
        fontSize: 30,
        textAlign: 'center',
        color: '#666',
        paddingVertical: 12,
        marginVertical: 20,
    },
    buttonIconStyle: {
        color: '#aaa', 
        fontSize: 25
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

export default SimpleTimePicker;
