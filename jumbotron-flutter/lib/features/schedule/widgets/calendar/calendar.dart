import 'package:bandwagon/features/schedule/widgets/calendar/game_bottom_sheet/game_bottom_sheet.dart';
import 'package:bandwagon/features/schedule/widgets/calendar/game_chips.dart';
import 'package:bandwagon/shared/models/v1/summary/summary.dart'
    as game_summary_v1;

import 'package:bandwagon/shared/utils/by_game_result.dart';
import 'package:bandwagon/shared/utils/resolve-async-value.dart';
import 'package:bandwagon/shared/utils/time.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:jiffy/jiffy.dart';
import 'calendar_date.dart' as calendar_date;
import 'calendar_row.dart';
import 'package:collection/collection.dart';

import 'package:bandwagon/shared/data/team_info_map.dart';
import 'package:bandwagon/shared/data/field_info_map.dart';
import 'package:bandwagon/shared/data/v1/schedule_tree.dart'
    as schedule_tree_v1;

class DateLabel extends StatelessWidget {
  const DateLabel(this.text, {super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: TextAlign.center,
      style: TextStyle(fontSize: 10),
    );
  }
}

class Calendar extends HookConsumerWidget {
  const Calendar({super.key, required this.from, required this.to});

  final DateTime from;
  final DateTime to;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scheduleTreeV1 = resolveAsyncValue(
      ref.watch(schedule_tree_v1.scheduleTreeProvider),
    );

    final displayStart = Jiffy.parseFromDateTime(from).startOf(Unit.week);
    final displayEnd = Jiffy.parseFromDateTime(to).endOf(Unit.week);

    final daysCount =
        displayEnd.diff(displayStart, unit: Unit.day, asFloat: false).toInt() +
        1;

    final datesIndex = groupBy(
      List<int>.generate(daysCount, (int i) {
        return i;
      }),
      (i) => i ~/ 7,
    );

    final dates = datesIndex.entries.map((entry) {
      final weekIndexes = entry.value;
      final weekIndex = entry.key;

      return CalendarRow(
        isExpanded: true,
        isLastRow: weekIndex + 1 >= datesIndex.length,
        children: weekIndexes.map((int dayIndex) {
          final (_, dataV1, errorV1) = scheduleTreeV1;

          print('errorV1');
          print(errorV1);

          if (dataV1 == null) {
            return Container();
          }

          final date = displayStart.add(days: dayIndex).dateTime;
          final isInRange = Jiffy.parseFromDateTime(
            from,
          ).isSame(Jiffy.parseFromDateTime(date), unit: Unit.month);
          return Date(date: date, isInRange: isInRange);
        }).toList(),
      );
    }).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        CalendarRow(
          isExpanded: false,
          children: [
            DateLabel('M'),
            DateLabel('T'),
            DateLabel('W'),
            DateLabel('T'),
            DateLabel('F'),
            DateLabel('S'),
            DateLabel('S'),
          ],
        ),
        ...dates,
      ],
    );
  }
}

class Date extends HookConsumerWidget {
  const Date({super.key, required this.date, required this.isInRange});
  final DateTime date;
  final bool isInRange;

  Widget build(BuildContext context, WidgetRef ref) {
    final (teamInfoMapStatus, teamInfoMap, _) = resolveAsyncValue(
      ref.watch(teamInfoMapProvider),
    );
    final (scheduleTreeStatusV1, scheduleTreeV1, _) = resolveAsyncValue(
      ref.watch(schedule_tree_v1.scheduleTreeProvider),
    );

    final (fieldInfoMapStatus, fieldInfoMap, _) = resolveAsyncValue(
      ref.watch(fieldInfoMapProvider),
    );

    if (teamInfoMap != null && scheduleTreeV1 != null && fieldInfoMap != null) {
      final dateStr = toYYYY_MM_DD(date);

      final plays = scheduleTreeV1.datesMap[dateStr] ?? [];

      final chips = plays.map((play) {
        final game_summary_v1.Summary(:homeTeamCode, :visitingTeamCode) = play;
        final homeTeamInfo = teamInfoMap[homeTeamCode]!;
        final visitingTeamInfo = teamInfoMap[visitingTeamCode]!;

        return byGameStatus(
          play.result,
          play.isPlayBall,
          inProgress: OngoingGameChip(
            leftColorHex: visitingTeamInfo.theme.primaryColor,
            rightColorHex: homeTeamInfo.theme.primaryColor,
            leftScore: play.visitingScore,
            rightScore: play.homeScore,
          ),
          pending: PendingGameChip(
            leftColorHex: visitingTeamInfo.theme.primaryColor,
            rightColorHex: homeTeamInfo.theme.primaryColor,
          ),
          postponed: PendingGameChip(
            leftColorHex: visitingTeamInfo.theme.subtleColor,
            rightColorHex: homeTeamInfo.theme.subtleColor,
          ),
          suspended: OngoingGameChip(
            leftColorHex: visitingTeamInfo.theme.subtleColor,
            rightColorHex: homeTeamInfo.theme.subtleColor,
            leftScore: play.visitingScore,
            rightScore: play.homeScore,
          ),
          ended: EndedGameChip(
            leftColorHex: visitingTeamInfo.theme.primaryColor,
            rightColorHex: homeTeamInfo.theme.primaryColor,
            leftScore: play.visitingScore,
            rightScore: play.homeScore,
          ),
        );
      }).toList();

      final modalGameItems = plays.map((play) {
        final game_summary_v1.Summary(:homeTeamCode, :visitingTeamCode) = play;
        final homeTeamInfo = teamInfoMap[homeTeamCode]!;
        final visitingTeamInfo = teamInfoMap[visitingTeamCode]!;
        final field = fieldInfoMap[play.field]!;

        return GameItem(
          onGameItemTap: () {
            GoRouter.of(context).pop();
            GoRouter.of(context).push('/game/${play.playId}');
          },
          gameNo: 'No. ${play.seriesNo.toString()}',
          fieldName: field.name,
          isPlayBall: play.isPlayBall,
          startAt: toH_MM(play.startDatetime),
          leftPrimaryColorHex: visitingTeamInfo.theme.primaryColor,
          leftSubtleColorHex: visitingTeamInfo.theme.subtleColor,
          leftTeamName: visitingTeamInfo.name,
          leftScore: play.visitingScore,
          rightPrimaryColorHex: homeTeamInfo.theme.primaryColor,
          rightSubtleColorHex: homeTeamInfo.theme.subtleColor,
          rightTeamName: homeTeamInfo.name,
          rightScore: play.homeScore,
          result: play.result,
          startDatetime: play.startDatetime,
        );
      }).toList();

      final isToday = Jiffy.now().isSame(
        Jiffy.parseFromDateTime(date),
        unit: Unit.day,
      );

      return calendar_date.CalendarDate(
        chips: chips,
        dateLabel: date.day.toString(),
        isDateLabelUnderlined: isToday,
        isDateLabelColorDim: !isInRange,
        onDateTap: () {
          calendar_date.showDateDetailModal(
            items: modalGameItems,
            context: context,
            date: date,
          );
        },
      );
    }

    return Container();
  }
}
