import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const CadastroMedicamentoScreen = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState('');
  const [hoursBetween, setHoursBetween] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  const openImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        // Enviar a imagem para o servidor
        result.assets[0].uri
        const formData = new FormData();
        formData.append('image', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        } as any);

        /*const response = await axios.post('http://192.168.0.112:3000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });*/

        //console.log('Imagem enviada com sucesso. Caminho no servidor:', response.data.imagePath);

        // Atualizar o estado da foto com a URI da imagem escolhida
       /* setPhoto(response.data.imagePath);*/
       setPhoto(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
    }
  };

  const handleCadastroMedicamento = async () => {
    try {
      console.log('foto', photo);
      const userId = await AsyncStorage.getItem('userId');
      const pacienteId = await AsyncStorage.getItem('selectedPatientId');

      if (userId && pacienteId) {
        const response = await axios.post('http://192.168.0.112:3000/novoMedicamento', {
          name,
          hoursBetween: parseInt(hoursBetween),
          userId: parseInt(userId),
          pacienteId: parseInt(pacienteId),
          dosagem: dosagem,
          photo: photo || undefined,
        });

        console.log('Medicamento cadastrado com sucesso:', response.data);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Erro ao cadastrar medicamento:', error);
    }
  };

  return (
    <View className='p-4 space-y-4'>
      <TextInput
        placeholder="Nome do medicamento"
        onChangeText={(text) => setName(text)}
        value={name}
        className='font-body border border-collapse p-2 text-lg text-black'
      />
      <TextInput
        placeholder="Intervalo entre as doses"
        onChangeText={(text) => setHoursBetween(text)}
        value={hoursBetween}
        keyboardType="numeric"
        className='font-body border border-collapse p-2 text-lg text-black'
      />
      <TextInput
        placeholder="Dosagem"
        onChangeText={(text) => setDosagem(text)}
        value={dosagem}
        className='font-body border border-collapse p-2 text-lg text-black'
      />


      {photo && <Image source={{ uri: photo }} className='w-100 h-52 rounded-lg' />}

      <TouchableOpacity
       activeOpacity={0.7}
        onPress={openImagePicker}
        className='w-100 mb-3 border border-dashed border-sky-700 p-6'
        >
        <View className=''>
          <Text className='text-center'>Imagem do medicamento</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
      onPress={handleCadastroMedicamento}
      className="rounded-md p-4 shadow-black bg-sky-700 rounded-md">
           <Text className='text-center text-white uppercase'>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CadastroMedicamentoScreen;
