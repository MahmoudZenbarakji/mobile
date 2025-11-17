import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  AsyncStorage,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { baseUrl } from '../../environments/environment';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        const savedUser = await AsyncStorage.getItem('user');
        
        setToken(savedToken);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.log('Fetch user error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            navigation.replace('Login');
          } catch (error) {
            Alert.alert('Error', 'Logout failed');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.name} {user?.lastname}
        </Text>
        <Text style={styles.username}>@{user?.username}</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Birth Date:</Text>
            <Text style={styles.value}>
              {user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  username: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  infoSection: {
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 15,
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  logoutBtn: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
