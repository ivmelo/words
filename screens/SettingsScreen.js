import React from 'react';
import {
    StyleSheet, 
    AsyncStorage, 
    ScrollView, 
    Alert,
    ToastAndroid
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as MailComposer from 'expo-mail-composer';
import * as SecureStore from 'expo-secure-store';
import Entry from '../models/Entry';
import FormHeader from '../components/FormHeader';
import FormSwitch from '../components/FormSwitch';
import FormSelect from '../components/FormSelect';
import FormButton from '../components/FormButton';


/**
 * The Settings screen of the app. Used to add and edit entries.
 */
class SettingsScreen extends React.Component {
    state = {
        name: '',
        pinLock: false,
        fingerprintLock: false,
        selectedItem: 1,
        restoreBackupLabel: 'Restore backup',
        backupEntriesLabel: 'Backup entries',
        selectItems: [ // Array of colors for theming.
            {
                label: '#007cbc',
                value: 1
            }
        ]
    };

    /**
     * Defines the navigation options of this screen including header title, color, buttons, etc...
     */
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Settings',
        }
    };

    /**
     * React Native LifeCycle. Called when component is mounted.
     */
    async componentDidMount() {
        // AsyncStorage.getItem('auth_settings').then((data) => {
        //     let auth_settings = JSON.parse(data);
        //     if (auth_settings) {
        //         this.setState({
        //             pinLock: auth_settings.pin_lock,
        //             fingerprintLock: auth_settings.fingerprint_lock
        //         });
        //     } else {
        //         this.setState({
        //             pinLock: false,
        //             fingerprintLock: false
        //         });
        //     }
        //     console.log(auth_settings);
        // }).catch(err => {
        //     console.log(err);
        // });
        SecureStore.getItemAsync('access_pin').then((secret) => {
            if (secret) {
                this.setState({pinLock: true});
            }
        }).catch(err => {
            // Error fetching access pin. 
            // This should NEVER happen.
        });
    }

    /**
     * React Native LifeCycle. Called when component will unmount.
     */
    async componentWillUnmount() {
        // TODO: Save settings...
        console.log('Unmounting...');
    }

    /**
     * Removes all entries from the database.
     */
    async wipeEntries() {
        // Works on both Android and iOS
        Alert.alert(
            'WARNING',
            'Are you sure you want to delete all diary entries? Once you delete your entries there will be no way to recover them unless you have a backup file to import.',
                [{
                    text: 'Delete All Entries',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            'WARNING',
                            'Press DELETE to DELETE ALL ENTRIES or CANCEL.',
                                [{
                                    text: 'DELETE',
                                    style: 'destructive',
                                    onPress: () => {
                                        Entry.destroyAll().then(async (entries) => {
                                            ToastAndroid.show('Entries deleted', ToastAndroid.SHORT);
                                        }).catch(err => {
                                            console.log(err);
                                        });
                                    },
                                },
                                { 
                                    text: 'Cancel', 
                                    style: 'cancel',
                                    onPress: () => {
                                        console.log('Cancelled [2]');
                                    } 
                                }],
                            {
                                cancelable: true
                            }
                        );
                    },
                },
                { 
                    text: 'Cancel', 
                    style: 'cancel',
                    onPress: () => {
                        console.log('Cancelled [1]')
                    } 
                }],
            {
                cancelable: true
            }
        );
    }

    /**
     * Restores a backup from a JSON file.
     */
    async restoreBackup() {
        if (global.IS_RESTORING_BACKUP) {
            ToastAndroid.show('A backup is being restored in the background. Please wait.', ToastAndroid.SHORT);
            return;
        }

        try {
            global.IS_RESTORING_BACKUP = true;
            let resp = await DocumentPicker.getDocumentAsync();
            let string = await FileSystem.readAsStringAsync(resp.uri);

            this.setState({
                restoreBackupLabel: 'Validating backup file, please wait...'
            });

            let entrySet = JSON.parse(string);
            let totalEntries = entrySet.length;

            // Validate all fields of the backup file...
            for(let i = 0; i < totalEntries; i++) {
                let record = entrySet[i];

                if (typeof record.date === 'undefined' || isNaN(new Date(record.date).getTime())) {
                    throw 'Invalid file...';
                }


                if (typeof record.created_at === 'undefined' || isNaN(new Date(record.date).getTime())) {
                    throw 'Invalid file...';
                }

                if (typeof record.updated_at === 'undefined' || isNaN(new Date(record.date).getTime())) {
                    throw 'Invalid file...';
                }

                if (typeof record.entry !== 'string') {
                    throw 'Invalid file...';
                }

                this.setState({
                    restoreBackupLabel: 'Validating backup file... [' + i + '/' + totalEntries + ']'
                });
            }

            for(let i = 0; i < totalEntries; i++) {
                let record = entrySet[i];
                let entry = new Entry();
                entry.date = new Date(record.date);
                entry.created_at = new Date(record.created_at);
                entry.updated_at = new Date(record.updated_at);
                entry.entry = record.entry;
    
                await entry.save();
    
                this.setState({
                    restoreBackupLabel: 'Importing entries... [' + i + '/' + totalEntries + ']'
                });
                console.log(i);
            }

            ToastAndroid.show('Backup restored successfully.', ToastAndroid.SHORT);
        } catch (err) {
            ToastAndroid.show('Invalid file. Please try again.', ToastAndroid.SHORT);
        }

        global.IS_RESTORING_BACKUP = false;

        this.setState({
            restoreBackupLabel: 'Restore backup'
        });
    }
    
    /**
     * Generates a JSON file for backup and shares so the user can save wherever they want.
     */
    async backupEntries() {
        this.setState({
            backupEntriesLabel: 'Creating backup file...'
        });

        Entry.all().then(async (entries) => {
            let entriesJson = JSON.stringify(entries);
            let fileName ='words-backup-' + Date.now() + '.json';
            const fileUri = FileSystem.cacheDirectory + fileName;
            await FileSystem.writeAsStringAsync(fileUri, entriesJson, { encoding: FileSystem.EncodingType.UTF8 });
            await Sharing.shareAsync(FileSystem.cacheDirectory + fileName);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            this.setState({
                backupEntriesLabel: 'Backup entries'
            });
        });
    }

    async togglePin() {
        if (this.state.pinLock) {
            console.log('remove pin');
            
            SecureStore.deleteItemAsync('access_pin').then(() => {
                this.setState({
                    pinLock: false,
                    fingerprintLock: false
                });
            }).catch(err => {
                // Error creating access pin. 
                // This should NEVER happen.
                console.log('Error removing pin...');
            });

        } else {
            console.log('create pin');
            this.props.navigation.navigate('AuthScreen');
        }
    }

    /**
     * React Native Render function.
     */
    render() {
        return (
            <ScrollView>
                
                <FormHeader title="Security" subtitle="You can secure your diary with a PIN or fingerprint. If you chose to do so, you will be propted to enter your PIN or fingerprints when opening the app."></FormHeader>
                <FormButton
                    label={this.state.pinLock ? 'Remove access PIN' : 'Set access PIN'}
                    onPress={() => this.togglePin()}
                ></FormButton>

                <FormSwitch 
                    description="Fingerprint lock" 
                    thumbColor="#2ecc71" 
                    value={this.state.fingerprintLock} 
                    disabled={! this.state.pinLock}
                    onValueChange={async (newValue) => {
                    let set = JSON.stringify({auth_enabled: newValue});
                    await AsyncStorage.setItem('auth_enabled', set);
                    console.log(set);
                    this.setState({fingerprintLock: newValue});
                }}></FormSwitch>

                


                {/* <FormHeader title="Appearance"></FormHeader>
                <FormInput label="Preview Lines" keyboardType="number-pad"></FormInput>


                <FormSelect label="demo" items={this.state.selectItems} value={this.state.selectedItem} onChangeValue={(v) => {
                    this.setState({selectedItem: v});
                    let color = this.state.selectItems[v];
                    global.THEME_COLOR = color.label;
                    // console.log();
                }}></FormSelect> */}

                {/* <FormHeader title="Daily Reminder" subtitle="Setting a daily reminder will send you a notification every day at the defined time, so you never forget to write about your day."></FormHeader> */}


                <FormHeader title="Your Data" subtitle="You can use this section to backup your data or import a previous backup. Make sure you do this regularly in order to keep your entries safe. This is the only way of restoring your data in case your device is lost, broken or stolen."></FormHeader>

                <FormButton
                    label={this.state.backupEntriesLabel}
                    onPress={() => {
                        this.backupEntries();
                    }}
                ></FormButton>

                <FormButton
                    label={this.state.restoreBackupLabel}
                    onPress={() => {
                        this.restoreBackup();
                    }}
                ></FormButton>

                <FormButton
                    label="Delete all entries"
                    onPress={() => {
                        this.wipeEntries();
                    }}
                ></FormButton>

                <FormHeader title="Feedback and Support"></FormHeader>
                <FormButton
                    label="Contact the developer"
                    onPress={() => {
                        MailComposer.composeAsync({
                            recipients: ['meloivanilson@gmail.com'],
                            subject: 'Words App Feedback'
                        }).then((status) => {
                            ToastAndroid.show('Thank You!', ToastAndroid.SHORT);
                        });
                    }}
                ></FormButton>

                <FormHeader
                    subtitle="Words for Android is developed with ❤ in beautiful Kingston, Canada by I. Melo."
                ></FormHeader>
            </ScrollView>
        )
    }
}

var styles = StyleSheet.create({

});

export default SettingsScreen;