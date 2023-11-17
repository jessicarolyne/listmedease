import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../components/LoginScreen';
import AddMedicineScreen from '../components/AddMedicineScreen';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../components/HomeScreen';
import SelectPatientScreen from '../components/SelectPatientScreen';
import CadastroMedicamentoScreen from '../components/CadastroMedicamentoScreen';
import EdicaoMedicamentoScreen from '../components/EdicaoMedicamentoScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Adicionar medicamento" component={AddMedicineScreen} options={{ title: 'Adicionar medicamento' }} />
      <Stack.Screen name="Selecionar paciente" component={SelectPatientScreen} options={{ title: 'Selecionar Paciente' }} />
      <Stack.Screen name="Cadastrar novo medicamento" component={CadastroMedicamentoScreen} options={{ title: 'Cadastrar novo medicamento' }} />
      <Stack.Screen name="Editar medicamento" component={EdicaoMedicamentoScreen} options={{ title: 'Editar medicamento' }} />
    </Stack.Navigator>
  </NavigationContainer>
  );
};

export default AppNavigator;
