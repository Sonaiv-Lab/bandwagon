import 'package:flutter/material.dart';

import 'schedule_screen.dart';
import 'utils.dart';
import 'package:go_router/go_router.dart';
import 'package:bandwagon/shared/router.dart';

final scheduleRoute = GoRoute(
  path: '/schedule',
  redirect: (context, state) {
    final yearMonth = state.pathParameters['yearMonth'];

    final bool isValidYearMonth = ScheduleYearMonth.isValid(yearMonth ?? '');

    if (yearMonth == null || !isValidYearMonth) {
      final currentYearMonth = ScheduleYearMonth.getNow();
      return '/schedule/$currentYearMonth';
    }

    return null;
  },
  routes: [
    GoRoute(
      path: ':yearMonth',
      pageBuilder: (context, GoRouterState state) {
        final String? yearMonth = state.pathParameters['yearMonth'];
        print('yearMonth $yearMonth');

        if (yearMonth == null) {
          return pageBuilderFactory(child: Text('gg'), key: state.pageKey);
        }

        final title = ScheduleYearMonth.transDisplayFormat(yearMonth);

        return pageBuilderFactory(
          child: ScheduleScreen(title: title, yearMonth: yearMonth),
          key: state.pageKey,
        );
      },
    ),
  ],
);
