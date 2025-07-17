import 'package:bandwagon/features/schedule/widgets/calendar/game_bottom_sheet/game_bottom_sheet.dart';
import 'package:bandwagon/features/schedule/widgets/calendar/game_chip.dart';
import 'package:bandwagon/shared/models/game_summary/game_summary.dart';
import 'package:bandwagon/shared/utils/resolve-async-value.dart';
import 'package:bandwagon/shared/utils/time.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:jiffy/jiffy.dart';
import 'calendar_date.dart' as calendar_date;
import 'calendar_row.dart';
import 'package:collection/collection.dart';

import 'package:bandwagon/shared/utils/time.dart';
import 'package:bandwagon/shared/data/team_info_map.dart';
import 'package:bandwagon/shared/data/field_info_map.dart';
import 'package:bandwagon/shared/data/schedule_tree/schedule_tree.dart';

class Calendar extends HookConsumerWidget {
  const Calendar({super.key, required this.from, required this.to});

  final DateTime from;
  final DateTime to;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scheduleTree = resolveAsyncValue(ref.watch(scheduleTreeProvider));

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
          final (_, data, error) = scheduleTree;

          if (data == null) {
            return Container();
          }

          final date = displayStart.add(days: dayIndex).dateTime;
          return Date(date: date);
        }).toList(),
      );
    }).toList();

    // GameChip(
    //  leftColorHex: value['AKP011']!.theme.primaryColor,
    //  rightColorHex: value['AEO011']!.theme.primaryColor,
    //),

    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: dates,
      ),
    );
  }
}

class Date extends HookConsumerWidget {
  const Date({super.key, required this.date});
  final DateTime date;

  Widget build(BuildContext context, WidgetRef ref) {
    final (teamInfoMapStatus, teamInfoMap, _) = resolveAsyncValue(
      ref.watch(teamInfoMapProvider),
    );
    final (scheduleTreeStatus, scheduleTree, _) = resolveAsyncValue(
      ref.watch(scheduleTreeProvider),
    );

    final (fieldInfoMapStatus, fieldInfoMap, _) = resolveAsyncValue(
      ref.watch(fieldInfoMapProvider),
    );

    if (teamInfoMap != null && scheduleTree != null && fieldInfoMap != null) {
      final dateStr = toYYYY_MM_DD(date);

      final games = scheduleTree.datesMap[dateStr] ?? [];

      final chips = games.map((game) {
        final GameSummary(:homeTeamCode, :visitingTeamCode) = game;
        final homeTeamInfo = teamInfoMap[homeTeamCode]!;
        final visitingTeamInfo = teamInfoMap[visitingTeamCode]!;

        return GameChip(
          leftColorHex: homeTeamInfo.theme.primaryColor,
          rightColorHex: visitingTeamInfo.theme.primaryColor,
        );
      }).toList();

      final modalGameItems = games.map((game) {
        final GameSummary(:homeTeamCode, :visitingTeamCode) = game;
        final homeTeamInfo = teamInfoMap[homeTeamCode]!;
        final visitingTeamInfo = teamInfoMap[visitingTeamCode]!;
        final field = fieldInfoMap[game.field]!;

        return GameItem(
          onGameItemTap: () {
            GoRouter.of(context).pop();
            GoRouter.of(context).push('/game/${game.id}');
          },
          gameNo: 'No. ${game.gameNo.toString()}',
          fieldName: field.name,
          startAt: toHH_MM(game.startDatetime),
          leftColorHex: homeTeamInfo.theme.primaryColor,
          leftTeamName: homeTeamInfo.name,
          rightColorHex: visitingTeamInfo.theme.primaryColor,
          rightTeamName: visitingTeamInfo.name,
        );
      }).toList();

      return calendar_date.CalendarDate(
        chips: chips,
        dateLabel: date.day.toString(),
        onDateTap: () {
          calendar_date.showDateDetailModal(
            items: modalGameItems,
            context: context,
            date: date,
          );
        },
      );
    }

    return Container(
      child: CircularProgressIndicator.adaptive()
    );
  }
}
