import React from "react";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";

const ArticleItem = ({ navigation, article, id}) => {
  
  const navigateToScreen = (screenName) => {
    navigation.navigate('ArticleScreen', { articleId: article.id });
  };

  // return (
  //   <View style={styles.footer}>
  //     <TouchableOpacity onPress={() => navigateToScreen('Landing')}></TouchableOpacity>
  return (
    <TouchableOpacity style={styles.articleItem} 
    
      onPress={() => navigateToScreen('ArticleScreen')}>
      <ImageBackground
        source={{ uri: article.image }}
        resizeMode="cover"
        style={styles.articleImageStyle}
        imageStyle={{ borderRadius: 20}}

      >
        <View style={styles.articleItemFooter}>
            <Text style={styles.articleTitle}>{article.title}</Text>
            <Text numberOfLines={2} style={styles.articleSummary}>{article.summary}</Text> 
            <Text> id = {article.id}</Text>
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
    position: "relative",
  },
  articleTitle: {
    // Your styles for article title here
    color: "#fff", // Text color for article title
    fontSize: 16, // Adjust the font size as needed
    fontWeight: "bold", // Adjust the font weight as needed
    position: "absolute", // Position title absolutely
    top: 10, // Adjust the top position as needed
    left: 10, // Adjust the left position as needed
  },
  articleSummary: {
        // Your styles for article title here
        color: "#fff", // Text color for article title
        fontSize: 12, // Adjust the font size as needed
        fontWeight: "bold", // Adjust the font weight as needed
        position: "absolute", // Position title absolutely
        top: 30, // Adjust the top position as needed
        left: 10, // Adjust the left position as needed
  },
  articleItemFooter: {
    backgroundColor: "#4e7c77",
    opacity: 0.8,
    height: "40%",
    justifyContent: "center",
    alignItems: "center", // Center the text vertically
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
  },
  articleImageStyle: {
    height: "100%",
    width: "100%",
    justifyContent: "flex-end", // Align content at the bottom
    borderRadius: 20,
  },
});

export default ArticleItem;
