import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, 
  TouchableOpacity } from 'react-native';
import Footer from '../../components/common/Footer';
import offeringImage from '../../../assets/offering.jpg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const LibraryScreen = ({ navigation }) => {
/**********************************************************************************/
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    // console.log('Navigate to:', screenName); // Replace with actual navigation
  };
  /**********************************************************************************/
  return (
    

    
    <LinearGradient
      colors={['#86c8c5', '#e4f4f2']}
      locations={[0.3, 0.8]}
      style={styles.container}
    >
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
                size={30} 
                color='#000' />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.disabledSectionHeader}>Kurser</Text>
          <View style={styles.sectionItem}>
            <View style={styles.sectionItemImage}>
              <ImageBackground
                source={ offeringImage }
                resizeMode='cover'
                style={styles.disabledImageStyle}
                imageStyle={{ borderRadius: 20}}
              />
            </View>
            <View style={styles.sectionItemText}>
              <Text numberOfLines={4}>
                {/* Våra kurser är perfekta för dig som vill 
                utvecklas inom ett specifikt område. */}
                Kommer snart!
              </Text>
            </View>
            {/* <TouchableOpacity
              style={styles.sectionItemArrow}
              onPress={() => navigateToScreen('ArticleList')}>
              <FontAwesome
                style={styles.navigationArrowStyle}
                name='arrow-right' 
                size={45} 
                color='#000' 
              />
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.disabledSectionHeader}>Instruktioner</Text>
          <View style={styles.sectionItem}>
            <View style={styles.sectionItemImage}>
              <ImageBackground
                source={ offeringImage }
                resizeMode='cover'
                style={styles.disabledImageStyle}
                imageStyle={{ borderRadius: 20}}
              />
            </View>
            <View style={styles.sectionItemText}>
              <Text numberOfLines={4}>
                {/* Se instruktionsfilmer om olika undersökningar och behandlingar. */}
                Kommer snart!
              </Text>
            </View>
            {/* <TouchableOpacity
              style={styles.sectionItemArrow}
              onPress={() => navigateToScreen('ArticleList')}>
              <FontAwesome
                style={styles.navigationArrowStyle}
                name='arrow-right' 
                size={45} 
                color='#000' 
              />
            </TouchableOpacity> */}
          </View>
        </View>
        {/* Additional Links Section */}
        <View style={styles.miscSection}>
          <Text style={styles.miscSectionHeader}>Petology</Text>
          <TouchableOpacity onPress={() => 
            navigateToScreen('FrequentlyAskedQuestionsScreen')}>
            <Text style={styles.miscSectionText}> FaQ </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToScreen('ContactUsScreen')}>
            <Text style={styles.miscSectionText}> Kontakta oss </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToScreen('AboutUsScreen')}>
            <Text style={styles.miscSectionText}> Om Petology </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToScreen('PolicyScreen')}>
            <Text style={styles.miscSectionText}> Integritetspolicy & användarvilkor </Text>
          </TouchableOpacity>
          {/* Add TouchableOpacity for navigating to additional links */}
        </View>
      </ScrollView>
      <Footer navigation={navigation} />
    </LinearGradient>
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
  miscSection: {
    alignItems: 'left',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    right: 140,
    fontSize: 22,
    fontFamily: 'Cochin',
  },
  miscSectionHeader: {
    left: 142,
    fontSize: 26,
    paddingBottom: 25,
    fontFamily: 'Cochin',
  },
  miscSectionText: {
    fontSize: 16,
    paddingBottom: 12,
  },
  disabledSectionHeader: {
    right: 140,
    fontSize: 22,
    fontFamily: 'Cochin',
    opacity: 0.4,
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
  disabledImageStyle: {
    height: '95%',
    width: '90%',
    top: 2,
    left: 1,
    opacity: 0.4,
  },
  navigationArrowStyle: {
  },
});

export default LibraryScreen;
