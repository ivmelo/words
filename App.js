import {
    Platform
} from 'react-native';
import {
    createStackNavigator,
    createAppContainer,
    SafeAreaView
} from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import EntryScreen from './screens/EntryScreen';
import SettingsScreen from './screens/SettingsScreen';

// if (Platform.OS === 'android') {
//   SafeAreaView.setStatusBarHeight(0);
// }

const AppNavigator = createStackNavigator({
    HomeScreen: {
        screen: HomeScreen,
    },
    EntryScreen: {
        screen: EntryScreen,
    },
    SettingsScreen: {
        screen: SettingsScreen,
    },
}, {
    defaultNavigationOptions: {
        headerStyle: {
            // backgroundColor: '#7454db',
            // backgroundColor: '#2ecc71',
            backgroundColor: '#2ecc71',
            elevation: 1,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    }
});

export default createAppContainer(AppNavigator);