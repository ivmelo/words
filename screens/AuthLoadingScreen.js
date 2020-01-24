import React from 'react';
import { View } from 'react-native';
import Settings from '../classes/Settings';

class AuthLoadingScreen extends React.Component {
    componentDidMount() {
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        let authEnabled = Settings.secureGet('accessCode', false) ? true : false

        if (authEnabled) {
            this.props.navigation.navigate('Auth');
        } else {
            this.props.navigation.navigate('App');
        }
    };

    // Render any loading content that you like here
    render() {
        return (
            <View>
                {/* <ActivityIndicator /> */}
                {/* <StatusBar barStyle="default" /> */}
            </View>
        );
    }
}

export default AuthLoadingScreen;
