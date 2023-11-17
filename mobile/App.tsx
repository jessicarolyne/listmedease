import React from 'react';
import Navigation from './src/navigation/Navigator';
import { setNotificationHandler } from 'expo-notifications';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { SplashScreen } from 'expo-router';
import { styled } from 'nativewind';


setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

  const App: React.FC = () => {
    const [hasLoadedFonts] = useFonts({
      Roboto_400Regular,
      Roboto_700Bold,
    })
    if(!hasLoadedFonts) {
      return <SplashScreen/>
    }
    return <Navigation />
 };
 
 export default App;

