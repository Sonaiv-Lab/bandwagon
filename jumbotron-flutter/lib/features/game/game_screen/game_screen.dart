import 'package:bandwagon/shared/data/field_info_map.dart'
    show FieldInfoMap, fieldInfoMapProvider;
import 'package:bandwagon/shared/data/schedule_tree/schedule_tree.dart';
import 'package:bandwagon/shared/data/team_info_map.dart';
import 'package:bandwagon/shared/utils/resolve-async-value.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart' show SvgPicture;
import 'package:go_router/go_router.dart';

import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:bandwagon/shared/data/game.dart';
import 'package:bandwagon/shared/models/game/game.dart';
import 'package:bandwagon/shared/utils/hex_color.dart';

import '../widgets/duel.dart';
import 'not_found.dart';
import 'game_screen_appbar.dart';

class _GameScreen extends StatelessWidget {
  const _GameScreen({
    required this.game,
    required this.gameId,
    required this.teamInfoMap,
    required this.fieldInfoMap,
    required this.scheduleTree,
  });

  final String gameId;
  final Game game;
  final TeamInfoMap teamInfoMap;
  final FieldInfoMap fieldInfoMap;
  final ScheduleTree scheduleTree;

  @override
  Widget build(BuildContext context) {
    final startTimeStr = DateFormat(
      'hh:mm',
      'zh_TW',
    ).format(game.startDatetime);

    final homeTeam = teamInfoMap[game.homeTeamCode]!;
    final visitingTeam = teamInfoMap[game.visitingTeamCode]!;
    final field = fieldInfoMap[game.field]!;

    return Scaffold(
      appBar: GameScreenAppBar(gameId: gameId),
      body: Container(
        padding: EdgeInsetsGeometry.symmetric(vertical: 14, horizontal: 16),
        child: Column(
          spacing: 12,
          children: [
            // 資料應該都拿到 Block 內部去 fetch，讓各個 Block 獨立
            Duel(
              leftTeamName: homeTeam.name,
              rightTeamName: visitingTeam.name,
              leftTeamColor: fromRGBHex(homeTeam.theme.primaryColor),
              rightTeamColor: fromRGBHex(visitingTeam.theme.primaryColor),
              startTimeStr: startTimeStr,
              fieldName: field.name,
              leftTeamIcon: SvgPicture.asset(
                homeTeam.assets.simplifyIconPath,
                width: 60,
                height: 60,
              ),
              rightTeamIcon: SvgPicture.asset(
                visitingTeam.assets.simplifyIconPath,
                width: 60,
                height: 60,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class GameScreen extends HookConsumerWidget {
  const GameScreen({super.key, required this.gameId});

  final String gameId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final (gameStatus, game, _) = resolveAsyncValue(
      ref.watch(getGameProvider(gameId)),
    );

    final (teamInfoMapStatus, teamInfoMap, _) = resolveAsyncValue(
      ref.watch(teamInfoMapProvider),
    );
    final (fieldInfoMapStatus, fieldInfoMap, _) = resolveAsyncValue(
      ref.watch(fieldInfoMapProvider),
    );

    final (scheduleTreeStatus, scheduleTree, _) = resolveAsyncValue(
      ref.watch(scheduleTreeProvider),
    );

    if (game != null &&
        teamInfoMap != null &&
        fieldInfoMap != null &&
        scheduleTree != null) {
      return _GameScreen(
        game: game,
        teamInfoMap: teamInfoMap,
        fieldInfoMap: fieldInfoMap,
        scheduleTree: scheduleTree,
        gameId: gameId,
      );
    }

    if (gameStatus == QueryStatus.loading ||
        teamInfoMapStatus == QueryStatus.loading ||
        fieldInfoMapStatus == QueryStatus.loading) {
      return Center(child: CircularProgressIndicator.adaptive());
    }

    return NotFoundScreen();
  }
}
