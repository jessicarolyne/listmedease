import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text } from 'react-native';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.15.90:3000/login', {
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
    <View className='flex-1 justify-center px-12 gap-4'>
      <Text className='font-title text-3xl text-center'>Listmedease</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        className='font-body border border-collapse p-2 text-lg text-black'
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        className='font-body border border-collapse p-2 text-lg text-black'
      />
      <TouchableOpacity 
      onPress={handleLogin}
      className="rounded-md p-4 shadow-black bg-sky-700 rounded-md">
           <Text className='text-center text-white uppercase'>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
