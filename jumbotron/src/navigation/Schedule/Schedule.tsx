import {Schedule as ScheduleScreen} from '#/screens';
import {Appbar} from 'react-native-paper';

const Header = () => (
  <Appbar.Header>
    <Appbar.Action icon="calendar-refresh" onPress={() => {}} />
    <Appbar.Action icon="chevron-left" onPress={() => {}} />
    <Appbar.Content titleStyle={{textAlign: 'center'}} title="2025/12" />
    <Appbar.Action icon="chevron-right" onPress={() => {}} />
    <Appbar.Action icon="view-list" onPress={() => {}} />
  </Appbar.Header>
);

const Schedule = {
  screen: ScheduleScreen,
  options: {
    header: () => <Header />,
  },
};

export {Schedule};
