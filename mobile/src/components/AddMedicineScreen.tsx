import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

import axios from 'axios';

interface Medicamento {
  name: string;
  hoursBetween: number;
  photo?: string;
}

const createMedicine = async (medicamento: Medicamento) => {
  try {
    const response = await axios.post('192.168.0.112/novo-medicamento', medicamento);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar medicamento', error);
    throw error;
  }
};



const AddMedicineScreen = () => {
  const [medicineName, setMedicineName] = useState('');
  const [hoursBetween, setHoursBetween] = useState('0'); ;
  const [photo, setPhoto] = useState('');

  const handleAddMedicine = async () => {
    try {
      // Aqui, você pode validar os dados do formulário antes de enviar para a API
      const medicamento = {
        name: medicineName,
        hoursBetween: parseInt(hoursBetween),
        photo,
      };
      const response = await createMedicine(medicamento);

      console.log('Medicamento criado:', response);
      // navigation.navigate('NomeDaProximaTela');
    } catch (error) {
      console.error('Erro ao adicionar medicamento:', error);
    }
  };

  return (
    <View>
    <TextInput
      placeholder="Medicine Name"
      value={medicineName}
      onChangeText={(text) => setMedicineName(text)}
    />
    <TextInput
      placeholder="Hours Between"
      value={hoursBetween.toString()} 
      onChangeText={(text) => setHoursBetween(String(text))}
      keyboardType="numeric"
    />
    <TextInput
      placeholder="Photo URL"
      value={photo}
      onChangeText={(text) => setPhoto(text)}
    />
    <Button title="Add Medicine" onPress={handleAddMedicine} />
  </View>
  );
};

export default AddMedicineScreen;
