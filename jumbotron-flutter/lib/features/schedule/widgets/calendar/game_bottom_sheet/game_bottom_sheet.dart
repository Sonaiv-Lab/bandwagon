import 'package:bandwagon/shared/constants/game.dart';
import 'package:bandwagon/shared/utils/time.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'bottom_sheet_chip.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:bandwagon/shared/data/team_info_map.dart';

class GameItem extends StatelessWidget {
  const GameItem({
    super.key,
    required this.onGameItemTap,
    required this.gameNo,
    required this.fieldName,
    required this.startAt,
    required this.leftColorHex,
    required this.leftTeamName,
    required this.leftScore,
    required this.rightColorHex,
    required this.rightTeamName,
    required this.rightScore,
    required this.result,
    required this.startDatetime,
  });

  final void Function() onGameItemTap;
  final String gameNo;
  final String fieldName;
  final String startAt;
  final int leftScore;
  final String leftColorHex;
  final String leftTeamName;
  final String rightColorHex;
  final int rightScore;
  final String rightTeamName;
  final GameResult result;
  final DateTime startDatetime;

  @override
  Widget build(BuildContext context) {
    final BottomSheetChip chip = switch (result) {
      GameResult.pending when DateTime.now().isAfter(startDatetime) =>
        OngoingBottomSheetChip(
          leftColorHex: leftColorHex,
          rightColorHex: rightColorHex,
          leftTeamName: leftTeamName,
          rightTeamName: rightTeamName,
          leftScore: leftScore,
          rightScore: rightScore,
        ),
      GameResult.pending => PendingBottomSheepChip(
        leftColorHex: leftColorHex,
        rightColorHex: rightColorHex,
        leftTeamName: leftTeamName,
        rightTeamName: rightTeamName,
      ),
      GameResult.ended => EndedBottomSheetChip(
        leftScore: leftScore,
        leftColorHex: leftColorHex,
        rightScore: rightScore,
        rightColorHex: rightColorHex,
        leftTeamName: leftTeamName,
        rightTeamName: rightTeamName,
      ),
      _ => EndedBottomSheetChip(
        leftScore: leftScore,
        leftColorHex: leftColorHex,
        rightScore: rightScore,
        rightColorHex: rightColorHex,
        leftTeamName: leftTeamName,
        rightTeamName: rightTeamName,
      ),
    };

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
                crossAxisAlignment: CrossAxisAlignment.center,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 0),
                    child: Text(gameNo),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(right: 20),
                    child: Text('$fieldName $startAt'),
                  ),
                  Icon(Icons.chevron_right),
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
