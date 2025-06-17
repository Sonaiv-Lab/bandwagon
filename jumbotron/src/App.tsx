import React from 'react';
import {Home} from './screens';
import {Schedule, Game} from '#/navigation';

import {createStaticNavigation} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Button as NavigationButton} from '@react-navigation/elements';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {PaperProvider} from 'react-native-paper';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {} from '@tanstack/react-query';

import {QueryProvider} from '#/data';
import Icon from '@react-native-vector-icons/material-design-icons';


const Root = createBottomTabNavigator({
  screenOptions: {
    animation: 'fade',
  },
  initialRouteName: 'Home',
  backBehavior: 'order',
  screens: {
    Home: {
      screen: Home,
      options: {
        tabBarIcon: (props) => <Icon name='home' {...props}/>,
      },
    },
    Schedule,
    Game,
  },
});

const Navigation = createStaticNavigation(Root);

function App(): React.JSX.Element {
  return (
    <QueryProvider>
      <GestureHandlerRootView>
        <PaperProvider>
          <SafeAreaProvider>
            <Navigation />
          </SafeAreaProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </QueryProvider>
  );
}

export default App;
