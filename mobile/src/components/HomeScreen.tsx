import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';

interface Medicamento {
  id: number;
  name: string;
  hoursBetween: number;
  nextDue: Date;
}

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [medicamentos, setMedicamentos] = useState<any[]>([]);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const selectedPatientId = await AsyncStorage.getItem('selectedPatientId');
        if (selectedPatientId) {
          const response = await axios.get(`http://192.168.0.112:3000/medicamentos/${selectedPatientId}`);
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
      console.log('criada', notification)
    });
  };

  const handleNotificationReceived = async (notification: Notifications.Notification) => {
    console.log('Notificação recebida em primeiro plano:', notification);
    
    const medicamentoSelecionado = notification.request.content.data.medicamento;
    
    if (medicamentoSelecionado) {
      const novaHoraProximaDose = new Date();
      novaHoraProximaDose.setHours(novaHoraProximaDose.getHours() + 3 + medicamentoSelecionado.hoursBetween);
      try {
        console.log(medicamentoSelecionado.name);
        await axios.put(`http://192.168.0.112:3000/atualizarHoraProximaDose/${medicamentoSelecionado.id}`, {
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
      <View>
        {Object.entries(medicamentosPorHorario).map(([horario, medicamentosNoHorario]) => (
          <View key={horario}>
            <Text>{`Remédios para ${horario}`}</Text>
            <FlatList
              data={medicamentosNoHorario}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View>
                  <Text>{item.name}</Text>
                </View>
              )}
            />
          </View>
        ))}
    </View>
    );
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <Text style={{fontSize: 24, fontWeight: 500}}>Lista de Medicamentos</Text>
      {renderMedicamentosByHour()}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 10,
        }}
        onPress={handleAddMedicamento}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>Adicionar Medicamento</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
