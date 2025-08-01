import 'package:bandwagon/shared/data/game.dart' show getGameProvider;
import 'package:bandwagon/shared/data/schedule_tree/schedule_tree.dart';
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
      leadings: [ IconButton(
        onPressed: onBackPressed,
        icon: Icon(Icons.arrow_back),
      ),
      ],
      actions: [IconButton(
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

    final browser = InAppBrowser();
    final openGameWeb = game == null ? null : () {
      final url =
        'https://www.cpbl.com.tw/box?year=${game?.year}&kindCode=${game.gameKindCode.value}&gameSno=${game.gameNo}';
            browser.openUrl(
        url,
      );
    };

    return _GameScreenAppBar(
      onBackPressed: () {
        GoRouter.of(context).pop(true);
      },
      onPrevPressed: onPrevPressed,
      onNextPressed: onNextPressed,
      onExternalPressed: openGameWeb,
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
