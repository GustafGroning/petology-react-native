import React from "react";
import { View, Text, StyleSheet, ScrollView, ImageBackground } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Footer from "../../components/common/Footer";
import offeringImage from '../../../assets/offering.jpg'

const LibraryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
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
              resizeMode="cover"
              style={styles.imageStyle}
              imageStyle={{ borderRadius: 20}}
            />
          </View>
            <View style={styles.sectionItemText}>
              <Text numberOfLines={4}>
                Läs våra artiklar om specifika sjukdomstillstånd och hur du tar hand om din hund på bästa sätt! 
              </Text>
            </View>
            <View style={styles.sectionItemArrow}>

            </View>
            
          </View>
        </View>
        {/* Courses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Kurser</Text>
          <View style={styles.sectionItem}>
            <View style={styles.sectionItemImage}>
              <ImageBackground
                source={ offeringImage }
                resizeMode="cover"
                style={styles.imageStyle}
                imageStyle={{ borderRadius: 20}}
              />
            </View>
            <View style={styles.sectionItemText}>
              <Text numberOfLines={4}>
                Våra kurser är perfekta för dig som vill utvecklas inom ett specifikt område.
              </Text>
            </View>
            <View style={styles.sectionItemArrow}>

            </View>
            
          </View>
        </View>
        {/* Instructional Videos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Instruktioner</Text>
          <View style={styles.sectionItem}>
          <View style={styles.sectionItemImage}>
              <ImageBackground
                source={ offeringImage }
                resizeMode="cover"
                style={styles.imageStyle}
                imageStyle={{ borderRadius: 20}}
              />
            </View>
            <View style={styles.sectionItemText}>
              <Text numberOfLines={4}>
                Se instruktionsfilmer om olika undersökningar och behandlingar.
              </Text>
            </View>
            <View style={styles.sectionItemArrow}>

            </View>
            
          </View>
        </View>
        {/* Additional Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Petology</Text>
          {/* Add TouchableOpacity for navigating to additional links */}
        </View>
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#92cdca",
  },
  scrollView: {},
  headerSection: {
    flex: 1,
    alignItems: "center",
    height: 80,
    padding: 20,
  },
  headerText: {
    fontSize: 36,
    fontFamily: "Cochin",
    opacity: 0.7,
  },
  section: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    right: 125,
    fontSize: 22,
    fontFamily: "Cochin",
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
    backgroundColor: 'yellow',
  },
  imageStyle: {
    height: "95%",
    width: "90%",
    top: 2,
    left: 1,
  },
});

export default LibraryScreen;
