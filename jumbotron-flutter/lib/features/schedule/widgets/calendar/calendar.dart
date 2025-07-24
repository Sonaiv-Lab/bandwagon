import 'package:bandwagon/features/schedule/widgets/calendar/game_bottom_sheet/game_bottom_sheet.dart';
import 'package:bandwagon/features/schedule/widgets/calendar/game_chips.dart';
import 'package:bandwagon/shared/constants/game.dart';
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
          final isInRange = Jiffy.parseFromDateTime(
            from,
          ).isSame(Jiffy.parseFromDateTime(date), unit: Unit.month);
          return Date(date: date, isInRange: isInRange);
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
  const Date({super.key, required this.date, required this.isInRange});
  final DateTime date;
  final bool isInRange;

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

        return switch (game.result) {
          GameResult.pending when DateTime.now().isAfter(game.startDatetime) =>
            OngoingGameChip(
              leftColorHex: homeTeamInfo.theme.primaryColor,
              rightColorHex: visitingTeamInfo.theme.primaryColor,
              leftScore: game.homeScore,
              rightScore: game.visitingScore,
          ),
          GameResult.pending => PendingGameChip(
            leftColorHex: homeTeamInfo.theme.primaryColor,
            rightColorHex: visitingTeamInfo.theme.primaryColor,
          ),
          GameResult.ended => EndedGameChip(
            leftColorHex: homeTeamInfo.theme.primaryColor,
            rightColorHex: visitingTeamInfo.theme.primaryColor,
            leftScore: game.homeScore,
            rightScore: game.visitingScore,
          ),
          GameResult.postponed => PendingGameChip(
            leftColorHex: homeTeamInfo.theme.primaryColor,
            rightColorHex: visitingTeamInfo.theme.primaryColor,
          ),
          _ => PendingGameChip(
            leftColorHex: homeTeamInfo.theme.primaryColor,
            rightColorHex: visitingTeamInfo.theme.primaryColor,
          ),
        };
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
          leftScore: game.homeScore,
          rightColorHex: visitingTeamInfo.theme.primaryColor,
          rightTeamName: visitingTeamInfo.name,
          rightScore: game.visitingScore,
          result: game.result,
          startDatetime: game.startDatetime
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
