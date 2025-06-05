import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button as NavigationButton } from '@react-navigation/elements';

export function Home({ route }) {
  const navigation = useNavigation();
  const { info } = route.params ?? {}
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <NavigationButton onPress={() => navigation.navigate('Game')}>
        Go to Game
      </NavigationButton>
      <Text>Home Screen</Text>
      <Text>{info}</Text>
    </View>
  );
}
