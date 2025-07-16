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
    required this.rightColorHex,
    required this.rightTeamName,
  });

  final void Function() onGameItemTap;
  final String gameNo;
  final String fieldName;
  final String startAt;
  final String leftColorHex;
  final String leftTeamName;
  final String rightColorHex;
  final String rightTeamName;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(
            width: 1,
            color: Theme.of(context).colorScheme.onSurface,
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
              BottomSheetChip(
                leftColorHex: leftColorHex,
                rightColorHex: rightColorHex,
                leftTeamName: leftTeamName,
                rightTeamName: rightTeamName,
              ),
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
          child: Text(
            toYYYY_MM_DD__EEE(date),
            style: TextStyle(fontSize: 16),
          ),
        ),
        ...gameItems,
      ],
    );
  }
}
