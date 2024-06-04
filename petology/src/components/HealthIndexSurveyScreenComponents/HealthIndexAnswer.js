import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HealthIndexAnswer = ({ response, onPress }) => {
    return (
        <TouchableOpacity style={styles.answerButton} onPress={onPress}>
            <Text style={styles.answerText}>{response.order}. {response.text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    answerButton: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: '#e8f5f5',
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    answerText: {
        fontSize: 16,
        color: 'black',
    },
});

export default HealthIndexAnswer;
