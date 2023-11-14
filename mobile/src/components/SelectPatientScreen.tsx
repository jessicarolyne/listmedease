import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectPatientScreen = ({ navigation }: { navigation: any }) => {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
  
        if (userId) {
          const response = await axios.get(`http://192.168.0.112:3000/pacientes?userId=${userId}`);
          setPatients(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      }
    };
  
    fetchPatients();
  }, []);

 const handlePatientSelect = async (patientId: number) => {
    try {
      await AsyncStorage.setItem('selectedPatientId', patientId.toString());
    } catch (error) {
      console.error('Erro ao salvar IDs no AsyncStorage:', error);
    }

    navigation.navigate('Home');

  return (
    <View>
      <Text>Selecione o paciente:</Text>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePatientSelect(item.id)}>
            <View>
              <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
};

export default SelectPatientScreen;
