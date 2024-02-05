import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { ImageBackground } from "react-native";
import ArticleItem from "../components/ArticleComponents/ArticleItem";


import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from '../components/common/Footer';

const ArticleListView = ({ navigation }) => {
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_DEV_URL}/api/articles/`,
          {
            method: "GET",
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setArticles(data);
        }
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const DEV_SERVER_IP = '10.33.12.160:8000';

  const getImageFullUrl = (imageUrl) => {
    return imageUrl; // Return the imageUrl as is
  };
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerSection}>
          <Text style={styles.headerText}>Petology</Text>
        </View>
        <View style={styles.subHeaderSection}>
          <Text style={styles.subHeaderText}>Artiklar</Text>
        </View>

        <View style={styles.articleContainer}> 
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <ArticleItem key={index} article={article} />
          ))
          ) : (
            <Text>Loading articles...</Text>
          )}
        </View>

      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
  
};

const styles = StyleSheet.create({
/**********************************************************************************/
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#92cdca",

  },
  scrollView: {
  },
/**********************************************************************************/
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
  subHeaderSection: {
    flex: 1,
    alignItems: "center",
    height: 80,
    padding: 20,
  },
  subHeaderText: {
    fontSize: 22,
    fontFamily: "Cochin",
    // opacity: 0.7,
  },
/**********************************************************************************/
articleContainer: {
    alignItems: 'center',
},
/**********************************************************************************/
// all of this should be turned into a ArticleItem component instead
articleItem: {
    // backgroundColor: "gold",
    borderWidth: 1,
    borderColor: "black",
    alignContent: "center",
    borderRadius: 20,
    height: 165,
    width: "85%",
    position: "relative", // Add this to make footer positioning relative
  },
  articleItemFooter: {
    backgroundColor: "rgba(0, 128, 0, 0.5)", // Use rgba to set opacity
    height: "40%", // Take up 25% of the articleItem's height
    justifyContent: "center",
    position: "absolute", // Position footer absolutely within articleItem
    bottom: 0, // Stick to the bottom of articleItem
    left: 0, // Align with the left of articleItem
    right: 0, // Align with the right of articleItem
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  articleImageStyle: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
/**********************************************************************************/
});

export default ArticleListView;