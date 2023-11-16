import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.0.112:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Login bem-sucedido:', data);
        AsyncStorage.setItem('userId', data.user.id.toString());
        navigation.navigate('Selecionar paciente');
      } else {
        const errorData = await response.json();
        console.log('Erro no login:', errorData);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };


  return (
    <View style={{ flex: 1, padding: 16 }}/*className="flex-1 items-center justify-center bg-white"*/>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
