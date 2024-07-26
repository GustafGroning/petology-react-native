import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ArticleItem = ({ navigation, articleId }) => {
  const [article, setArticle] = useState(null);

  const fetchArticle = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/articles/get/${id}/`, {
          method: 'GET',
          headers: {
            Authorization: `JWT ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        } else {
          console.error("Failed to fetch article");
        }
      }
    } catch (error) {
      console.error("Error fetching article:", error);
    }
  };

  useEffect(() => {
    fetchArticle(articleId);
  }, [articleId]);

  const navigateToScreen = () => {
    if (article) {
      navigation.navigate('ArticleScreen', { article });
    }
  };

  if (!article) {
    return null; // Or render a loading spinner
  }

  // Ensure the image URL is correctly formatted
  const imageUrl = article.image.startsWith("http") ? article.image : `${process.env.EXPO_PUBLIC_DEV_URL}${article.image}`;
  console.log('Formatted Article Image URL:', imageUrl);

  return (
    <TouchableOpacity style={styles.articleItem} onPress={navigateToScreen}>
      <ImageBackground
        source={{ uri: imageUrl }}
        resizeMode="cover"
        style={styles.articleImageStyle}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.articleItemFooter}>
          <Text style={styles.articleTitle}>{article.title}</Text>
          <Text numberOfLines={2} style={styles.articleSummary}>{article.summary}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  articleItem: {
    borderWidth: 1,
    borderColor: "black",
    alignContent: "center",
    borderRadius: 20,
    height: 165,
    width: "85%",
    marginBottom: 25,
  },
  articleTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    position: "absolute",
    top: 10,
    left: 10,
  },
  articleSummary: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    position: "absolute",
    top: 30,
    left: 10,
  },
  articleItemFooter: {
    backgroundColor: "#4e7c77",
    opacity: 0.8,
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
  },
  articleImageStyle: {
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    borderRadius: 20,
  },
});

export default ArticleItem;
