import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ImageBackground, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from '../components/common/Footer';

const ArticleScreen = ({ route, navigation }) => {
  const { article } = route.params;
  // const [article, setArticle] = useState(null);


  // useEffect(() => {
  //   const fetchArticle = async () => {
  //     const token = await AsyncStorage.getItem("userToken");
      
  //     if (token) {
  //       try {
  //         const response = await fetch(
  //           `${process.env.EXPO_PUBLIC_DEV_URL}/api/articles/get/${articleId}/`,
  //           {
  //             method: "GET",
  //             headers: {
  //               'Content-Type': 'application/json',
  //               Authorization: `JWT ${token}`,
  //             },
  //           }
  //         );
    
  //         if (response.ok) {
  //           const data = await response.json();
  //           console.log('data in articleScreen ', data);
  //           setArticle(data);
  //         } else {
  //           throw new Error('Network response was not ok');
  //         }
  //       } catch (error) {
  //         console.error("Error fetching article:", error);
  //       }
  //     } else {
  //       console.error("User token not found");
  //     }
  //   };
    

  //   fetchArticle();
  // }, [articleId]);

  console.log('inside ArticleScreen, article is = ', article);

  const renderArticleBody = (body) => {
    const sections = body.split(/<header>|<section>|<bullet>/).filter(text => text);
    return sections.map((section, index) => {
      if (section.includes("</header>")) {
        return <Text key={`header-${index}`} style={styles.header}>{section.replace("</header>", "")}</Text>;
      } else if (section.includes("</section>")) {
        return <Text key={`section-${index}`} style={styles.section}>{section.replace("</section>", "")}</Text>;
      } else if (section.includes("</bullet>")) {
        return (
          <View key={`bullet-${index}`} style={styles.bulletItem}>
            <Text style={styles.bulletText}>• {section.replace("</bullet>", "")}</Text>
          </View>
        );
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
              <View style={styles.articleHeaderContainer}> 
                <Text style={styles.articleTitle}>{article.title}</Text>
              </View>
              <View style={styles.imageContainer}> 
                <Image
                  source={{ uri: article.image }}
                  resizeMode="cover"
                  style={styles.articleImage}
                />              
              </View>

              {/* <Text style={styles.articleSummary}>{article.summary}</Text> */}
              {renderArticleBody(article.body)}
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
articleSection: {
  // alignItems: "center",
},
articleHeaderContainer: {
  alignItems: 'center',
},
articleTitle: {
  fontSize: 26,
  paddingTop: 80,
  paddingBottom: 20,
  // fontWeight: 'bold',
},
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    paddingLeft: 10,
    // textAlign: 'center', // Center align text
  },
  
  section: {
    fontSize: 15,
    marginBottom: 10,
    // textAlign: 'center', // Center align text
    paddingLeft: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bulletText: {
    fontSize: 15,
    paddingLeft: 10,
  },
/**********************************************************************************/
  imageContainer: {
    alignItems: 'center',
  },
  articleImage: {
    height: 130,
    width:  380,
    borderRadius: 10,
  },
});
/**********************************************************************************/
export default ArticleScreen;