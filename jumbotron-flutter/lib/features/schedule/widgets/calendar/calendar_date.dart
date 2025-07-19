import 'package:flutter/material.dart';
import 'game_bottom_sheet/game_bottom_sheet.dart';
import 'game_chip.dart';

class CalendarDate extends StatelessWidget {
  const CalendarDate({
    super.key,
    required this.chips,
    required this.dateLabel,
    required this.onDateTap,
    required this.isDateLabelHighlight,
  });

  final List<GameChip> chips;
  final String dateLabel;
  final void Function() onDateTap;
  final bool isDateLabelHighlight;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return InkWell(
      onTap: chips.isNotEmpty ? onDateTap : null,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 2),
        child: Column(
          spacing: 1,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(bottom: 0.5, top: 1.5),
              child: Stack(
                children: [
                  Container(
                    child: Text(
                      dateLabel,
                      style: TextStyle(
                        fontSize: 11,
                        decoration: isDateLabelHighlight
                            ? TextDecoration.underline
                            : null,
                        decorationStyle: TextDecorationStyle.solid,
                        decorationThickness: 2,
                        decorationColor: scheme.primary
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Column(spacing: 4, children: chips),
          ],
        ),
      ),
    );
  }
}

void showDateDetailModal({
  required List<GameItem> items,
  required BuildContext context,
  required DateTime date,
}) {
  showModalBottomSheet(
    constraints: const BoxConstraints(minWidth: double.infinity),
    showDragHandle: true,
    context: context,
    builder: (_) {
      return DetailModalBottomSheet(gameItems: items, date: date);
    },
  );
}
