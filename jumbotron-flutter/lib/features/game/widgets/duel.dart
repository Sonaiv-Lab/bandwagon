import 'package:bandwagon/shared/constants/game.dart';
import 'package:bandwagon/shared/data/field_info_map.dart';
import 'package:bandwagon/shared/data/v1/play.dart';
import 'package:bandwagon/shared/data/team_info_map.dart';
import 'package:bandwagon/shared/utils/by_game_result.dart';
import 'package:bandwagon/shared/utils/hex_color.dart';
import 'package:bandwagon/shared/utils/resolve-async-value.dart';
import 'package:bandwagon/shared/utils/time.dart';
import 'package:bandwagon/shared/widgets/in_app_browser.dart';
import 'package:bandwagon/shared/widgets/tag/game_status_tag.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../game_screen/not_found.dart';

class Score extends StatelessWidget {
  const Score({
    super.key,
    required this.leftTeamScore,
    required this.rightTeamScore,
    required this.leftTeamColor,
    required this.rightTeamColor,
  });

  final int leftTeamScore;
  final int rightTeamScore;
  final Color leftTeamColor;
  final Color rightTeamColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      spacing: 20,
      children: [
        SizedBox(
          width: 40,
          child: Text(
            leftTeamScore.toString(),
            textAlign: TextAlign.right,
            style: TextStyle(
              color: leftTeamColor,
              fontSize: 20,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        Text(
          ':',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w500,
            color: Colors.grey,
          ),
        ),
        SizedBox(
          width: 40,
          child: Text(
            textAlign: TextAlign.left,
            rightTeamScore.toString(),
            style: TextStyle(
              color: rightTeamColor,
              fontSize: 20,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }
}

class TeamInfo extends StatelessWidget {
  const TeamInfo({
    super.key,
    required this.teamIcon,
    required this.teamName,
    required this.standings,
  });

  final Widget teamIcon;
  final String teamName;
  final String standings;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 56,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ConstrainedBox(
            constraints: BoxConstraints(maxHeight: 50, maxWidth: 50),
            child: teamIcon,
          ),
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: Text(teamName, style: TextStyle(fontSize: 12)),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text(
              standings,
              style: TextStyle(fontSize: 10, color: Colors.grey),
            ),
          ),
        ],
      ),
    );
    ;
  }
}

class GameInfoLayout extends StatelessWidget {
  const GameInfoLayout({
    super.key,
    required this.startTimeStr,
    this.score,
    required this.fieldName,
    this.statusTag,
    this.hiddenOnTap,
  });

  final String startTimeStr;
  final String fieldName;
  final Score? score;
  final GameStatusTag? statusTag;
  final GestureTapCallback? hiddenOnTap;

  @override
  Widget build(BuildContext context) {
    final field = Text(
      fieldName,
      style: TextStyle(
        fontSize: 14,
        decorationStyle: TextDecorationStyle.solid,
        decoration: TextDecoration.underline,
        decorationThickness: 1,
      ),
    );

    final startTime = GestureDetector(
      onTap: hiddenOnTap,
      child: Text(startTimeStr, style: TextStyle(fontSize: 12)),
    );

    if (statusTag == null && score == null) {
      return SizedBox(
        height: double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [field, startTime],
        ),
      );
    }

    if (score == null) {
      return Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 12, top: 14),
            child: statusTag,
          ),
          field,
          startTime,
        ],
      );
    }

    return Column(
      children: [
        Padding(padding: const EdgeInsets.only(bottom: 6), child: statusTag),
        Padding(padding: const EdgeInsets.only(bottom: 10), child: score!),
        field,
        startTime,
      ],
    );
  }
}

class _Duel extends StatelessWidget {
  const _Duel({
    required this.serialNo,
    required this.result,
    required this.isPlayBall,
    required this.fieldName,
    required this.startDatetime,
    required this.year,
    required this.leftTeamName,
    required this.gameKindCodeValue,
    required this.leftTeamColor,
    required this.rightTeamColor,
    required this.rightTeamName,
    required this.leftTeamIcon,
    required this.rightTeamIcon,
    required this.leftTeamScore,
    required this.rightTeamScore,
  });

  final bool isPlayBall;
  final Color leftTeamColor;
  final Color rightTeamColor;
  final DateTime startDatetime;
  final GameResult result;
  final int serialNo;
  final int leftTeamScore;
  final int rightTeamScore;
  final String year;
  final String fieldName;
  final String gameKindCodeValue;
  final String leftTeamName;
  final String rightTeamName;
  final Widget leftTeamIcon;
  final Widget rightTeamIcon;

