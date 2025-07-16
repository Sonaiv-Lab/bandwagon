import 'package:bandwagon/shared/data/game.dart' show getGameProvider;
import 'package:bandwagon/shared/data/schedule_tree/schedule_tree.dart';
import 'package:bandwagon/shared/data/team_info_map.dart'
    show teamInfoMapProvider;
import 'package:bandwagon/shared/models/game/game.dart';
import 'package:bandwagon/shared/utils/resolve-async-value.dart';
import 'package:bandwagon/shared/utils/time.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';

class _GameScreenAppBar extends StatelessWidget {
  const _GameScreenAppBar({
    required this.gameNoStr,
    required this.dateStr,
    required this.onBackPressed,
    required this.onNextPressed,
    required this.onPrevPressed,
  });

  final String gameNoStr;
  final String dateStr;
  final void Function()? onBackPressed;
  final void Function()? onNextPressed;
  final void Function()? onPrevPressed;

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      leading: IconButton(
        onPressed: onBackPressed,
        icon: Icon(Icons.arrow_back),
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
          Column(
            spacing: 2,
            children: [
              Text(
                dateStr,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18),
              ),
              Text(
                'No.$gameNoStr',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14),
              ),
            ],
          ),
          IconButton(onPressed: onNextPressed, icon: Icon(Icons.chevron_right)),
        ],
      ),
    );
  }
}

class GameScreenAppBar extends HookConsumerWidget
    implements PreferredSizeWidget {
  const GameScreenAppBar({super.key, required this.gameId});

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  final String gameId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final (gameStatus, game, _) = resolveAsyncValue(
      ref.watch(getGameProvider(gameId)),
    );

    final (scheduleTreeStatus, scheduleTree, _) = resolveAsyncValue(
      ref.watch(scheduleTreeProvider),
    );

    final (onPrevPressed, onNextPressed) = (() {
      if (game == null || scheduleTree == null) {
        return (null, null);
      }

      final list = scheduleTree.gameListWithDate;

      //
      final index = list.indexWhere((record) {
        final (_, game) = record;
        return game.id == gameId;
      });

      void Function()? getToGameByIndex(int index) {
        if (index >= list.length || index < 0) {
          return null;
        }
        return () {
          final (_, game) = list[index];
          GoRouter.of(context).pushReplacement('/game/${game.id}');
        };
      }

      return (getToGameByIndex(index - 1), getToGameByIndex(index + 1));
    })();

    return _GameScreenAppBar(
      onBackPressed: () {
        GoRouter.of(context).pop(true);
      },
      onPrevPressed: onPrevPressed,
      onNextPressed: onNextPressed,
      gameNoStr: game?.gameNo.toString() ?? '---',
      dateStr: (() {
        if (game == null) {
          return '';
        }
        return toYYYY_MM_DD__EEE(game.startDatetime);
      })(),
    );
  }
}
