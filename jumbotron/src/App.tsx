import React from 'react';
import { Home } from './screens';
import { Schedule, Game } from '#/navigation';

import { createStaticNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button as NavigationButton } from '@react-navigation/elements';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { PaperProvider } from 'react-native-paper';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Root = createBottomTabNavigator({
  screenOptions: {
    animation: 'fade',
    headerStyle: { backgroundColor: 'tomato' },
  },
  initialRouteName: 'Home',
  backBehavior: 'order',
  screens: {
    Home: {
      screen: Home,
      options: {
        headerRight: () => (
          <NavigationButton onPress={() => alert('This is a button!')}>
            Info
          </NavigationButton>
        ),
      },
    },
    Schedule,
    Game,
  },
});

const Navigation = createStaticNavigation(Root);

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView>
      <PaperProvider>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
