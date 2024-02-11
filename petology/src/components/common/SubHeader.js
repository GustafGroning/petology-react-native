import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SubHeader = (props) => {
    const { headerText } = props; // Destructure headerText from props
    return (
        <View style={styles.section}>
            <Text style={styles.text}> {headerText} </Text>
        </View>
    );
};

/**********************************************************************************/
const styles = StyleSheet.create({
    section: {
        alignItems: "center",
        height: 35,
    },
    text: {
        fontSize: 28,
        fontFamily: "Cochin",
        opacity: 0.9,
    },
});

export default SubHeader;
