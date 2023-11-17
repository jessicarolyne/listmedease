import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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
  };

  return (
    <View className='p-4'>
      <Text className='font-title text-center text-2xl py-4'>Lista de pacientes</Text>
      <Text className='font-body text-md pb-3'>Selecione o paciente que deseja acompanhar:</Text>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
          onPress={() => handlePatientSelect(item.id)}
          className='p-6 my-1 bg-sky-700 rounded-md'
          >
            <View> 
              <Text className='text-lg text-white uppercase'>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SelectPatientScreen;
