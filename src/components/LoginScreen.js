import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { baseUrl } from '../../environments/environment';

const LoginScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/auth/login`, {
        email: form.email,
        password: form.password,
      });

      const { token, user } = res.data;

      if (token && user) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        Alert.alert('Success', 'Login successful!');
        navigation.replace('Home');
      }
    } catch (error) {
      console.log('Login Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={form.password}
          onChangeText={(value) => handleChange('password', value)}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.disabledBtn]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  form: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loginBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: 15,
    color: '#007AFF',
    fontSize: 14,
  },
});

export default LoginScreen;
