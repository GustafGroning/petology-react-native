import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from '../components/common/Footer';

const ArticleScreen = ({ route, navigation }) => {
  const { articleId } = route.params;
  const [article, setArticle] = useState(null);


  useEffect(() => {
    const fetchArticle = async () => {
      const token = await AsyncStorage.getItem("userToken");
      
      if (token) {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_DEV_URL}/api/articles/get/${articleId}/`,
            {
              method: "GET",
              headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`,
              },
            }
          );
    
          if (response.ok) {
            const data = await response.json();
            console.log('data in articleScreen ', data);
            setArticle(data);
          } else {
            throw new Error('Network response was not ok');
          }
        } catch (error) {
          console.error("Error fetching article:", error);
        }
      } else {
        console.error("User token not found");
      }
    };
    

    fetchArticle();
  }, [articleId]);

  console.log('inside ArticleScreen, article is = ', article);

  const renderArticleBody = (body) => {
    const sections = body.split(/<header>|<section>/).filter(text => text);
    return sections.map((section, index) => {
      if (section.includes("</header>")) {
        return <Text key={`header-${index}`} style={styles.header}>{section.replace("</header>", "")}</Text>;
      } else if (section.includes("</section>")) {
        return <Text key={`section-${index}`} style={styles.section}>{section.replace("</section>", "")}</Text>;
      }
    });
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerSection}>
          <Text style={styles.headerText}>Petology</Text>
        </View>
        <View style={styles.articleContainer}>
          {article && (
            <View style={styles.articleSection}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleSummary}>{article.summary}</Text>
              {renderArticleBody(article.body)}
              <ImageBackground
                source={{ uri: article.image }}
                resizeMode="cover"
                style={styles.articleImage}
              />
            </View>
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
    scrollView: {},
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
/**********************************************************************************/
  articleContainer: {
    alignItems: 'center',
    // borderWidth: 2,
},

/**********************************************************************************/
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center', // Center align text
  },
  
  section: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center', // Center align text
  },
  
});



export default ArticleScreen;