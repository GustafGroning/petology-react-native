import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import getQuestionsInBatch from '../../api_calls/healthIndex/getQuestionsInBatch';

const HealthIndexSurveyScreen = ({ route, navigation }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const { latest_question_batch, dogId } = route.params;
    console.log('dogId ', dogId);

    console.log('latest_question_batch inside HealthIndexSurveyScreen ', latest_question_batch);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const batchId = latest_question_batch + 1;  // Example logic to get the next batch ID
            let query = await getQuestionsInBatch(batchId);
            if (!query) {
                query = await getQuestionsInBatch(1);  // Loop back to batch 1 if no next batch found
            }
            console.log('query   ', query);
            setQuestions(query.questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleAnswerPress = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigation.navigate('DogMainScreen', { dogId: dogId });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Latest batch ID: {latest_question_batch}</Text>
            {questions.length > 0 && (
                <View style={styles.questionContainer}>
                    <Text style={styles.questionTitle}>
                        {questions[currentQuestionIndex].question_title}
                    </Text>
                    {questions[currentQuestionIndex].responses.map((response, idx) => (
                        <Button
                            key={idx}
                            mode='contained'
                            onPress={handleAnswerPress}
                            style={styles.responseButton}
                            buttonColor='#4a8483'
                        >
                            {response.order}. {response.text} (Value: {response.value})
                        </Button>
                    ))}
                </View>
            )}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Undersökning klar!</Text>
                        <Button mode='contained' onPress={handleCloseModal} buttonColor='#4a8483'>
                            OK
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    questionContainer: {
        marginBottom: 20,
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    responseButton: {
        marginVertical: 5,
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default HealthIndexSurveyScreen;