  @override
  Widget build(BuildContext context) {
    final browser = InAppBrowser();
    final url =
        'https://www.cpbl.com.tw/box?year=${year}&kindCode=${gameKindCodeValue}&gameSno=${serialNo.toString()}';

    openGameWeb() {
      browser.openUrl(url);
    }

    final startTimeStr = toH_MM(startDatetime);

    final teamLeft = TeamInfo(
      teamIcon: leftTeamIcon,
      teamName: leftTeamName,
      standings: '',
    );

    final teamRight = TeamInfo(
      teamIcon: rightTeamIcon,
      teamName: rightTeamName,
      standings: '',
    );

    final gameInfo = byGameStatus(
      result,
      isPlayBall,
      inProgress: GameInfoLayout(
        hiddenOnTap: openGameWeb,
        fieldName: fieldName,
        statusTag: GameStatusTag.inProgress(),
        startTimeStr: startTimeStr,
        score: Score(
          leftTeamColor: leftTeamColor,
          rightTeamColor: rightTeamColor,
          leftTeamScore: leftTeamScore,
          rightTeamScore: rightTeamScore,
        ),
      ),
      postponed: GameInfoLayout(
        hiddenOnTap: openGameWeb,
        fieldName: fieldName,
        statusTag: GameStatusTag.postponed(),
        startTimeStr: startTimeStr,
      ),
      pending: GameInfoLayout(
        hiddenOnTap: openGameWeb,
        fieldName: fieldName,
        startTimeStr: startTimeStr,
      ),
      suspended: GameInfoLayout(
        hiddenOnTap: openGameWeb,
        fieldName: fieldName,
        statusTag: GameStatusTag.suspended(),
        startTimeStr: startTimeStr,
        score: Score(
          leftTeamColor: leftTeamColor,
          rightTeamColor: rightTeamColor,
          leftTeamScore: leftTeamScore,
          rightTeamScore: rightTeamScore,
        ),
      ),
      ended: GameInfoLayout(
        hiddenOnTap: openGameWeb,
        fieldName: fieldName,
        statusTag: GameStatusTag.ended(),
        startTimeStr: startTimeStr,
        score: Score(
          leftTeamColor: leftTeamColor,
          rightTeamColor: rightTeamColor,
          leftTeamScore: leftTeamScore,
          rightTeamScore: rightTeamScore,
        ),
      ),
    );

    return Container(
      clipBehavior: Clip.antiAlias,
      height: 150,
      decoration: BoxDecoration(
        borderRadius: BorderRadiusGeometry.all(Radius.circular(15)),
        color: Colors.white,
        boxShadow: [
          BoxShadow(color: Colors.black38, offset: Offset(0, 4), blurRadius: 3),
        ],
      ),
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 18, horizontal: 30),
        decoration: BoxDecoration(
          border: BoxBorder.fromLTRB(
            left: BorderSide(color: leftTeamColor, width: 5),
            right: BorderSide(color: rightTeamColor, width: 5),
          ),
        ),
        child: Row(
          spacing: 8,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [teamLeft, gameInfo, teamRight],
        ),
      ),
    );
  }
}

class Duel extends HookConsumerWidget {
  const Duel({super.key, required this.playId});

  final String playId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final (playStatus, play, _) = resolveAsyncValue(
      ref.watch(getPlayProvider(playId)),
    );

    final (teamInfoMapStatus, teamInfoMap, _) = resolveAsyncValue(
      ref.watch(teamInfoMapProvider),
    );
    final (fieldInfoMapStatus, fieldInfoMap, _) = resolveAsyncValue(
      ref.watch(fieldInfoMapProvider),
    );

    if (play != null && teamInfoMap != null && fieldInfoMap != null) {
      final homeTeam = teamInfoMap[play.game.homeTeamCode]!;
      final visitingTeam = teamInfoMap[play.game.visitingTeamCode]!;
      final field = fieldInfoMap[play.field]!;

      return _Duel(
        isPlayBall: play.isPlayBall,
        year: play.game.year,
        serialNo: play.game.seriesNo,
        leftTeamName: visitingTeam.name,
        gameKindCodeValue: play.game.kind.value,
        result: play.result,
        startDatetime: play.startDatetime,
        rightTeamName: homeTeam.name,
        leftTeamColor: fromRGBHex(visitingTeam.theme.primaryColor),
        rightTeamColor: fromRGBHex(homeTeam.theme.primaryColor),
        fieldName: field.name,
        leftTeamIcon: SvgPicture.asset(visitingTeam.assets.simplifyIconPath),
        rightTeamIcon: SvgPicture.asset(homeTeam.assets.simplifyIconPath),
        leftTeamScore: play.visitingScore,
        rightTeamScore: play.homeScore,
      );
    }

    if (playStatus == QueryStatus.loading ||
        teamInfoMapStatus == QueryStatus.loading ||
        fieldInfoMapStatus == QueryStatus.loading) {
      return Center(child: CircularProgressIndicator.adaptive());
    }

    return NotFoundScreen();
  }
}
