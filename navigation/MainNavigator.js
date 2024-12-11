import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../app/index'
import ReportLost from '../screens/ReportLost'
import ReportFound from '../screens/ReportFound'
const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ReportLost" component={ReportLost} />
        <Stack.Screen name="ReportFound" component={ReportFound} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
