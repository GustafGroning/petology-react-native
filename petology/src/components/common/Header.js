import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Header = ({ navigation }) => {
    return (
        <View style={styles.headerSection}>
            <Text style={styles.headerText}> Petology </Text>
        </View>
    );
};

/**********************************************************************************/
const styles = StyleSheet.create({
    headerSection: {
    //   flex: 1,
      alignItems: "center",
      height: 80,
      padding: 20,
    },
    headerText: {
      fontSize: 36,
      fontFamily: "Cochin",
      opacity: 0.7,
    },
});

export default Header;