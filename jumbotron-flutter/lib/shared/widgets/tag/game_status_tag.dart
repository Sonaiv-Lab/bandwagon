import 'package:bandwagon/shared/widgets/empty_widget.dart';
import 'package:flutter/material.dart';

import 'tag.dart';

class GameStatusTag extends StatelessWidget {
  const GameStatusTag({super.key, required this.text, required this.color});

  final String text;
  final Color color;

  const GameStatusTag.inProgress() : text = '進行中', color = Colors.redAccent;

  const GameStatusTag.postponed() : text = '延賽', color = Colors.indigo;

  const GameStatusTag.suspended() : text = '保留', color = Colors.orangeAccent;

  const GameStatusTag.ended() : text = '已結束', color = Colors.teal;

  @override
  Widget build(BuildContext context) {
    return Tag(text: text, color: color);
  }
}
