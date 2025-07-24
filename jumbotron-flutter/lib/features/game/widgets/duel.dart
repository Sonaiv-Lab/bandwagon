import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class Duel extends StatelessWidget {
  const Duel({
    super.key,
    required this.fieldName,
    required this.leftTeamName,
    required this.leftTeamColor,
    required this.rightTeamColor,
    required this.rightTeamName,
    required this.startTimeStr,
    required this.leftTeamIcon,
    required this.rightTeamIcon,
  });

  final String leftTeamName;
  final Color leftTeamColor;
  final Color rightTeamColor;
  final String rightTeamName;
  final String fieldName;
  final String startTimeStr;
  final Widget leftTeamIcon;
  final Widget rightTeamIcon;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final teamLeft = Column(
      mainAxisSize: MainAxisSize.min,
      spacing: 6,
      children: [
        ConstrainedBox(
          constraints: BoxConstraints(maxHeight: 60, maxWidth: 60),
          child: leftTeamIcon,
        ),
        Text(leftTeamName, style: TextStyle(fontSize: 16)),
      ],
    );

    final teamRight = Column(
      mainAxisSize: MainAxisSize.min,
      spacing: 6,
      children: [
        ConstrainedBox(
          constraints: BoxConstraints(maxHeight: 60, maxWidth: 60),
          child: rightTeamIcon,
        ),
        Text(rightTeamName, style: TextStyle(fontSize: 16)),
      ],
    );

    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        borderRadius: BorderRadiusGeometry.all(Radius.circular(20)),
        color: Colors.white,
        boxShadow: [
          BoxShadow(color: Colors.black38, offset: Offset(0, 4), blurRadius: 3),
        ],
      ),
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 12, horizontal: 24),
        decoration: BoxDecoration(
          border: BoxBorder.fromLTRB(
            left: BorderSide(color: leftTeamColor, width: 5),
            right: BorderSide(color: rightTeamColor, width: 5),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            teamLeft,
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(startTimeStr, style: TextStyle(fontSize: 12)),
                Text(fieldName, style: TextStyle(fontSize: 15)),
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text('vs', style: TextStyle(fontSize: 12)),
                ),
              ],
            ),
            teamRight,
          ],
        ),
      ),
    );
  }
}
