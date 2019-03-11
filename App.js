import { Platform } from 'react-native';
import {createStackNavigator, createAppContainer, SafeAreaView} from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import AddEntryScreen from './screens/AddEntryScreen';
import SettingsScreen from './screens/SettingsScreen';

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}

const AppNavigator = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
    },
    AddEntryScreen: {
      screen: AddEntryScreen,
    },
    SettingsScreen: {
      screen: SettingsScreen,
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        // backgroundColor: '#7454db',
        backgroundColor: '#2ecc71',
        elevation: 1,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  }
);

export default createAppContainer(AppNavigator);