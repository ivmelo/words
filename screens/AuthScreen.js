import React from 'react';
import {AsyncStorage, Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

class HomeScreen extends React.Component {
    state = {
        message: 'Idle.'
    }

    async componentDidMount() {
        let needsAuth = false;
        
        try {
            let set = await AsyncStorage.getItem('auth_enabled');
            
            console.log(set);

            if (set) {
                let set = JSON.parse(set);
                if (set.auth_enabled) {
                    needsAuth = true;
                }
            }

        } catch (error) {
            console.log(error);
        }

        this.authenticate(! needsAuth);
    }

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
                    setTimeout(() => {
                        this.props.navigation.navigate('App');
                    });
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
        console.log(key);
    }

    render() {
        return (
            <View style={styles.mainView}>
                {/* <Button onPress={() => {
                    this.authenticateAsync();
                }} title="Press Me!"></Button> */}
                <Text>{this.state.message}</Text>

                <View style={styles.keyPad}>
                    <View style={styles.keyPadRow}>
                        <TouchableOpacity onPress={() => this.keyPressed(1)}>
                            <View style={styles.keyPadKey}>
                                <Text style={styles.keyPadKeyLabel}>1</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => this.keyPressed(2)}>
                            <View style={styles.keyPadKey}>
                                <Text style={styles.keyPadKeyLabel}>2</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.keyPressed(3)}>
                            <View style={styles.keyPadKey}>
                                <Text style={styles.keyPadKeyLabel}>3</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.keyPadRow}>
                        <TouchableOpacity onPress={() => this.keyPressed(4)}>
                            <View style={styles.keyPadKey}>
                                <Text style={styles.keyPadKeyLabel}>4</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.keyPressed(5)}>
                            <View style={styles.keyPadKey}>
                                <Text style={styles.keyPadKeyLabel}>5</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.keyPressed(6)}>
                            <View style={styles.keyPadKey}>
                                <Text style={styles.keyPadKeyLabel}>6</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.keyPadRow}>
                        <TouchableOpacity onPress={() => this.keyPressed(7)}>
                                <View style={styles.keyPadKey}>
                                <Text style={styles.keyPadKeyLabel}>7</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.keyPressed(8)}>
                            <View style={styles.keyPadKey}>
                                <Text style={styles.keyPadKeyLabel}>8</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.keyPressed(9)}>
                            <View style={styles.keyPadKey}>
                                <Text style={styles.keyPadKeyLabel}>9</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.keyPadRow}>
                        <TouchableOpacity onPress={() => this.keyPressed(0)}>
                                <View style={styles.keyPadKey}>
                                <Text style={styles.keyPadKeyLabel}>0</Text>
                            </View>
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
        // backgroundColor: '#2ecc71',
    },

    keyPad: {
        flex: 1
    },
    keyPadRow: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        // paddingHorizontal: 50,
        marginBottom: 25,
    },
    keyPadKey: {
        height: 70,
        width: 70,
        borderColor: '#333',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    keyPadKeyLabel: {
        fontSize: 30,
        color: '#333',
        fontWeight: '100',
        fontFamily: 'sans-serif-light'
    }
});

export default HomeScreen;
