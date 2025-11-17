import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  AsyncStorage,
} from 'react-native';
import axios from 'axios';
import { baseUrl } from '../../environments/environment';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        setToken(savedToken);
        if (savedToken) {
          fetchPosts(savedToken);
        }
      } catch (error) {
        console.log('Token fetch error:', error);
      }
    };
    fetchToken();
  }, []);

  const fetchPosts = async (authToken) => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/posts`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setPosts(res.data.data || []);
    } catch (error) {
      console.log('Fetch Posts Error:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Logout failed');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Home Feed</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {posts.length === 0 ? (
          <Text style={styles.noPostsText}>No posts available</Text>
        ) : (
          posts.map((post) => (
            <View key={post._id} style={styles.postCard}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postBody}>{post.body}</Text>
              {post.image && (
                <Text style={styles.postImage}>📸 Image attached</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutBtn: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noPostsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  postCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  postBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  postImage: {
    fontSize: 12,
    color: '#0066cc',
  },
});

export default HomeScreen;
