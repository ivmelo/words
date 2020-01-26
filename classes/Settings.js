import { AsyncStorage } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Class Settings is an abstraction of AsyncStorage and SecureStore to store app preferences.
 */
class Settings {
    /**
     * Retrieves an element from the settings.
     * 
     * @param {String} key The key of the object to be retrieved.
     * @param {Object} defaultVal The default value to be returned in case it's empty.
     */
    static async get(key, defaultVal) {
        try {
            let settingsJson = await AsyncStorage.getItem(key);
            let settingsObject = JSON.parse(settingsJson);
            if (settingsObject) {
                return settingsObject.value;
            }
            return defaultVal;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Saves an element into the settings object.
     * 
     * @param {String} key The key of the element to be stored.
     * @param {Boolean} value The value of the object to be stored.
     */
    static async set(key, value) {
        try {
            let settingsJson = JSON.stringify({value: value});
            await AsyncStorage.setItem(key, settingsJson);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Removes an element from the settings object.
     * 
     * @param {String} key The key of the element to be deleted.
     */
    static async remove(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Retrieves an element from the SecureStore.
     * 
     * @param {String} key The key of the object to be retrieved.
     * @param {Object} defaultVal The default value to be returned in case it's empty.
     */
    static async secureGet(key, defaultVal) {
        try {
            let secureJson = await SecureStore.getItemAsync(key);
            let secureObject = JSON.parse(secureJson);
            if (secureObject) {
                return secureObject.value;
            }
            return defaultVal;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Saves an element to the SecureStore.
     * 
     * @param {String} key The key of the element to be stored.
     * @param {Boolean} value The value of the object to be stored.
     */
    static async secureSet(key, value) {
        try {
            let secureJson = JSON.stringify({value: value});
            await SecureStore.setItemAsync(key, secureJson);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Deletes an element from the SecureStore.
     * 
     * @param {String} key The key of the element to be deleted.
     */
    static async secureDelete(key) {
        try {
            await SecureStore.deleteItemAsync(key);
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default Settings;
