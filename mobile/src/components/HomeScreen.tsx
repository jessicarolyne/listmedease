import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ScrollView } from 'react-native-gesture-handler';

interface Medicamento {
  id: number;
  name: string;
  hoursBetween: number;
  nextDue: Date;
  dosagem: String;
}

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const handleEditMedicamento = (medicamentoId) => {
    console.log(medicamentoId)
    navigation.navigate('Editar medicamento', { medicamentoId });
  };
  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const selectedPatientId = await AsyncStorage.getItem('selectedPatientId');
        if (selectedPatientId) {
          const response = await axios.get(`http://192.168.15.90:3000/medicamentos/${selectedPatientId}`);
          setMedicamentos(response.data);
          scheduleNotifications(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar medicamentos:', error);
      }
    };

    const getNotificationPermission = async () => {
      try {
        const settings = await Notifications.getPermissionsAsync();
        if (settings.status !== 'granted') {
          const newSettings = await Notifications.requestPermissionsAsync();
          if (newSettings.status === 'granted') {
            console.log('Permissão concedida para receber notificações');
          } else {
            console.log('Permissão para notificações foi negada');
          }
        }
      } catch (error) {
        console.error('Erro ao obter permissões de notificação:', error);
      }
    };

    const notificationReceivedListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        handleNotificationReceived(notification);
      }
    );
  
    getNotificationPermission();
    fetchMedicamentos();
  
    return () => {
      Notifications.removeNotificationSubscription(notificationReceivedListener);
    };
  }, []);

  const handleAddMedicamento = () => {
    navigation.navigate('Cadastrar novo medicamento');
  };
  const scheduleNotifications = (medicamentos: Medicamento[]) => {
    medicamentos.forEach((medicamento) => {
      const horaProximaDose = new Date(medicamento.nextDue);
      const notification: Notifications.NotificationContentInput = {
        title: 'Lembrete de Medicamento',
        body: `Está na hora de tomar ${medicamento.name}!`,
        data: { medicamento },
      };

      Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: {
          date: horaProximaDose,
        },
        identifier: medicamento.id.toString()
      });
    });
  };

  const handleNotificationReceived = async (notification: Notifications.Notification) => {
    console.log('Notificação recebida em primeiro plano:', notification);
    
    const medicamentoSelecionado = notification.request.content.data.medicamento;
    
    if (medicamentoSelecionado) {
      const novaHoraProximaDose = new Date();
      novaHoraProximaDose.setHours(novaHoraProximaDose.getHours() + 3 + medicamentoSelecionado.hoursBetween);
      try {
        await axios.put(`http://192.168.15.90:3000/atualizarHoraProximaDose/${medicamentoSelecionado.id}`, {
          novaHoraProximaDose: novaHoraProximaDose.toISOString(),
        });
        scheduleNotifications([medicamentoSelecionado]);
      } catch (error) {
        console.error('Erro ao atualizar a hora da próxima dose:', error);
      }
    }
  };  

  const renderMedicamentosByHour = () => {
    const medicamentosPorHorario: { [horario: string]: Medicamento[] } = {};

    medicamentos.forEach((medicamento) => {
      const horario = new Date(medicamento.nextDue);
      horario.setHours(horario.getHours() + 3);
      const horaFormatada = `${horario.getHours().toString().padStart(2, '0')}:${horario.getMinutes().toString().padStart(2, '0')}`;

      if (!medicamentosPorHorario[horaFormatada]) {
        medicamentosPorHorario[horaFormatada] = [];
      }
      medicamentosPorHorario[horaFormatada].push(medicamento);
    });

    return (
      <ScrollView className='flex-1'>
      {Object.entries(medicamentosPorHorario).map(([horario, medicamentosNoHorario]) => (
        <View key={horario} className='flex-1'>
          <Text className='font-title text-lg py-2 mt-5 border-b-2 border-dotted border-sky-700'>{`${horario}`}</Text>
          <FlatList
            data={medicamentosNoHorario}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleEditMedicamento(item.id)}>
                <View className='py-4 flex-1 justify-between flex-row border-b-2 border-dotted border-gray-100'>
                  <Text className='px-6 uppercase'>{item.name}</Text>
                  <Text className='px-6'>{item.dosagem}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ))}
    </ScrollView>
    );
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <Text className='font-title text-center text-2xl py-4'>Lista de Medicamentos</Text>
      {renderMedicamentosByHour()}
      <TouchableOpacity
        onPress={handleAddMedicamento}
        className='absolute bottom-5 right-5 rounded-md items-center self-end bg-sky-700 py-2 px-4'
      >
        <Text className='font-body text-3xl text-white'>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
