import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:bandwagon/features/schedule/utils.dart';
import './widgets/calendar/calendar.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class ScheduleScreen extends HookConsumerWidget {
  const ScheduleScreen({super.key, required this.title, required this.yearMonth});

  final String title;
  final String yearMonth;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentYearMonth = ScheduleYearMonth(yearMonth);

    final nextYearMonth = currentYearMonth.getNext();
    final prevYearMonth = currentYearMonth.getPrev();

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        leading: IconButton(
          onPressed: () {
            final now = ScheduleYearMonth.fromDatetime(
              DateTime.now(),
            ).toFormatted();
            GoRouter.of(context).go('/schedule/$now');
          },
          icon: Icon(Icons.calendar_today_rounded),
        ),
        actions: [
          IconButton(
            onPressed: () {},
            icon: Icon(Icons.calendar_today_rounded),
            color: Color(0x00000000),
          ),
        ],
        title: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(
              onPressed: () {
                final prevString = prevYearMonth.toFormatted();
                GoRouter.of(context).go('/schedule/$prevString');
              },
              icon: Icon(Icons.chevron_left),
            ),
            Text(title, textAlign: TextAlign.center),
            IconButton(
              onPressed: () {
                final nextString = nextYearMonth.toFormatted();
                GoRouter.of(context).go('/schedule/$nextString');
              },
              icon: Icon(Icons.chevron_right),
            ),
          ],
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [Calendar()],
        ),
      ),
    );
  }
}
