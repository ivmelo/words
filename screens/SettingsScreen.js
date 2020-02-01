import React from 'react';
import {
    ScrollView, 
    Alert,
    ToastAndroid,
} from 'react-native';
import { Notifications } from 'expo';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as MailComposer from 'expo-mail-composer';
import Entry from '../models/Entry';
import FormHeader from '../components/FormHeader';
import FormSwitch from '../components/FormSwitch';
import FormButton from '../components/FormButton';
import Settings from '../classes/Settings';
import SimpleTimePicker from '../components/SimpleTimePicker';

/**
 * The Settings screen of the app. Used to add and edit entries.
 */
class SettingsScreen extends React.Component {
    state = {
        // PIN/Settings hour.
        pinLock: false,
        fingerprintLock: false,

        // Daily reminder/notification.
        dailyReminder: false,
        isPickingTime: false,
        dailyReminderTime: {
            hour: 9,
            minute: 0,
            ampm: 'PM'
        },

        // Backups.
        restoreBackupLabel: 'Restore backup',
        backupEntriesLabel: 'Backup entries',
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
        let dailyReminderTime = await Settings.get('dailyReminderTime', false);

        let stateSettings = {
            pinLock, 
            fingerprintLock,
            dailyReminder
        };        

        if (dailyReminderTime) {
            stateSettings.dailyReminderTime = dailyReminderTime;
        }

        this.setState(stateSettings);
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
     * Called when the time changes in the time picker.
     * 
     * @param {Number} hour 
     * @param {Number} minute 
     * @param {String} ampm 
     */
    onTimeChange(hour, minute, ampm) {
        this.setState({
            dailyReminderTime: {
                hour, 
                minute,
                ampm
            }
        });
    }

    /**
     * Sets the state of fingerprint lock.
     * 
     * @param {boolean} status Status of fingerprint lock.
     */
    async setDailyReminderStatus(status) {
        if (status) {
            await this.enableAndSetDailyReminders();
        } else {
            await this.disableDailyReminders();
        }
        
        await Settings.set('dailyReminder', status);
        this.setState({dailyReminder: status});
    }

    /**
     * Called when the user is done picking daily reminders.
     */
    async onDonePickingDailyReminderTime() {
        this.enableAndSetDailyReminders();
    }

    /**
     * Enable daily reminders save settings object and schedule notifications.
     */
    async enableAndSetDailyReminders() {
        let now = new Date();
        let hour = this.state.dailyReminderTime.hour;

        // Convert hour to 24 hour format.
        if (this.state.dailyReminderTime.ampm == 'PM' && hour < 12) {
            hour += 12;
        } else if (this.state.dailyReminderTime.ampm == 'AM' && hour == 12) {
            hour -= 12;
        }

        let notificationTime = new Date(
            now.getFullYear(), 
            now.getMonth(), 
            now.getDate(), 
            hour, 
            this.state.dailyReminderTime.minute
        );

        if (now.getTime() >= notificationTime.getTime()) {
            // Hour already passed for today, schedule the first one for tomorrow.
            notificationTime = new Date(notificationTime.getTime() + 86400000);
        }

        let notificationContent = {
            title: 'How was your day?',
            body: 'Don\'t forget to write a few Words in your journal.'
        };

        let notificationSchedule = {
            time: notificationTime,
            // repeat: 'minute', // For testing... (minute, hour, day, week, month, year)
            repeat: 'day'
        };

        try {
            // First we cancel all notifications with the old schedule.
            await Notifications.cancelAllScheduledNotificationsAsync();
            // Then, we create schedule the new repeating one.
            await Notifications.scheduleLocalNotificationAsync(notificationContent, notificationSchedule);
            // Save current daily reminder time.
            await Settings.set('dailyReminder', true);
            await Settings.set('dailyReminderTime', this.state.dailyReminderTime);

            this.setState({
                dailyReminder: true,
                isPickingTime: false
            });
            console.log('Notification scheduled!');
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Disable all daily reminders, cancel notifications and save settings.
     */
    async disableDailyReminders() {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            // Save current daily reminder time.
            await Settings.set('dailyReminder', false);
            await Settings.remove('dailyReminderTime');
            console.log('Notification unscheduled!');
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
                        onPress: async () => {
                            await Settings.secureDelete('accessCode');
                            await Settings.remove('fingerprintLock');
                            this.setState({
                                pinLock: false,
                                fingerprintLock: false
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
                <FormHeader 
                    title="Security" 
                    subtitle="Protect your journal with a PIN (Personal Access Code) or fingerprints. You will be prompted to use your PIN or fingerprints every time you open the app.">
                </FormHeader>
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

                <FormHeader 
                    title="Daily Reminder"
                    subtitle="You can receive a daily notification so you don't forget to write in your journal.">
                </FormHeader>
                <FormSwitch 
                    description="Enable daily reminder" 
                    thumbColor="#2ecc71" 
                    value={this.state.dailyReminder} 
                    disabled={false}
                    onValueChange={(status) => this.setDailyReminderStatus(status)}
                ></FormSwitch>
                <FormButton
                    label={'Send notification at ' + this.state.dailyReminderTime.hour + ':' + (this.state.dailyReminderTime.minute < 10 ? '0' + this.state.dailyReminderTime.minute : this.state.dailyReminderTime.minute) + this.state.dailyReminderTime.ampm}
                    onPress={() => {
                        this.setState({isPickingTime: true})
                    }}
                >
                </FormButton>
                
                <SimpleTimePicker
                    visible={this.state.isPickingTime}
                    onRequestClose={() => this.onDonePickingDailyReminderTime()}
                    hour={this.state.dailyReminderTime.hour}
                    minute={this.state.dailyReminderTime.minute}
                    ampm={this.state.dailyReminderTime.ampm}
                    onTimeChange={(hour, minute, ampm) => this.onTimeChange(hour, minute, ampm)}
                >
                </SimpleTimePicker>

                <FormHeader 
                    title="App Data" 
                    subtitle="It's recommended to backup your journal regularly in order to keep your entries safe. This is the only way of recovering your entries in case your device is lost, broken or stolen. Make sure you keep your backups in a safe place such as a cloud storage service.">
                </FormHeader>
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

                <FormHeader 
                    title="Feedback and Support"
                    subtitle="If you have any questions, feedback or need help, please get in touch and we'll get back to you as soon as possible. Feature requests are welcome."
                ></FormHeader>
                <FormButton
                    label="Contact the developer"
                    onPress={() => {
                        MailComposer.composeAsync({
                            recipients: ['hello.words@outlook.com'],
                            subject: 'Words App Feedback'
                        }).then((status) => {
                            ToastAndroid.show('Thank You!', ToastAndroid.SHORT);
                        });
                    }}
                ></FormButton>

                <FormHeader
                    subtitle="Words for Android is developed with <3 in beautiful Kingston, Canada by I. Melo. [v0.1.0, January 2020]"
                ></FormHeader>
            </ScrollView>
        )
    }
}

export default SettingsScreen;
