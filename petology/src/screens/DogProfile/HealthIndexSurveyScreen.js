import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import getQuestionsInBatch from '../../api_calls/healthIndex/getQuestionsInBatch';
import getLatestHealthIndexRowForDog from '../../api_calls/healthIndex/getLatestHealthIndexRowForDog';
import saveNewHealthIndexRow from '../../api_calls/healthIndex/saveNewHealthIndexRow';
import HealthIndexAnswer from '../../components/HealthIndexSurveyScreenComponents/HealthIndexAnswer';
import Header from '../../components/common/Header';

const HealthIndexSurveyScreen = ({ route, navigation }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showExitConfirmationModal, setShowExitConfirmationModal] = useState(false);

    const { latest_question_batch, dogId } = route.params;
    console.log('dogId:', dogId);
    console.log('latest_question_batch inside HealthIndexSurveyScreen:', latest_question_batch);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const batchId = latest_question_batch + 1; // Example logic to get the next batch ID
            let query = await getQuestionsInBatch(batchId);
            if (!query) {
                query = await getQuestionsInBatch(1); // Loop back to batch 1 if no next batch found
            }
            console.log('query:', query);
            setQuestions(query.questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleAnswerPress = (questionIndex, value) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [questionIndex]: value,
        }));

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowModal(true);
        }
    };

    const handleSkipPress = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowModal(true);
        }
    };

    const calculateNewValues = async () => {
        try {
            let latestRow = await getLatestHealthIndexRowForDog(dogId);
    
            if (!latestRow) {
                latestRow = {
                    batches_in_row: 1,
                    latest_run_batch_id: 0,
                    general_condition: 1,
                    dental_health: 1,
                    eyes: 1,
                    skin_and_coat: 1,
                    locomotor_system: 1,
                    other: 1,
                };
            }
    
            const newValues = { ...latestRow };
            Object.values(responses).forEach(response => {
                const category = response.slice(0, 2); // e.g., SC
                const change = parseInt(response.slice(2)); // e.g., +1 or -1
                switch (category) {
                    case 'GC':
                        newValues.general_condition += change;
                        break;
                    case 'DH':
                        newValues.dental_health += change;
                        break;
                    case 'E':
                        newValues.eyes += change;
                        break;
                    case 'SC':
                        newValues.skin_and_coat += change;
                        break;
                    case 'LS':
                        newValues.locomotor_system += change;
                        break;
                    case 'O':
                        newValues.other += change;
                        break;
                    default:
                        break;
                }
            });

            // Prepare the new row data
            const newRow = {
                latest_run_batch_id: latest_question_batch || 0,
                batches_in_row: latestRow.batches_in_row + 1,
                date_performed: new Date().toISOString(),
                general_condition: newValues.general_condition,
                dental_health: newValues.dental_health,
                eyes: newValues.eyes,
                skin_and_coat: newValues.skin_and_coat,
                locomotor_system: newValues.locomotor_system,
                other: newValues.other,
            };

            // Save the new row data
            const result = await saveNewHealthIndexRow(dogId, newRow);
            if (result.success) {
                console.log('New DogHealthIndex row saved:', result.data);
            } else {
                console.error('Failed to save new DogHealthIndex row:', result.message);
            }
        } catch (error) {
            console.error('Error calculating new values:', error);
        }
    };

    const handleCloseModal = async () => {
        try {
            // Wait for the row to be written to the database
            await calculateNewValues();
        } catch (error) {
            console.error('Error calculating and saving new values:', error);
        } finally {
            setShowModal(false);
            // Navigate back only after the row is written
            navigation.navigate('DogMainScreen', { dogId: dogId, refresh: true });
        }
    };
    

    const handleExitConfirmation = (confirm) => {
        if (confirm) {
            navigation.navigate('DogMainScreen', { dogId: dogId });
        }
        setShowExitConfirmationModal(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerSection}>
                    <Header />
                    <View style={styles.closeButtonContainer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowExitConfirmationModal(true)}
                        >
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.section2}>
                    {questions.length > 0 && (
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionTitle}>
                                {questions[currentQuestionIndex].question_title}
                            </Text>
                            {questions[currentQuestionIndex].responses.map((response, idx) => (
                                <HealthIndexAnswer
                                    key={idx}
                                    response={response}
                                    onPress={() => handleAnswerPress(currentQuestionIndex, response.value)}
                                />
                            ))}
                        </View>
                    )}
                </View>
                <View style={styles.skipButtonContainer}>
                    <Button mode="text" onPress={handleSkipPress} style={styles.skipButton}>
                        Hoppa över
                    </Button>
                </View>
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
                <Modal
                    visible={showExitConfirmationModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowExitConfirmationModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Vill du verkligen avsluta undersökningen?</Text>
                            <View style={styles.modalButtonContainer}>
                                <Button mode='contained' onPress={() => handleExitConfirmation(true)} buttonColor='#4a8483'>
                                    Ja
                                </Button>
                                <Button mode='contained' onPress={() => handleExitConfirmation(false)} buttonColor='#4a8483' style={{ marginLeft: 10 }}>
                                    Nej
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: '#92cdca',
    },
    scrollView: {},
    headerSection: {
        flex: 1,
        alignItems: 'center',
        height: 80,
        padding: 20,
        marginBottom: 20, // Added gap between header and next item
    },
    headerText: {
        fontSize: 36,
        fontFamily: 'Cochin',
        opacity: 0.7,
    },
    section2: {
        alignItems: 'center',
        paddingTop: 10,
    },
    header: {
        fontFamily: 'Cochin',
    },
    headerSmall: {
        fontFamily: 'Cochin',
        marginBottom: 15,
    },
    questionContainer: {
        marginBottom: 20,
        width: '80%', // Adjust width to be responsive
        alignItems: 'center', // Center align items vertically
    },
    questionTitle: {
        fontSize: 24, // Made bigger
        textAlign: 'center', // Centered the text
        marginBottom: 20,
    },
    closeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
    },
    closeButtonText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 28,
        left: 320,
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
    skipButtonContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    skipButton: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default HealthIndexSurveyScreen;
