import React from 'react';
import {
    View, 
    StyleSheet, 
    Modal,
    TouchableOpacity,
    Text
} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

class CalendarModal extends React.Component {
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
                        <Calendar
                            {...this.props}
                            renderArrow={(direction) => (<AntDesign name={direction} size={25} style={{color: global.THEME_COLOR}}/>)}
                            theme={{
                                todayTextColor: global.THEME_COLOR,
                                dotColor: global.THEME_COLOR,
                            }}
                        />
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

/**
 * The stylesheet of this component.
 */
var styles = StyleSheet.create({
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

export default CalendarModal;
