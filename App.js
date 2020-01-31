import {
    Platform
} from 'react-native';
import {
    createStackNavigator,
    createAppContainer,
    createSwitchNavigator,
    SafeAreaView
} from 'react-navigation';

import HomeScreen from './screens/HomeScreen';
import EntryScreen from './screens/EntryScreen';
import SettingsScreen from './screens/SettingsScreen';
import AuthScreen from './screens/AuthScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';

if (Platform.OS === 'android') {
    SafeAreaView.setStatusBarHeight(0);
}

global.THEME_COLOR = '#2ecc71';
global.IS_RESTORING_BACKUP = false;
// global.THEME_COLOR = '#000';

const AuthStack = createStackNavigator({
    AuthScreen: AuthScreen
});

const AppStack = createStackNavigator({
    HomeScreen: {
        screen: HomeScreen,
    },
    EntryScreen: {
        screen: EntryScreen,
    },
    SettingsScreen: {
        screen: SettingsScreen,
    }
}, {
    defaultNavigationOptions: {
        headerStyle: {
            // backgroundColor: '#7454db',
            backgroundColor: global.THEME_COLOR,
            elevation: 1,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            // fontWeight: 'bold',
        },
    }
});

// export default createAppContainer(AppStack);

export default createAppContainer(createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
}, {
    initialRouteName: 'AuthLoading',
    // initialRouteName: 'App',
}));