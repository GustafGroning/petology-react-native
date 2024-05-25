import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, 
  TouchableOpacity } from 'react-native';
import Footer from '../../components/common/Footer';
import offeringImage from '../../../assets/offering.jpg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const LibraryScreen = ({ navigation }) => {
/**********************************************************************************/
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    // console.log('Navigate to:', screenName); // Replace with actual navigation
  };
  /**********************************************************************************/
  return (
    

    
    <View style={styles.container}>
      <TouchableOpacity />
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerSection}>
          <Text style={styles.headerText}>Bibliotek</Text>
        </View>
        {/* Article Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Artiklar</Text>
          <View style={styles.sectionItem}>
            <View style={styles.sectionItemImage}>
              <ImageBackground
                source={ offeringImage }
                resizeMode='cover'
                style={styles.imageStyle}
                imageStyle={{ borderRadius: 20}}
              />
            </View>
            <View style={styles.sectionItemText}>
              <Text numberOfLines={4}>
                Läs våra artiklar om specifika sjukdomstillstånd 
                och hur du tar hand om din hund på bästa sätt! 
              </Text>
            </View>
            <TouchableOpacity
              style={styles.sectionItemArrow}
              onPress={() => navigateToScreen('ArticleList')}>
              <FontAwesome
                style={styles.navigationArrowStyle}
                name='arrow-right' 
                size={45} 
                color='#000' />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Kurser</Text>
          <View style={styles.sectionItem}>
            <View style={styles.sectionItemImage}>
              <ImageBackground
                source={ offeringImage }
                resizeMode='cover'
                style={styles.imageStyle}
                imageStyle={{ borderRadius: 20}}
              />
            </View>
            <View style={styles.sectionItemText}>
              <Text numberOfLines={4}>
                Våra kurser är perfekta för dig som vill 
                utvecklas inom ett specifikt område.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.sectionItemArrow}
              onPress={() => navigateToScreen('ArticleList')}>
              <FontAwesome
                style={styles.navigationArrowStyle}
                name='arrow-right' 
                size={45} 
                color='#000' 
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Instruktioner</Text>
          <View style={styles.sectionItem}>
            <View style={styles.sectionItemImage}>
              <ImageBackground
                source={ offeringImage }
                resizeMode='cover'
                style={styles.imageStyle}
                imageStyle={{ borderRadius: 20}}
              />
            </View>
            <View style={styles.sectionItemText}>
              <Text numberOfLines={4}>
                Se instruktionsfilmer om olika undersökningar och behandlingar.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.sectionItemArrow}
              onPress={() => navigateToScreen('ArticleList')}>
              <FontAwesome
                style={styles.navigationArrowStyle}
                name='arrow-right' 
                size={45} 
                color='#000' 
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Additional Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Petology</Text>
          <TouchableOpacity onPress={() => 
            navigateToScreen('FrequentlyAskedQuestionsScreen')}>
            <Text> FaQ </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToScreen('ContactUsScreen')}>
            <Text> Contact Us </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToScreen('AboutUsScreen')}>
            <Text> About Petology </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToScreen('PolicyScreen')}>
            <Text> Policy </Text>
          </TouchableOpacity>
          {/* Add TouchableOpacity for navigating to additional links */}
        </View>
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
};
/**********************************************************************************/
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
  },
  headerText: {
    fontSize: 36,
    fontFamily: 'Cochin',
    opacity: 0.7,
  },
  section: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    right: 140,
    fontSize: 22,
    fontFamily: 'Cochin',
  },
  sectionItem: {
    width: '95%',
    flexDirection: 'row',
    height: 85,

  },
  sectionItemImage: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionItemText: {
    flex: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },  
  sectionItemArrow: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    height: '95%',
    width: '90%',
    top: 2,
    left: 1,
  },
  navigationArrowStyle: {
  },
});

export default LibraryScreen;
