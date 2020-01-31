import React from 'react';
import {
    Text, 
    StyleSheet, 
    View, 
    TouchableOpacity,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import Settings from '../classes/Settings';

/**
 * The Auth Screen of the app.
 */
class AuthScreen extends React.Component {
    state = {
        mode: 'auth', // auth|create|update.
        step: 0,
        isAuthenticated: false,
        fingerprintLock: false,
        message: '',
        accessCode: '0000000000', // 10 Chars is more than pinpad can take.
        pin: '',
        hiddenPin: '',
        confirmPin: '',
        icon: 'md-lock',
        iconColor: '#555',
        actionKeyIcon: 'md-finger-print'
    }

    /**
     * Defines the navigation options of this screen including header title, colour, buttons, etc...
     */
    static navigationOptions = {
        header: null // NULL removes the header and navigation buttons.
    };


    /**
     * React Native LifeCycle. Called when component is mounted.
     */
    async componentDidMount() {        
        let mode = this.props.navigation.getParam('mode', 'auth');
        this.setState({mode});

        if (mode === 'auth') {
            let accessCode = await Settings.secureGet('accessCode');
            let fingerprintLock = await Settings.get('fingerprintLock', false);

            this.setState({
                accessCode: accessCode,
                fingerprintLock
            }, function() {
                if (fingerprintLock) {
                    this.authenticateWithFingerprint();
                } else {
                    this.authenticateWithPin();
                }
            });
        } else if (mode === 'create') {
            this.createPin(1);
        }
    }

    /**
     * Display messages and icons for user to authenticate with a PIN.
     */
    authenticateWithPin() {
        // If regular auth
        this.setState({
            message: 'Please enter your PIN',
            actionKeyIcon: 'md-checkmark',
            icon: 'md-lock',
        });
    }

    /**
     * Prompts the user to create a PIN.
     * 
     * @param {int} step The current step in the creation process.
     */
    async createPin(step = 1) {
        if (step === 1) { // In step 1, the user creates a PIN.
            this.setState({
                message: 'Create PIN (4-8 digits)',
                actionKeyIcon: 'md-checkmark',
                icon: 'md-key',
                pin: '',
                hiddenPin: '',
                confirmPin: '',
                step: 1
            });
        } if (step === 2) { // In step 2, the user confirms the PIN.
            if (this.state.pin.length < 4) {
                this.setState({
                    message: 'Too short. Create PIN (4-8 digits)',
                    actionKeyIcon: 'md-checkmark',
                    icon: 'md-key',
                    pin: '',
                    hiddenPin: '',
                    step: 1
                });
            } else {
                this.setState({
                    message: 'Confirm PIN',
                    actionKeyIcon: 'md-checkmark',
                    icon: 'md-key',
                    pin: '',
                    hiddenPin: '',
                    confirmPin: this.state.pin,
                    step: 2
                });
            }
            
        } if (step === 3) { // In step 3, the system confirms the PIN, saves and redirects.
            if (this.state.pin === this.state.confirmPin) {
                // Success.
                await Settings.secureSet('accessCode', this.state.pin);

                this.setState({
                    isAuthenticated: true,
                    icon: 'md-checkmark',
                    iconColor: global.THEME_COLOR
                });

                // Wait a second and redirect back to the settings screen.
                window.setTimeout(() => {
                    this.props.navigation.navigate('SettingsScreen');
                }, 1000)
            } else {
                // PINs are different, try again.
                this.createPin(1);
            }
        }
    }
    
    /**
     * Gives the user the option to authenticate using biometrics.
     */
    authenticateWithFingerprint() {
        LocalAuthentication.hasHardwareAsync().then(((hasHardware) => {
            // Device supports biometric auth. Proceed.
            this.setState({
                icon: 'ios-finger-print',
                iconColor: '#555',
                message: 'Place fingerprint or enter PIN',
            });

            LocalAuthentication.authenticateAsync().then(authenticated => {
                // Called when user scans their finger or face.
                if (authenticated.success) {
                    this.authenticated('fingerprint');
                    return;
                } else if (authenticated.error === 'authentication_failed') {
                    // Auth failed. Try again.
                    this.setState({
                        icon: 'md-lock',
                        iconColor: '#555',
                        message: 'Error, please try again.',
                    });

                    window.setTimeout(() => {
                        this.authenticateWithFingerprint();
                    }, 500);
                } else {
                    // Authentication error. Sometimes happens after too many attempts.
                    // Proceed with PIN.
                    this.authenticateWithPin();
                }
            }).catch((error) => {
                // Error when trying biometrics. Proceed with PIN.
                this.authenticateWithPin();
            });
        })).catch((error) => {
            // The device has no biometric auth hardware.
            this.authenticateWithPin();
        });
    }
    
    /**
     * Called when the user sucessfully authenticated with the fingerprint or PIN.
     * 
     * @param {string} method The authentication method (pin, fingerprint).
     */
    authenticated(method = 'pin') { // pin or hardware
        let icon  = method === 'pin' ? 'md-unlock' : 'ios-finger-print';

        this.setState({
            icon: icon,
            iconColor: global.THEME_COLOR,
            message: 'Success!',
            isAuthenticated: true
        });

        setTimeout(() => {
            this.props.navigation.navigate('App');
        }, 1000);
    }
    

    /**
     * Handler for key pressed on PINpad.
     * 
     * @param {string} key 
     */
    keyPressed(key) {
        if (this.state.isAuthenticated) {
            // If authentication succeeded, keyboard is disabled. 
            return;
        }

        // Fetches previous PIN for manipulation.
        let pin = this.state.pin;

        // Clear message when user starts typing.
        if (this.state.mode === 'auth') {
            this.setState({
                message: '',
                icon: 'md-lock'
            });
        }
        
        if (key === 'backspace') { // Backspacing...
            if (pin.length > 0) {
                pin = pin.slice(0, -1);
            }
        } else if (key === 'action') { // Action key pressed (bottom left).
            if (this.state.mode === 'create') {
                // Advance to the next step.
                this.createPin(this.state.step + 1); 
            } else if (this.state.mode === 'auth') {
                // Check if PIN is correct.
                this.checkPin(); 
            }
            return;
        } else {
            // 8 chars max. Ignores input if length > 7.
            if (pin.length < 8) { 
                pin = pin + String(key);
            }
        }

        // Display ● symbol instead of actual PIN & update screen.
        let hiddenPin = '●'.repeat(pin.length);
        this.setState({pin, hiddenPin}, () => {
            // If in auth mode, check if pin is correct automatically.
            if (this.state.mode === 'auth' && this.state.pin.length === this.state.accessCode.length) {
                this.checkPin(pin);
            }
        });
    }
    
    /**
     * Checks if a PIN matches and authenticates user.
     */
    checkPin() {
        if (this.state.pin === this.state.accessCode) {
            this.authenticated('pin');
        } else {
            this.setState({
                icon: 'md-lock',
                pin: '', // For visual feedback, don't erase hidden pin until user starts typing again. 
                message: 'Incorrect PIN, please try again.',
            });
        }
    }

    /**
     * Clears the PIN input field.
     */
    clearPin() {
        this.setState({pin: '', hiddenPin: ''});
    }

    /**
     * React Native Render function.
     */
    render() {
        return (
            <View style={[styles.mainView, {backgroundColor: global.THEME_COLOR}]}>
                <View style={styles.feedbackBox}>
                    <View style={styles.feedbackIconBox}>
                        <Ionicons name={this.state.icon} size={50} style={{color: this.state.iconColor, alignSelf: 'center'}}/>
                    </View>
                    <Text style={styles.pin}>{this.state.hiddenPin}</Text>  
                    <Text style={styles.message}>{this.state.message}</Text>
                </View>

                <View style={styles.keyPad}>
                    <View style={styles.keyPadRow}>
                        <TouchableOpacity onPress={() => this.keyPressed(1)} style={styles.keyPadKey}>
                            <Text style={styles.keyPadKeyLabel}>1</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => this.keyPressed(2)} style={styles.keyPadKey}>
                            <Text style={styles.keyPadKeyLabel}>2</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.keyPressed(3)} style={styles.keyPadKey}>
                            <Text style={styles.keyPadKeyLabel}>3</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.keyPadRow}>
                        <TouchableOpacity onPress={() => this.keyPressed(4)} style={styles.keyPadKey}>
                            <Text style={styles.keyPadKeyLabel}>4</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => this.keyPressed(5)} style={styles.keyPadKey}>
                            <Text style={styles.keyPadKeyLabel}>5</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.keyPressed(6)} style={styles.keyPadKey}>
                            <Text style={styles.keyPadKeyLabel}>6</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.keyPadRow}>
                        <TouchableOpacity onPress={() => this.keyPressed(7)} style={styles.keyPadKey}>
                            <Text style={styles.keyPadKeyLabel}>7</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => this.keyPressed(8)} style={styles.keyPadKey}>
                            <Text style={styles.keyPadKeyLabel}>8</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.keyPressed(9)} style={styles.keyPadKey}>
                            <Text style={styles.keyPadKeyLabel}>9</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.keyPadRow}>
                        <TouchableOpacity onPress={() => this.keyPressed('action')} style={styles.keyPadKey}>
                            <Ionicons name={this.state.actionKeyIcon} size={25} style={styles.keyPadKeyLabel}/>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => this.keyPressed(0)} style={styles.keyPadKey}>
                            <Text style={styles.keyPadKeyLabel}>0</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onLongPress={() => this.clearPin()} onPress={() => this.keyPressed('backspace')} style={styles.keyPadKey}>
                            <Ionicons name="md-backspace" size={25} style={styles.keyPadKeyLabel}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    mainView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    keyPad: {
        backgroundColor: '#fff',
        width: '100%',
        paddingBottom: 30,
        paddingTop: 30,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    },
    keyPadRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 0,
    },
    keyPadKey: {
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical:10,
    },
    keyPadKeyLabel: {
        fontSize: 30,
        color: '#555',
        fontWeight: 'bold',
    },
    feedbackBox: {
        flexGrow: 1, 
        width: '100%', 
        justifyContent: 
        'space-around', 
        alignItems: 'center',
        paddingTop: 80
    },
    feedbackIconBox: {
        backgroundColor: '#fff', 
        width: 120, 
        height: 120, 
        justifyContent: 'center', 
        borderRadius: 100,
    },
    pin: {
        color: '#fff', 
        fontSize: 15, 
        letterSpacing: 5,
        fontWeight: 'bold'
    },
    message: {
        fontSize: 18,
        color: '#fff'
    }
});

export default AuthScreen;
