import 'package:bandwagon/shared/constants/game.dart';
import 'package:bandwagon/shared/utils/by_game_result.dart';
import 'package:bandwagon/shared/utils/time.dart';
import 'package:bandwagon/shared/widgets/tag/game_status_tag.dart';
import 'package:flutter/material.dart';
import 'bottom_sheet_chip.dart';

class GameItem extends StatelessWidget {
  const GameItem({
    super.key,
    required this.onGameItemTap,
    required this.gameNo,
    required this.fieldName,
    required this.startAt,
    required this.leftPrimaryColorHex,
    required this.leftSubtleColorHex,
    required this.leftTeamName,
    required this.leftScore,
    required this.rightPrimaryColorHex,
    required this.rightSubtleColorHex,
    required this.rightTeamName,
    required this.rightScore,
    required this.result,
    required this.startDatetime,
    required this.isPlayBall,
  });

  final void Function() onGameItemTap;
  final String gameNo;
  final String fieldName;
  final String startAt;
  final int leftScore;
  final String leftPrimaryColorHex;
  final String leftSubtleColorHex;
  final String leftTeamName;
  final String rightPrimaryColorHex;
  final String rightSubtleColorHex;
  final int rightScore;
  final String rightTeamName;
  final GameResult result;
  final DateTime startDatetime;
  final bool isPlayBall;

  @override
  Widget build(BuildContext context) {
    final BottomSheetChip chip = byGameStatus(
      result,
      DateTime.now().isAfter(startDatetime),
      inProgress: OngoingBottomSheetChip(
        leftColorHex: leftPrimaryColorHex,
        rightColorHex: rightPrimaryColorHex,
        leftTeamName: leftTeamName,
        rightTeamName: rightTeamName,
        leftScore: leftScore,
        rightScore: rightScore,
      ),
      pending: PendingBottomSheepChip(
        leftColorHex: leftPrimaryColorHex,
        rightColorHex: rightPrimaryColorHex,
        leftTeamName: leftTeamName,
        rightTeamName: rightTeamName,
      ),
      postponed: PendingBottomSheepChip(
        leftColorHex: leftSubtleColorHex,
        rightColorHex: rightSubtleColorHex,
        leftTeamName: leftTeamName,
        rightTeamName: rightTeamName,
      ),
      suspended: OngoingBottomSheetChip(
        leftColorHex: leftSubtleColorHex,
        rightColorHex: rightSubtleColorHex,
        leftTeamName: leftTeamName,
        rightTeamName: rightTeamName,
        leftScore: leftScore,
        rightScore: rightScore,
      ),
      ended: EndedBottomSheetChip(
        leftScore: leftScore,
        leftColorHex: leftPrimaryColorHex,
        rightScore: rightScore,
        rightColorHex: rightPrimaryColorHex,
        leftTeamName: leftTeamName,
        rightTeamName: rightTeamName,
      ),
    );

    final midText = byGameStatus(
      result,
      isPlayBall,
      inProgress: Row(
        spacing: 4,
        children: [
          Text('$fieldName $startAt'),
          GameStatusTag.inProgress(),
        ],
      ),
      pending: Row(children: [Text(fieldName)]),
      postponed: Row(
        spacing: 4,
        children: [
          Text(fieldName),
          GameStatusTag.postponed(),
        ],
      ),
      suspended: Row(
        spacing: 4,
        children: [
          Text(fieldName),
          GameStatusTag.suspended(),
        ],
      ),
      ended: Text(fieldName),
    );

    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(
            width: 1,
            color: Theme.of(context).colorScheme.surfaceDim,
          ),
        ),
      ),
      child: InkWell(
        onTap: onGameItemTap,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(18, 10, 18, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisAlignment: MainAxisAlignment.center,
            spacing: 6,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 0),
                    child: Text(gameNo, style: TextStyle(fontSize: 10)),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(right: 20),
                    child: midText,
                  ),
                  Transform.translate(
                    offset: Offset(0, 2),
                    child: Icon(Icons.chevron_right, size: 16),
                  ),
                ],
              ),
              chip,
            ],
          ),
        ),
      ),
    );
  }
}

class DetailModalBottomSheet extends StatelessWidget {
  const DetailModalBottomSheet({
    super.key,
    required this.gameItems,
    required this.date,
  });

  final List<GameItem> gameItems;
  final DateTime date;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.only(bottom: 6),
          child: Text(toYYYY_MM_DD__EEE(date), style: TextStyle(fontSize: 16)),
        ),
        ...gameItems,
      ],
    );
  }
}
