import 'package:bandwagon/shared/data/v1/play.dart';
import 'package:bandwagon/shared/data/v1/schedule_tree.dart';
import 'package:bandwagon/shared/utils/resolve-async-value.dart';
import 'package:bandwagon/shared/utils/time.dart';
import 'package:bandwagon/shared/widgets/custom_appbar.dart';
import 'package:bandwagon/shared/widgets/in_app_browser.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class _GameScreenAppBar extends StatelessWidget {
  const _GameScreenAppBar({
    required this.gameNoStr,
    required this.dateStr,
    required this.onExternalPressed,
    required this.onBackPressed,
    required this.onNextPressed,
    required this.onPrevPressed,
  });

  final String gameNoStr;
  final String dateStr;
  final void Function()? onExternalPressed;
  final void Function()? onBackPressed;
  final void Function()? onNextPressed;
  final void Function()? onPrevPressed;

  @override
  Widget build(BuildContext context) {
    return CustomAppBar(
      leadings: [
        IconButton(onPressed: onBackPressed, icon: Icon(Icons.arrow_back)),
      ],
      actions: [
        IconButton(
          onPressed: onExternalPressed,
          icon: Icon(Icons.open_in_new),
          color: onExternalPressed == null ? Colors.transparent : null,
        ),
      ],
      title: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(onPressed: onPrevPressed, icon: Icon(Icons.chevron_left)),
          Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  dateStr,
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 14),
                ),
                Text(
                  'No.$gameNoStr',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12),
                ),
              ],
            ),
          ),
          IconButton(onPressed: onNextPressed, icon: Icon(Icons.chevron_right)),
        ],
      ),
    );
  }
}

class GameScreenAppBar extends HookConsumerWidget
    implements PreferredSizeWidget {
  const GameScreenAppBar({super.key, required this.playId});

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  final String playId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final (playStatus, play, _) = resolveAsyncValue(
      ref.watch(getPlayProvider(playId)),
    );

    final (scheduleTreeStatus, scheduleTree, _) = resolveAsyncValue(
      ref.watch(scheduleTreeProvider),
    );

    final (onPrevPressed, onNextPressed) = (() {
      if (play == null || scheduleTree == null) {
        return (null, null);
      }

      final list = scheduleTree.listWithDate;

      final index = list.indexWhere((record) {
        final (_, play) = record;
        return play.playId == playId;
      });

      void Function()? getToPlayByIndex(int index) {
        if (index >= list.length || index < 0) {
          return null;
        }
        return () {
          final (_, play) = list[index];
          GoRouter.of(context).pushReplacement('/game/${play.playId}');
        };
      }

      return (getToPlayByIndex(index - 1), getToPlayByIndex(index + 1));
    })();

    final browser = InAppBrowser();
    final openGameWeb = play == null
        ? null
        : () {
            final url =
                'https://www.cpbl.com.tw/box?year=${play.game.year}&kindCode=${play.game.kind.value}&gameSno=${play.game.seriesNo.toString()}';
            browser.openUrl(url);
          };

    return _GameScreenAppBar(
      onBackPressed: () {
        GoRouter.of(context).pop(true);
      },
      onPrevPressed: onPrevPressed,
      onNextPressed: onNextPressed,
      onExternalPressed: openGameWeb,
      gameNoStr: play?.game.seriesNo.toString() ?? '---',
      dateStr: (() {
        if (play == null) {
          return '';
        }
        return toYYYY_MM_DD__EEE(play.startDatetime);
      })(),
    );
  }
}
