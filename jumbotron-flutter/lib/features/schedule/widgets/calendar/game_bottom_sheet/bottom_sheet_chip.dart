import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class BottomSheetChip extends StatelessWidget {
  const BottomSheetChip({
    super.key,
    required this.leftColorHex,
    required this.rightColorHex,
    required this.leftTeamName,
    required this.rightTeamName,
  });

  final String leftColorHex;
  final String rightColorHex;
  final String leftTeamName;
  final String rightTeamName;

  final double textSpacing = 10;
  

  String get leftPart {
    return '''
      <path d="M186.376 18.8729H168.326L176.366 43.4068H6.01662C2.69374 43.4068 1.61516e-07 40.7168 0 37.3985V6.35554C1.61515e-07 3.03724 2.69373 0.347229 6.01662 0.347229H180.305L186.376 18.8729Z" fill="$leftColorHex" />
    ''';
  }

  String get rightPart {
    return '''
      <path d="M355.983 0.347229C359.306 0.347233 362 3.03724 362 6.35554V37.3985C362 40.7168 359.306 43.4068 355.983 43.4068H182.698L176.627 24.8812H194.676L186.637 0.347229H355.983Z" fill="$rightColorHex"/>
    ''';
  }

  String get svgString {
    return '''
      <svg width="100%" height="44" viewBox="0 0 362 44">$leftPart$rightPart</svg>
    ''';
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 44,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // 要撐開
          SizedBox.expand(
            child: SvgPicture.string(svgString, fit: BoxFit.fitWidth),
          ),
          Positioned(
            left: textSpacing,
            child: Text(
              leftTeamName,
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Positioned(
            right: textSpacing,
            child: Text(
              rightTeamName,
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
