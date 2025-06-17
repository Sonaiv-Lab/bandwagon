import {useCalendar} from '#/data/schedule/calendar';
import {Schedule as ScheduleScreen} from '#/screens';
import {useNavigation, useTheme} from '@react-navigation/native';
import {DateTime} from 'luxon';
import {Appbar} from 'react-native-paper';
import Icon from '@react-native-vector-icons/material-design-icons';
import {pipe} from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import * as A from 'fp-ts/Array';

const format = (datetime: DateTime) => {
  return datetime.toFormat('yyyy-MM');
};

// TODO dealing with typescript issue from route
const Header = ({route}) => {
  const navigation = useNavigation();
  const {data: calendar = {}} = useCalendar();
  const theme = useTheme();

  const currentMonth = route.params.current;
  const currentDateTime = DateTime.fromISO(currentMonth);

  const flattenedEntries = pipe(
    calendar,
    R.toEntries,
    A.flatMap(([year, months]) => pipe(months, R.toEntries)),
  );

  const currentMonthIndex = flattenedEntries.findIndex(
    ([yearMonth]) => yearMonth === currentMonth,
  );

  const isPrevAvailable = currentMonthIndex > 0;
  const isNextAvailable =
    currentMonthIndex > -1 &&
    currentMonthIndex + 1 <= flattenedEntries.length - 1;

  const toNow = () => {
    const now = pipe(DateTime.now(), format);

    navigation.setParams({
      current: now,
    });
  };

  const toNext = () => {
    const nextMonth = pipe(currentDateTime.plus({month: 1}), format);

    navigation.setParams({
      current: nextMonth,
    });
  };

  const toPrev = () => {
    const prevMonth = pipe(currentDateTime.minus({month: 1}), format);

    navigation.setParams({
      current: prevMonth,
    });
  };

  const title = currentDateTime.toFormat('yyyy/MM');

  return (
    <Appbar.Header >
      <Appbar.Action
        icon="calendar-refresh"
        onPress={toNow}
      />
      <Appbar.Action
        icon="chevron-left"
        onPress={toPrev}
        disabled={!isPrevAvailable}
      />
      <Appbar.Content
        titleStyle={{
          textAlign: 'center',
          fontSize: 20,
        }}
        title={title}
      />
      <Appbar.Action
        icon="chevron-right"
        onPress={toNext}
        disabled={!isNextAvailable}
      />
      <Appbar.Action
        icon="view-list"
        onPress={() => {}}
        style={{opacity: 0}}
        disabled
      />
    </Appbar.Header>
  );
};

const Schedule = {
  screen: ScheduleScreen,
  initialParams: {
    current: format(DateTime.now()),
  },
  options: {
    tabBarIcon: props => <Icon name="calendar" {...props} />,
    // must use render function: https://github.com/react-navigation/react-navigation/issues/8463
    header: props => <Header {...props} />,
  },
};

export {Schedule};
