import {Game as GameScreen} from '#/screens';
import {useNavigation} from '@react-navigation/native';
import {Appbar} from 'react-native-paper';

const Header = () => {
  const navigation = useNavigation();
  return (
    <Appbar.Header>
      <Appbar.Action
        icon="arrow-left"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Appbar.Action icon="chevron-left" onPress={() => {}} />
      <Appbar.Content
        titleStyle={{textAlign: 'center'}}
        title="2025/12/6 (三)"
      />
      <Appbar.Action icon="chevron-right" onPress={() => {}} />
      <Appbar.Action icon="view-list" onPress={() => {}} />
    </Appbar.Header>
  );
};

const Game = {
  screen: GameScreen,
  options: {
    header: () => <Header />,
    tabBarItemStyle: { display: 'none' },
  },
} as const;

export {Game};
