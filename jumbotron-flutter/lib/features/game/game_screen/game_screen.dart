import 'package:bandwagon/shared/data/v0/game.dart';
import 'package:bandwagon/shared/data/v1/play.dart';
import 'package:bandwagon/shared/data/v1/schedule_tree.dart'
    as schedule_tree_v1;
import 'package:bandwagon/shared/utils/resolve-async-value.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../widgets/duel.dart';
import 'game_screen_appbar.dart';

class GameScreen extends HookConsumerWidget {
  const GameScreen({super.key, required this.playId});

  // 這個 gmaeId 應該要是 playId 才對
  final String playId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final (playStatus, _, _) = resolveAsyncValue(
      ref.watch(getPlayProvider(playId)),
    );

    final (scheduleTreeStatus, scheduleTree, _) = resolveAsyncValue(
      ref.watch(schedule_tree_v1.scheduleTreeProvider),
    );

    toGameByIndex(int next) {
      if (scheduleTree == null) {
        return;
      }

      final list = scheduleTree.listWithDate;

      final index = list.indexWhere((record) {
        final (_, play) = record;
        return play.playId == playId;
      });

      final (_, play) = list[index + next];
      GoRouter.of(context).pushReplacement('/game/${play.playId}');
    }

    return Scaffold(
      appBar: GameScreenAppBar(playId: playId),
      body: switch (playStatus) {
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
                  Duel(playId: playId),
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
