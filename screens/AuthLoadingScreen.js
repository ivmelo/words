import React from 'react';

import {
    ActivityIndicator,
    StatusBar,
    View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

class AuthLoadingScreen extends React.Component {
    componentDidMount() {
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        SecureStore.getItemAsync('access_pin').then((secret) => {
            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            if (secret) {
                this.props.navigation.navigate('Auth');
            } else {
                this.props.navigation.navigate('App');
            }
        }).catch(err => {
            // Error fetching access pin. 
            // This should NEVER happen.
        });
    };

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

export default AuthLoadingScreen;