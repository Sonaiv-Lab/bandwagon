import 'package:bandwagon/shared/data/team_info_map.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'game_chip.dart';
import 'game_bottom_sheet/game_bottom_sheet.dart';

// TODO 這裡串 API 之後就不這樣拿了，這裡可以變得更 functional？
class CalendarDate extends StatelessWidget {
  const CalendarDate({super.key, required this.chips, required this.dateLabel});

  final List<GameChip> chips;
  final String dateLabel;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        showModalBottomSheet(
          constraints: const BoxConstraints(minWidth: double.infinity),
          showDragHandle: true,
          context: context,
          builder: (_) {
            return DetailModalBottomSheet(
              gameItems: [
                GameItem(
                  onGameItemTap: () {
                    GoRouter.of(context).push('/game/123123');
                  },
                ),
                GameItem(onGameItemTap: () {}),
                GameItem(onGameItemTap: () {}),
              ],
            );
          },
        );
      },
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 2),

        child: Column(
          spacing: 1,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(dateLabel),
            Column(spacing: 4, children: chips),
          ],
        ),
      ),
    );
  }
}

class CalendarRow extends StatelessWidget {
  const CalendarRow({
    super.key,
    required this.children,
    this.isLastRow = false,
    this.isExpanded = true,
  });

  final List<Widget> children;
  final bool isLastRow;
  final bool isExpanded;

  static const columnCount = 7;

  @override
  Widget build(BuildContext context) {
    assert(
      children.length == columnCount,
      'Always $columnCount cell in a week row',
    );

    final border = BorderSide(color: Theme.of(context).colorScheme.onSurface);

    final cells = [
      for (var i = 0; i < columnCount; i++)
        Expanded(
          child: Container(
            decoration: BoxDecoration(
              border: Border(
                bottom: isLastRow ? BorderSide.none : border,
                left: i == 0 ? BorderSide.none : border,
              ),
            ),
            child: children[i],
          ),
        ),
    ];

    final row = Row(
      crossAxisAlignment: isExpanded
          ? CrossAxisAlignment.stretch
          : CrossAxisAlignment.start,
      children: cells,
    );

    return isExpanded ? Expanded(child: row) : row;
  }
}

class Calendar extends HookConsumerWidget {
  const Calendar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final teamInfoMap = ref.watch(teamInfoMapProvider);

    // TODD error handling, Loading state
    return teamInfoMap.when(
      error: (_, _) => Text('gg'),
      loading: () => Text('gg'),
      data: (teamInfoMap) {
        return Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: List.generate(
              6,
              (int i) => CalendarRow(
                isExpanded: true,
                isLastRow: i >= 5,
                children: List.filled(
                  7,
                  CalendarDate(
                    dateLabel: '1',
                    chips: [
                      GameChip(
                        leftColorHex: teamInfoMap['AKP011']!.theme.primaryColor,
                        rightColorHex:
                            teamInfoMap['AEO011']!.theme.primaryColor,
                      ),
                      GameChip(
                        leftColorHex: teamInfoMap['AJL011']!.theme.primaryColor,
                        rightColorHex:
                            teamInfoMap['AAA011']!.theme.primaryColor,
                      ),
                      GameChip(
                        leftColorHex: teamInfoMap['ACN011']!.theme.primaryColor,
                        rightColorHex:
                            teamInfoMap['ADD011']!.theme.primaryColor,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
