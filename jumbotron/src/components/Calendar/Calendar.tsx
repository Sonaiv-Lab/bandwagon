import {ComponentProps} from 'react';
import {Header, CellBody, RowBody} from './UI';
import {View} from 'react-native';
import {DateTime} from 'luxon';
import * as A from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

type CellContentProps = ComponentProps<typeof CellBody>;

export const Calendar = ({
  from,
  to,
  renderCellProps,
}: {
  from: DateTime;
  to: DateTime;
  renderCellProps: (datetime: DateTime) => CellContentProps;
}) => {
  const displayStartDate = from.set({weekday: 1});
  const displayEndDate = to.set({weekday: 7});

  const { days: displayDays = 0 } = displayEndDate.diff(displayStartDate, 'days').toObject();

  const body = pipe(
    A.range(0, displayDays),
    A.mapWithIndex(i => {
      return displayStartDate.plus({days: i});
    }),
    A.map(datetime => {
      return (
        <CellBody key={datetime.toISODate()} {...renderCellProps(datetime)} />
      );
    }),
    A.chunksOf(7),
    weeks => {
      const length = weeks.length;

      return pipe(
        weeks,
        A.mapWithIndex((i, rows) => {
          const isLastWeek = i === length - 1;
          return (
            <RowBody key={i} row={rows} style={isLastWeek && {borderBottomWidth: 0}} />
          );
        }),
      );
    },
  );

  // const displayStartDay = from.set({ weekday: 1 }).get('day')
  // const displayEndDay = to.set({ weekday: 7 }).get('day');

  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      <Header />
      {body}
    </View>
  );
};
