import React from 'react';
import {
    AsyncStorage, 
    Text, 
    StyleSheet, 
    View, 
    TouchableOpacity,
    Vibration
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons, EvilIcons } from '@expo/vector-icons';

class HomeScreen extends React.Component {
    state = {
        message: 'Idle.',
        pin: '',
        hiddenPin: '',
        icon: 'lock'
    }

    async componentDidMount() {
        let needsAuth = true;
        
        // try {
        //     let set = await AsyncStorage.getItem('auth_enabled');
            
        //     console.log(set);

        //     if (set) {
        //         let set = JSON.parse(set);
        //         if (set.auth_enabled) {
        //             needsAuth = true;
        //         }
        //     }

        // } catch (error) {
        //     console.log(error);
        // }

        this.authenticate(! needsAuth);
    }

    /**
     * Defines the navigation options of this screen including header title, color, buttons, etc...
     */
    static navigationOptions = {
        header: null
    };

    authenticate(skipAuth = false) {
        
        // If auth is disabled of the app is being tested...
        if (skipAuth) {
            this.props.navigation.navigate('App');
            return;
        }

        LocalAuthentication.hasHardwareAsync().then((hasHardware => {
            console.log(hasHardware);

            this.setState({message: 'Please place fingerprint...'});

            LocalAuthentication.authenticateAsync().then(authenticated => {
                console.log(authenticated);

                this.setState({message: JSON.stringify(authenticated)});

                if (authenticated.success) {
                    this.setState({icon: 'unlock'});

                    setTimeout(() => {
                        this.props.navigation.navigate('App');
                    }, 1000);
                }
                // SUCCESS
            }).catch(error => {
                // ERROR AUTHENTICATING
                this.setState({message: JSON.stringify(authenticated)});
            });
        })).catch(error => {
            // NO AUTH HARDWARE
            this.setState({message: JSON.stringify(authenticated)});
        });
    }

    keyPressed(key) {
        Vibration.vibrate(4);
        let pin = this.state.pin;
        
        if (key === 'backspace') {
            if (pin.length > 0) {
                pin = pin.slice(0, -1);
            }
        } else if (key === 'ok') {
            // Do nothing for now.
        } else {
            pin = pin + String(key);
        }

        let hiddenPin = '●'.repeat(pin.length);
        console.log('*'.repeat(pin.length));
        console.log(this.state.pin);
        this.setState({pin, hiddenPin});
    }

    clearPin() {
        Vibration.vibrate(4);
        this.setState({pin: '', hiddenPin: ''});
    }

    render() {
        return (
            <View style={styles.mainView}>
                {/* <Button onPress={() => {
                    this.authenticateAsync();
                }} title="Press Me!"></Button> */}
                

                <View>
                    <Text>{this.state.message}</Text>
                </View>

                <View style={{backgroundColor: '#fff', width: 120, height: 120, justifyContent: 'center', borderRadius: 100}}>
                    <EvilIcons name={this.state.icon} size={100} style={{color: '#444', alignSelf: 'center'}}/>
                </View>

                <View>
                    <Text style={styles.pin}>{this.state.hiddenPin}</Text>   
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
                        <TouchableOpacity onPress={() => this.keyPressed('ok')} style={styles.keyPadKey}>
                            <Ionicons name="md-checkmark" size={25} style={styles.keyPadKeyLabel}/>
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
        // backgroundColor: global.THEME_COLOR,
        flexDirection: 'column',
        backgroundColor: global.THEME_COLOR,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    keyPad: {
        // flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        // borderWidth: 1,
        // // marginBottom: 0
        // borderTopLeftRadius: 15,
        // borderTopRightRadius: 15,
        // paddingTop: 25
        paddingBottom: 20,
        paddingTop: 20
    },
    keyPadRow: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        // paddingHorizontal: 50,
        marginBottom: 0,
    },
    keyPadKey: {
        // height: 50,
        // width: 50,
        borderColor: '#000',
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 10,
        paddingHorizontal: 30,
        paddingVertical:10,
    },
    keyPadKeyLabel: {
        fontSize: 30,
        color: '#444',
        fontWeight: 'bold',
        // fontFamily: 'sans-serif-light'
    },
    pin: {
        color: '#fff', 
        fontSize: 15, 
        letterSpacing: 5,
        fontWeight: 'bold'
    }
});

export default HomeScreen;
