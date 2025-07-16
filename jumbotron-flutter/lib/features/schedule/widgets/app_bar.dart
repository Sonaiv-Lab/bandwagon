import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import 'package:bandwagon/features/schedule/utils.dart';
import 'package:bandwagon/shared/utils/resolve-async-value.dart';
import 'package:bandwagon/shared/data/schedule_tree/schedule_tree.dart';

class _ScheduleAppBar extends StatelessWidget {
  const _ScheduleAppBar({
    super.key,
    required this.onNextPressed,
    required this.onPrevPressed,
    required this.onTodayPressed,
    required this.title,
  });

  final void Function()? onNextPressed;
  final void Function()? onPrevPressed;
  final void Function()? onTodayPressed;
  final String title;

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      leading: IconButton(
        onPressed: onTodayPressed,
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
          IconButton(onPressed: onPrevPressed, icon: Icon(Icons.chevron_left)),
          Text(title, textAlign: TextAlign.center),
          IconButton(onPressed: onNextPressed, icon: Icon(Icons.chevron_right)),
        ],
      ),
    );
  }
}

class ScheduleAppBar extends HookConsumerWidget implements PreferredSizeWidget {
  const ScheduleAppBar({super.key, required this.yearMonth});

  final String yearMonth;

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final (status, data, error) = resolveAsyncValue(
      ref.watch(scheduleTreeProvider),
    );

    final title = ScheduleYearMonth.transDisplayFormat(yearMonth);

    if (data == null) {
      return _ScheduleAppBar(
        onNextPressed: null,
        onPrevPressed: null,
        onTodayPressed: null,
        title: title,
      );
    }

    final currentIndex = data.monthsList.indexOf(yearMonth);

    void Function()? getGoToIndexMonth(int index) {
      if (index < 0 || index >= data.monthsList.length) {
        return null;
      }

      return () {
        GoRouter.of(context).go('/schedule/${data.monthsList[index]}');
      };
    }

    return _ScheduleAppBar(
      onNextPressed: getGoToIndexMonth(currentIndex + 1),
      onPrevPressed: getGoToIndexMonth(currentIndex - 1),
      onTodayPressed: () {
        final now = ScheduleYearMonth.fromDatetime(
          DateTime.now(),
        ).toFormatted();

        GoRouter.of(context).go('/schedule/$now');
      },
      title: title,
    );
  }
}
