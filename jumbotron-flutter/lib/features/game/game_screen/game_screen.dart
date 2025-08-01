import 'package:bandwagon/shared/data/schedule_tree/schedule_tree.dart';
import 'package:bandwagon/shared/utils/resolve-async-value.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:bandwagon/shared/data/game.dart';

import '../widgets/duel.dart';
import 'game_screen_appbar.dart';

class GameScreen extends HookConsumerWidget {
  const GameScreen({super.key, required this.gameId});

  final String gameId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final (gameStatus, _, _) = resolveAsyncValue(
      ref.watch(getGameProvider(gameId)),
    );
    final (scheduleTreeStatus, scheduleTree, _) = resolveAsyncValue(
      ref.watch(scheduleTreeProvider),
    );

    toGameByIndex(int next) {
      if (scheduleTree == null) {
        return;
      }

      final list = scheduleTree.gameListWithDate;

      final index = list.indexWhere((record) {
        final (_, game) = record;
        return game.id == gameId;
      });

      final (_, game) = list[index + next];
      GoRouter.of(context).pushReplacement('/game/${game.id}');
    }

    return Scaffold(
      appBar: GameScreenAppBar(gameId: gameId),
      body: switch (gameStatus) {
        QueryStatus.success => (() {
          return GestureDetector(
            onHorizontalDragEnd: (detail) {
              if (detail.primaryVelocity == null) {
                return;
              }

              if (detail.primaryVelocity! > 0) {
                toGameByIndex(-1);
              }
              if (detail.primaryVelocity! < 0) {
                toGameByIndex(1);
              }
            },
            child: Container(
              padding: EdgeInsetsGeometry.symmetric(
                vertical: 12,
                horizontal: 12,
              ),
              child: Column(
                spacing: 12,
                children: [
                  // 資料應該都拿到 Block 內部去 fetch，讓各個 Block 獨立
                  Duel(gameId: gameId),
                ],
              ),
            ),
          );
        })(),
        QueryStatus.loading => Center(
          child: CircularProgressIndicator.adaptive(),
        ),
        _ => Container(),
      },
    );
  }
}
