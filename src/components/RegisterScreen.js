import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { baseUrl } from '../../environments/environment';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    lastname: '',
    username: '',
    email: '',
    birthDate: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (!form.name || !form.lastname || !form.username || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/auth/signup`, form);

      if (res.data.token) {
        await AsyncStorage.setItem('token', res.data.token);
        Alert.alert('Success', 'Registration successful!');
        navigation.replace('Home');
      }
    } catch (error) {
      console.log('Register Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={form.name}
          onChangeText={(value) => handleChange('name', value)}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={form.lastname}
          onChangeText={(value) => handleChange('lastname', value)}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={form.username}
          onChangeText={(value) => handleChange('username', value)}
          editable={!loading}
        />

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
          placeholder="Birth Date (YYYY-MM-DD)"
          value={form.birthDate}
          onChangeText={(value) => handleChange('birthDate', value)}
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
          style={[styles.registerBtn, loading && styles.disabledBtn]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerBtnText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Already have an account? Login</Text>
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
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
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
  registerBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  registerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: 15,
    color: '#007AFF',
    fontSize: 14,
  },
});

export default RegisterScreen;
