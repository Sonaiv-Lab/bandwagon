import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class Duel extends StatelessWidget {
  const Duel({super.key});

  @override
  Widget build(BuildContext context) {
    const String assetName = 'assets/icons/simplify-icon-brother.svg';

    final team = Column(
      mainAxisSize: MainAxisSize.min,
      spacing: 6,
      children: [
        SvgPicture.asset(assetName, width: 60, height: 60),
        Text('味全龍', style: TextStyle(fontSize: 16)),
      ],
    );

    return Container(
      // padding: EdgeInsets.symmetric(vertical: 20, horizontal: 26),
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        borderRadius: BorderRadiusGeometry.all(Radius.circular(15)),
        color: Colors.white,
        boxShadow: [
          BoxShadow(color: Colors.black38, offset: Offset(0, 4), blurRadius: 3),
        ],
      ),
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 20, horizontal: 20),
        decoration: BoxDecoration(
          border: BoxBorder.fromLTRB(
            left: BorderSide(color: Colors.teal, width: 5),
            right: BorderSide(color: Colors.yellowAccent, width: 5),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            team,
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('18:36'),
                Text('雲林棒球場'),
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text('vs'),
                ),
              ],
            ),
            team,
          ],
        ),
      ),
    );
  }
}
