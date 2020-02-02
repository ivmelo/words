import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    /** Navbar Icons */
    navbarIconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navbarIcon: {
        color: '#fff',
        fontSize: 25,
    },

    /** Floating Button **/
    floatingButton: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: global.THEME_COLOR,
        position: 'absolute',
        bottom: 20,                                                   
        right: 20,
        elevation: 1,
    },
    floatingButtonIcon: {
        fontSize: 30,
        color: '#fff'
    },

    /** Spacing **/
    marginLeftLg: {
        marginLeft: 16,
    },
    marginRightLg: {
        marginRight: 16,
    },
    marginLeftSm: {
        marginLeft: 10,
    },
    marginRightSm: {
        marginRight: 10
    },

    flexDirectionRow: {
        flexDirection: 'row'
    },

    /** Background **/
    appBackground: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    }
});
