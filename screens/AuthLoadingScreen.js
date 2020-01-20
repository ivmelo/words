import React from 'react';

import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    View,
} from 'react-native';

class AuthLoadingScreen extends React.Component {
    componentDidMount() {
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        AsyncStorage.getItem('auth_settings').then((data) => {
            let auth_settings = JSON.parse(data);
            if (auth_settings) {
                if (auth_settings.pin_lock) {
                    // This will switch to the App screen or Auth screen and this loading
                    // screen will be unmounted and thrown away.
                    this.props.navigation.navigate('Auth');
                }
            }
            this.props.navigation.navigate('App');
        }).catch(err => {
            this.props.navigation.navigate('App');
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