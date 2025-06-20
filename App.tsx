/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {useColorScheme} from 'react-native';

import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {store} from './src/redux/store';
import {AvailableRewardsScreen} from './src/screens/AvailableRewardsScreen';
import {CollectedRewardsScreen} from './src/screens/CollectedRewardsScreen';

export type RootStackParamList = {
  Available: undefined;
  Collected: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Available" component={AvailableRewardsScreen} />
          <Stack.Screen name="Collected" component={CollectedRewardsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
