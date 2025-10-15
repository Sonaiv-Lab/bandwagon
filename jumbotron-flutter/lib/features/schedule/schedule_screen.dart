import 'package:bandwagon/shared/data/v1/schedule_tree.dart';
import 'package:bandwagon/shared/utils/resolve-async-value.dart';
import 'package:bandwagon/shared/widgets/custom_refresh_wrapper.dart';
import 'package:flutter/material.dart';

import 'package:bandwagon/features/schedule/utils.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:jiffy/jiffy.dart';
import './widgets/calendar/calendar.dart';
import 'widgets/schedule_app_bar.dart';

class SuccessSchedule extends StatefulWidget {
  final List<String> monthsList;
  final String yearMonth;
  final Future<void> Function() onRefresh;

  const SuccessSchedule({
    super.key,
    required this.monthsList,
    required this.yearMonth,
    required this.onRefresh,
  });

  @override
  State<SuccessSchedule> createState() => _SuccessScheduleState();
}

class _SuccessScheduleState extends State<SuccessSchedule> {
  late PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(
      keepPage: true,
      initialPage: widget.monthsList.indexOf(widget.yearMonth),
    );
  }

  @override
  void didUpdateWidget(covariant SuccessSchedule oldWidget) {
    super.didUpdateWidget(oldWidget);

    final isIdle = !_pageController.position.isScrollingNotifier.value;

    if (widget.yearMonth != oldWidget.yearMonth && isIdle) {
      _pageController.jumpToPage(
        widget.monthsList.indexOf(widget.yearMonth),
      );
    } 
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: PageView.builder(
        onPageChanged: (index) {
          final router = GoRouter.of(context);
          final want = '/schedule/${widget.monthsList[index]}';
          if (router.state.uri.toString() != want) {
            GoRouter.of(
              context,
            ).replace('/schedule/${widget.monthsList[index]}');
          }
        },
        clipBehavior: Clip.none,
        controller: _pageController,
        itemCount: widget.monthsList.length,
        itemBuilder: (BuildContext context, int index) {
          final month = widget.monthsList[index];
          final currentYearMonth = ScheduleYearMonth(month);
          final startOfMonth = Jiffy.parseFromDateTime(
            currentYearMonth.datetime,
          ).startOf(Unit.month).dateTime;
          final endOfMonth = Jiffy.parseFromDateTime(
            currentYearMonth.datetime,
          ).endOf(Unit.month).dateTime;
          return LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) {
              return CustomRefreshWrapper(
                onRefresh: widget.onRefresh,
                child: SizedBox(
                  width: constraints.maxWidth,
                  height: constraints.maxHeight,
                  child: Calendar(from: startOfMonth, to: endOfMonth),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

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

        return SuccessSchedule(
          yearMonth: yearMonth,
          monthsList: data.monthsList,
          onRefresh: () async {
            await updateScheduleTree();
            return ref.refresh(scheduleTreeProvider.future);
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

    print('ScheduleScreen: $yearMonth');

    return Scaffold(
      appBar: ScheduleAppBar(yearMonth: yearMonth),
      body: Schedule(yearMonth: yearMonth),
    );
  }
}
