import 'package:flutter/material.dart';

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