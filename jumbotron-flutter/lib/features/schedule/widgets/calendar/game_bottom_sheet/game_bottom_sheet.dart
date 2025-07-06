import 'package:flutter/material.dart';
import 'bottom_sheet_chip.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:bandwagon/shared/data/team_info_map.dart';

class GameItem extends HookConsumerWidget {
  const GameItem({super.key, required this.onGameItemTap});

  final void Function() onGameItemTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamInfoMap = ref.watch(teamInfoMapProvider);

    // TODD error handling, Loading state
    return teamInfoMap.when(
      error: (_, _) => Text('gg'),
      loading: () => Text('gg'),
      data: (teamInfoMap) {
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
                        child: Text('No.196'),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(right: 20),
                        child: Text('台中洲際棒球場 18:35'),
                      ),
                      Icon(Icons.chevron_right),
                    ],
                  ),
                  BottomSheetChip(
                    leftColorHex: teamInfoMap['AKP011']!.theme.primaryColor,
                    rightColorHex: teamInfoMap['AEO011']!.theme.primaryColor,
                    leftTeamName: teamInfoMap['AKP011']!.name,
                    rightTeamName: teamInfoMap['AEO011']!.name,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class DetailModalBottomSheet extends StatelessWidget {
  const DetailModalBottomSheet({super.key, required this.gameItems});

  final List<GameItem> gameItems;

  @override
  Widget build(BuildContext context) {
    final borderColor = Theme.of(context).dividerColor;
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.only(bottom: 6),
          child: Text('2025/07/11 星期五', style: TextStyle(fontSize: 16),),
        ),
        ...gameItems,
      ],
    );
  }
}
