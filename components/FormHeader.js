import React, { Component } from 'react';
import {
    StyleSheet, 
    Text, 
    View
} from 'react-native';
import PropTypes from 'prop-types';

class FormHeader extends Component {
    /**
     * React Native Render function.
     */
    render() {
        return (
            <View style={[styles.headerBox, {borderTopWidth: this.props.borderTop ? 0.3 : 0}]}>
                {this.props.title &&
                    <Text style={styles.headerTitle}>{this.props.title.toUpperCase()}</Text>
                }
                {this.props.subtitle &&
                    <Text style={[styles.headerSubtitle, this.props.center ? styles.textCenter : {}]}>{this.props.subtitle}</Text>
                }
            </View>
        );
    }
}

/**
 * Prop types for validation.
 */
FormHeader.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
};

/**
 * The stylesheet of this page.
 */
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
    },
    textCenter: {
        textAlign: 'center'
    }
});

export default FormHeader;

