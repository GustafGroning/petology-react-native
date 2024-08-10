import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Footer from '../../components/common/Footer';

const FrequentlyAskedQuestionsScreen = ({ navigation }) => {
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text>Here we add FAQ</Text>
        <TouchableOpacity onPress={() => 
          navigateToScreen('FrequentlyAskedQuestionsScreen')}>
          <Text>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => 
          navigateToScreen('FrequentlyAskedQuestionsScreen')}>
          <Text>FAQ</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FrequentlyAskedQuestionsScreen;
