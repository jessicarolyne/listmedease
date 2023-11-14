import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../components/LoginScreen';
import AddMedicineScreen from '../components/AddMedicineScreen';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../components/HomeScreen';
import SelectPatientScreen from '../components/SelectPatientScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Adicionar medicamento" component={AddMedicineScreen} options={{ title: 'Adicionar medicamento' }} />
      <Stack.Screen name="Selecionar paciente" component={SelectPatientScreen} options={{ title: 'Selecionar Paciente' }} />
    </Stack.Navigator>
  </NavigationContainer>
  );
};

export default AppNavigator;
