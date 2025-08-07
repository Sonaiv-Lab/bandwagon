import 'package:bandwagon/shared/data/schedule_tree/schedule_tree.dart';
import 'package:bandwagon/shared/utils/resolve-async-value.dart';
import 'package:bandwagon/shared/widgets/custom_refresh_wrapper.dart';
import 'package:flutter/material.dart';

import 'package:bandwagon/features/schedule/utils.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:jiffy/jiffy.dart';
import './widgets/calendar/calendar.dart';
import 'widgets/schedule_app_bar.dart';

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

        void goToIndexMonth(int next) {
          final currentIndex = data.monthsList.indexOf(yearMonth);
          final index = currentIndex + next;
          if (index < 0 || index >= data.monthsList.length) {
            return;
          }

          GoRouter.of(context).go('/schedule/${data.monthsList[index]}');
        }

        final startOfMonth = Jiffy.parseFromDateTime(
          currentYearMonth.datetime,
        ).startOf(Unit.month).dateTime;
        final endOfMonth = Jiffy.parseFromDateTime(
          currentYearMonth.datetime,
        ).endOf(Unit.month).dateTime;

        return LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            return CustomRefreshWrapper(
              onRefresh: () async {
                await updateScheduleTree();
                return ref.refresh(scheduleTreeProvider.future);
              },
              child: GestureDetector(
                onHorizontalDragEnd: (detail) {
                  if (detail.primaryVelocity == null) {
                    return;
                  }

                  if (detail.primaryVelocity! > 0) {
                    goToIndexMonth(-1);
                  }
                  if (detail.primaryVelocity! < 0) {
                    goToIndexMonth(1);
                  }
                },
                child: SizedBox(
                  width: constraints.maxWidth,
                  height: constraints.maxHeight,
                  child: Calendar(from: startOfMonth, to: endOfMonth),
                ),
              ),
            );
          },
        );
      })(),
      QueryStatus.error => (() {
        return Center(child: Text('something went wrong'));
      })(),
      QueryStatus.loading => Center(
        child: CircularProgressIndicator.adaptive(),
      ),
    };
  }
}

class ScheduleScreen extends StatelessWidget {
  const ScheduleScreen({super.key, required this.yearMonth});

  final String yearMonth;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: ScheduleAppBar(yearMonth: yearMonth),
      body: Schedule(yearMonth: yearMonth),
    );
  }
}
