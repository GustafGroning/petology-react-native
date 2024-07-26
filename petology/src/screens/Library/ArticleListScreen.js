import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import ArticleItem from '../../components/ArticleComponents/ArticleItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../../components/common/Footer';

const ArticleListScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);

  const fetchArticles = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_DEV_URL}/api/articles/`,
          {
            method: 'GET',
            headers: {
              Authorization: `JWT ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setArticles(data);
          setFilteredArticles(data.map(article => article.id));
          // Filter featured articles
          const featured = data.filter(article => article.featured_article).map(article => article.id);
          setFeaturedArticles(featured);
        }
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredArticles(articles.map(article => article.id)); // Reset to the original list of articles
    } else {
      const filtered = articles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()),
      ).map(article => article.id);
      setFilteredArticles(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder='Search articles...'
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerSection}>
          <Text style={styles.headerText}>Petology</Text>
        </View>
        <View style={styles.subHeaderSection}>
          <Text style={styles.subHeaderText}>Månadens tema</Text>
        </View>
        <View style={styles.articleContainer}>
          {featuredArticles.length > 0 ? (
            featuredArticles.map((articleId, index) => (
              <ArticleItem key={index} articleId={articleId} navigation={navigation}/>
            ))
          ) : (
            <Text>No articles found</Text>
          )}
        </View>
        <View style={styles.subHeaderSection}>
          <Text style={styles.subHeaderText}>Artiklar</Text>
        </View>
        <View style={styles.articleContainer}>
          {filteredArticles.length > 0 ? (
            filteredArticles
              // Exclude featured articles
              .filter(articleId => !featuredArticles.includes(articleId))
              .map((articleId, index) => (
                <ArticleItem key={index} articleId={articleId} navigation={navigation}/>
              ))
          ) : (
            <Text>No articles found</Text>
          )}
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
  subHeaderSection: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  subHeaderText: {
    fontSize: 22,
    fontFamily: 'Cochin',
    marginBottom: 5,
  },
  articleContainer: {
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
  },
});

export default ArticleListScreen;
