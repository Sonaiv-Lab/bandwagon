import 'package:bandwagon/shared/utils/by_platform.dart';
import 'package:flutter/material.dart';
import 'game_bottom_sheet/game_bottom_sheet.dart';
import 'game_chips.dart';

class CalendarDate extends StatelessWidget {
  const CalendarDate({
    super.key,
    required this.chips,
    required this.dateLabel,
    required this.onDateTap,
    required this.isDateLabelUnderlined,
    required this.isDateLabelColorDim,
  });

  final List<GameChip> chips;
  final String dateLabel;
  final void Function() onDateTap;
  final bool isDateLabelUnderlined;
  final bool isDateLabelColorDim;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      // color: scheme.surfaceContainerLow,
      child: InkWell(
        onTap: chips.isNotEmpty ? onDateTap : null,
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 1),
          child: Column(
            spacing: 1,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.only(bottom: 1.5, top: 1, left: 1),
                child: Stack(
                  children: [
                    Container(
                      padding: EdgeInsets.only(bottom: 0),
                      decoration: BoxDecoration(
                        border: Border(
                          bottom: BorderSide(
                            color: isDateLabelUnderlined
                                ? scheme.primary
                                : Colors.transparent,
                            width: 3,
                          ),
                        ),
                      ),
                      child: Text(
                        dateLabel,
                        style: TextStyle(
                          shadows: [
                            Shadow(
                              color: isDateLabelColorDim
                                  ? Color.fromRGBO(256, 256, 256, 0.3)
                                  : Colors.black,
                              offset: Offset(
                                0,
                                byPlatform<double>(ios: 2.0, android: 1.0),
                              ),
                            ),
                          ],
                          fontSize: 11,
                          color: Colors.transparent,
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
