import 'package:bandwagon/shared/data/schedule_tree/schedule_tree.dart';
import 'package:bandwagon/shared/utils/resolve-async-value.dart';
import 'package:flutter/material.dart';

import 'package:bandwagon/features/schedule/utils.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:jiffy/jiffy.dart';
import './widgets/calendar/calendar.dart';
import './widgets/app_bar.dart';

class Schedule extends HookConsumerWidget {
  const Schedule({super.key, required this.yearMonth});

  final String yearMonth;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final (status, data, error) = resolveAsyncValue(
      ref.watch(scheduleTreeProvider),
    );

    return switch (status) {
      QueryStatus.success => (() {
        data!.monthsList;
        final currentYearMonth = ScheduleYearMonth(yearMonth);

        if (!data.monthsList.contains(yearMonth)) {
          // TODO, go to the month with games;
          return Center(
            child: Column(
              children: [
                Text('No Games'),
                TextButton(
                  onPressed: () {
                    final firstMonth = data.monthsList[0];
                    GoRouter.of(context).go('/schedule/$firstMonth');
                  },
                  child: Text('Go to games'),
                ),
              ],
            ),
          );
        }

        final startOfMonth = Jiffy.parseFromDateTime(
          currentYearMonth.datetime,
        ).startOf(Unit.month).dateTime;
        final endOfMonth = Jiffy.parseFromDateTime(
          currentYearMonth.datetime,
        ).endOf(Unit.month).dateTime;

        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [Calendar(from: startOfMonth, to: endOfMonth)],
          ),
        );
      })(),
      QueryStatus.error => (() {
        return Container();
      })(),
      QueryStatus.loading => SizedBox(
        width: double.infinity,
        height: double.infinity,
        child: Center(child: CircularProgressIndicator.adaptive()),
      ),
    };
  }
}

class ScheduleScreen extends StatelessWidget {
  const ScheduleScreen({
    super.key,
    required this.yearMonth,
  });

  final String yearMonth;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: ScheduleAppBar(yearMonth: yearMonth),
      body: Schedule(yearMonth: yearMonth)
    );
  }
}
