import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CadastroMedicamentoScreen = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState('');
  const [hoursBetween, setHoursBetween] = useState('');

  const handleCadastroMedicamento = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const pacienteId = await AsyncStorage.getItem('selectedPatientId');

      if (userId && pacienteId) {
        const response = await axios.post('http://192.168.0.112:3000/novoMedicamento', {
          name,
          hoursBetween: parseInt(hoursBetween),
          userId: parseInt(userId),
          pacienteId: parseInt(pacienteId),
        });

        console.log('Medicamento cadastrado com sucesso:', response.data);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Erro ao cadastrar medicamento:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Nome do Medicamento:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, padding: 8 }}
        onChangeText={(text) => setName(text)}
        value={name}
      />

      <Text>Horas entre doses:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, padding: 8 }}
        onChangeText={(text) => setHoursBetween(text)}
        value={hoursBetween}
        keyboardType="numeric"
      />

      <Button title="Cadastrar Medicamento" onPress={handleCadastroMedicamento} />
    </View>
  );
};

export default CadastroMedicamentoScreen;
