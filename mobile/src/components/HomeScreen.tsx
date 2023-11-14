import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

interface Medicamento {
  id: number;
  name: string;
  hoursBetween: number;
  nextDue: Date;
}

const HomeScreen: React.FC = () => {
  const [medicamentos, setMedicamentos] = useState<any[]>([]);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const selectedPatientId = await AsyncStorage.getItem('selectedPatientId');
        // const loggedInUserId = await AsyncStorage.getItem('loggedInUserId');

        if (selectedPatientId) {
          const response = await axios.get(`http://192.168.0.112:3000/pacientes/${selectedPatientId}/medicamentos`);
          setMedicamentos(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar medicamentos:', error);
      }
    };

    fetchMedicamentos();
  }, []);

  return (
    <View>
      <Text>Lista de Medicamentos</Text>
      <FlatList
        data={medicamentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name} - Próxima dose: {item.nextDue}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;
