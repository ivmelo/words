import React from 'react';
import {
    StyleSheet, 
    ScrollView, 
    Alert,
    ToastAndroid,
} from 'react-native';
import { Notifications } from 'expo';
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
import Settings from '../classes/Settings';

const reminderMessages = [
    'How was your day?',
    'Time to practice writing.',
    'Keep your memories forever.',
    'Keep track of your life.',
    'Live today, remember tomorrow.',
];


/**
 * The Settings screen of the app. Used to add and edit entries.
 */
class SettingsScreen extends React.Component {
    state = {
        name: '',
        pinLock: false,
        fingerprintLock: false,
        dailyReminder: false,
        selectedItem: 1,
        restoreBackupLabel: 'Restore backup',
        backupEntriesLabel: 'Backup entries',
        selectItems: [ // Array of colors for theming.
            {
                label: '#007cbc',
                value: 1
            }
        ],

        selectedDailyReminderTime: 4,
        availableDailyReminderTimes: [ // Array of colors for theming.
            {
                label: '5:00pm',
                value: 1
            },
            {
                label: '6:00pm',
                value: 2
            },
            {
                label: '7:00pm',
                value: 3
            },
            {
                label: '8:00pm',
                value: 4
            },
            {
                label: '9:00pm',
                value: 5
            },
            {
                label: '10:00pm',
                value: 6
            },
            {
                label: '11:00pm',
                value: 7
            },
            {
                label: '12:00am',
                value: 8
            },
            {
                label: '1:00am',
                value: 9
            },
            {
                label: '2:00am',
                value: 10
            },
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
        let pinLock = await Settings.secureGet('accessCode', false) ? true : false;
        let fingerprintLock = await Settings.get('fingerprintLock', false);
        let dailyReminder = await Settings.get('dailyReminder', false);

        console.log(dailyReminder);

        this.setState({
            pinLock, 
            fingerprintLock,
            dailyReminder
        });
    }

    /**
     * Sets the state of fingerprint lock.
     * 
     * @param {boolean} status Status of fingerprint lock.
     */
    async setFingerprintLock(status) {
        await Settings.set('fingerprintLock', status);
        this.setState({fingerprintLock: status});
    }

    /**
     * Sets the state of fingerprint lock.
     * 
     * @param {boolean} status Status of fingerprint lock.
     */
    async setDailyReminderStatus(status) {
        if (status) {
            Notifications.scheduleLocalNotificationAsync(
                {
                    title: 'Hey you!',
                    body: 'Don\'t forget to write a few Words in your journal.'
                }, 
                {
                    time: (new Date()).getTime() + 30000, // 30 secs from now.
                    repeat: 'minute'
                }
            ).then(data => {
                console.log('scheduled');
                console.log(data);
            }).catch(err => {
                console.log(err);
            });

        } else {
            this.disableDailyReminders();
        }
        await Settings.set('dailyReminder', status);
        this.setState({dailyReminder: status});
    }

    async setDailyReminderTime() {

    }

    /**
     * Disable all daily reminders.
     */
    async disableDailyReminders() {
        console.log('disabled');
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Removes all entries from the database.
     */
    async wipeEntries() {
        if (global.IS_RESTORING_BACKUP) {
            ToastAndroid.show('A backup is being restored in the background. Please wait.', ToastAndroid.SHORT);
            return;
        }

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
        if (global.IS_RESTORING_BACKUP) {
            ToastAndroid.show('A backup is being restored in the background. Please wait.', ToastAndroid.SHORT);
            return;
        }

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
            Alert.alert(
                'Warning',
                'Are you sure you want to remove your PIN? If you remove your PIN you will also disable fingerprint authentication and leave the app unsecured.',
                    [{ 
                        text: 'Cancel', 
                        style: 'cancel',
                        onPress: () => {
                            console.log('Cancelled [2]');
                        } 
                    },{
                        text: 'Remove PIN',
                        style: 'destructive',
                        onPress: () => {
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
                        },
                    }],
                {
                    cancelable: true
                }
            );            
            

        } else {
            console.log('create pin');

            this.props.navigation.navigate('AuthScreen', {
                mode: 'create'
            });

            
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
                    onValueChange={(status) => {
                        this.setFingerprintLock(status);
                    }}
                ></FormSwitch>

                <FormHeader title="Daily Reminder" subtitle="This feature is under construction. Right now you can trigger a test notification."></FormHeader>

                <FormSwitch 
                    description="Send daily reminder" 
                    thumbColor="#2ecc71" 
                    value={this.state.dailyReminder} 
                    disabled={false}
                    onValueChange={(status) => this.setDailyReminderStatus(status)}
                ></FormSwitch>

                <FormSelect header="Notification Time" 
                    items={this.state.availableDailyReminderTimes} 
                    value={this.state.selectedDailyReminderTime} 
                    onChangeValue={(value) => {
                    this.setState({selectedDailyReminderTime: value});
                    // let color = this.state.selectItems[v];
                    // global.THEME_COLOR = color.label;
                    // console.log();
                }}></FormSelect>


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