import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import getSurveyQuestions from '../../api_calls/healthIndex/getSurveyQuestions';
import getLatestHealthIndexRowForDog from '../../api_calls/healthIndex/getLatestHealthIndexRowForDog';
import saveNewHealthIndexRow from '../../api_calls/healthIndex/saveNewHealthIndexRow';
import HealthIndexAnswer from '../../components/HealthIndexSurveyScreenComponents/HealthIndexAnswer';
import ArticleItem from '../../components/ArticleComponents/ArticleItem';
import { LinearGradient } from 'expo-linear-gradient';

const HealthIndexSurveyScreen = ({ route, navigation }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showExitConfirmationModal, setShowExitConfirmationModal] = useState(false);

    const { dogId } = route.params;
    console.log('dogId:', dogId);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            let query = await getSurveyQuestions();
            if (query) {
                setQuestions(query);
            } else {
                console.error("No questions received");
            }
        } catch (error) {
            console.error('Error fetching random questions:', error);
        }
    };

    const handleAnswerPress = (questionIndex, value) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [questions[questionIndex].category]: value, // Store response by category
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
            
            // TODO: det här är inte toppen, om anropet inte funkar så kommer den utgå från att det är nytt och ska startas om.
            if (!latestRow) {
                latestRow = {
                    general_condition: 1,
                    dental_health: 1,
                    eyes: 1,
                    skin_and_coat: 1,
                    locomotor_system: 1,
                    other: 1,
                };
            }
    
            const newValues = { ...latestRow };
            Object.entries(responses).forEach(([category, value]) => {
                const change = parseInt(value.slice(2)); // Extract change value
                switch (category) {
                    case 'general_condition':
                        newValues.general_condition += change;
                        break;
                    case 'dental_health':
                        newValues.dental_health += change;
                        break;
                    case 'eyes':
                        newValues.eyes += change;
                        break;
                    case 'skin_and_coat':
                        newValues.skin_and_coat += change;
                        break;
                    case 'locomotor_system':
                        newValues.locomotor_system += change;
                        break;
                    case 'other':
                        newValues.other += change;
                        break;
                    default:
                        break;
                }
            });

            const newRow = {
                date_performed: new Date().toISOString(),
                ...newValues,
            };

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
            await calculateNewValues();
        } catch (error) {
            console.error('Error calculating and saving new values:', error);
        } finally {
            setShowModal(false);
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
        <LinearGradient
            colors={['#86c8c5', '#e4f4f2']}
            locations={[0.3, 0.8]}
            style={styles.container}
        >
        <ScrollView style={styles.scrollView}>
            <View style={styles.headerSection}>
                <Text style={styles.headerText}> Dagens undersökning </Text>
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

                        {questions[currentQuestionIndex].articles?.length > 0 && (
                            <View style={styles.articlesContainer}>
                                <Text style={styles.articleHeader}>Relaterade artiklar:</Text>
                                {questions[currentQuestionIndex].articles.map((article, idx) => (
                                    <ArticleItem
                                        key={idx}
                                        navigation={navigation}
                                        articleId={article.id}
                                    /> 
                                ))}
                            </View>
                        )}
                    </View>
                )}
            </View>
            <View style={styles.skipButtonContainer}>
                <Button mode="text" onPress={handleSkipPress} style={styles.skipButton}>
                    Hoppa över
                </Button>
            </View>
            <Modal visible={showModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Undersökning klar!</Text>
                        <Button mode='contained' onPress={handleCloseModal} buttonColor='#4a8483'>
                            OK
                        </Button>
                    </View>
                </View>
            </Modal>
            <Modal visible={showExitConfirmationModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Vill du verkligen avsluta?</Text>
                        <View style={styles.modalButtonContainer}>
                            <Button mode='contained' onPress={() => handleExitConfirmation(true)}>Ja</Button>
                            <Button mode='contained' onPress={() => handleExitConfirmation(false)}>Nej</Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    </LinearGradient>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 160,
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
    articlesContainer: {
        marginTop: 20,
    },
    articleHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    articleLink: {
        fontSize: 16,
        color: '#4a90e2',
        textDecorationLine: 'underline',
        marginBottom: 5,
    },
    exitButtonStyle: {
        width: "50%", // Adjust the width as needed
        height: 50,
        justifyContent: "center",
        backgroundColor: "#4a8483",
        // Add any other styling you want for the button
      },
});

export default HealthIndexSurveyScreen;
