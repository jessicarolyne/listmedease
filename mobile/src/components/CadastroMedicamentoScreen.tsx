import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const CadastroMedicamentoScreen = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState('');
  const [hoursBetween, setHoursBetween] = useState('');
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

      {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, marginBottom: 16 }} />}

      <TouchableOpacity activeOpacity={0.7} onPress={openImagePicker}>
        <View style={{ marginVertical: 8 }}>
          <Text>Adicionar foto ou vídeo de capa</Text>
        </View>
      </TouchableOpacity>

      <Button title="Cadastrar Medicamento" onPress={handleCadastroMedicamento} />
    </View>
  );
};

export default CadastroMedicamentoScreen;
