import React from 'react';
import Navigation from './src/navigation/Navigator';
import { setNotificationHandler } from 'expo-notifications';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

  const App: React.FC = () => {
    return <Navigation />
 };
 
 export default App;

