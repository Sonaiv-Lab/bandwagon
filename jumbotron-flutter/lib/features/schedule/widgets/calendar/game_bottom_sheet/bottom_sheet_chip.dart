import 'dart:ui';

import 'package:bandwagon/shared/utils/calc_by_scores.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class WithLabel extends StatelessWidget {
  const WithLabel({
    super.key,
    required this.graph,
    required this.leftText,
    required this.rightText,
    this.centerLeftText,
    this.centerRightText,
    this.separatorRatio,
    this.centerTextSpacing = 10,
  });

  final Widget graph;
  final String leftText;
  final String rightText;
  final double textSpacing = 10;
  final double? separatorRatio;
  final String? centerLeftText;
  final String? centerRightText;
  final double? centerTextSpacing;

  Text teamLabel(String text) {
    return Text(
      text,
      style: TextStyle(
        color: Colors.white,
        fontSize: 12,
        fontWeight: FontWeight.w700,
      ),
    );
  }

  Text scoreLabel(String text, {TextAlign textAlign = TextAlign.left}) {
    return Text(
      text,
      textAlign: textAlign,
      style: TextStyle(
        color: Colors.white,
        fontSize: 16,
        fontWeight: FontWeight.w700,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraint) {
        final w = constraint.maxWidth;

        final children = [
          graph,
          Positioned(left: textSpacing, child: teamLabel(leftText)),
          Positioned(right: textSpacing, child: teamLabel(rightText)),
        ];

        if (centerLeftText != null && separatorRatio != null) {
          // 左邊的字，要從右邊定位，才不用算字本身的寬度
          final separatorXCoord =
              w * (1 - separatorRatio!) + (centerTextSpacing ?? textSpacing);
          children.add(
            Positioned(
              right: separatorXCoord,
              child: scoreLabel(centerLeftText!, textAlign: TextAlign.left),
            ),
          );
        }
        if (centerRightText != null && separatorRatio != null) {
          // 右邊的字，要從左邊定位，才不用算字本身的寬度
          final separatorXCoord =
              w * separatorRatio! + (centerTextSpacing ?? textSpacing);
          children.add(
            Positioned(
              left: separatorXCoord,
              child: scoreLabel(centerRightText!, textAlign: TextAlign.right),
            ),
          );
        }
        return Stack(alignment: Alignment.center, children: children);
      },
    );
  }
}

abstract class BottomSheetChip extends StatelessWidget {
  const BottomSheetChip({super.key});

  String get leftPart;
  String get rightPart;
  String get svgString;
}

class EndedBottomSheetChip extends BottomSheetChip {
  EndedBottomSheetChip({
    super.key,
    required this.leftColorHex,
    required this.rightColorHex,
    required this.leftTeamName,
    required this.rightTeamName,
    required this.leftScore,
    required this.rightScore,
  }) {
    final minWidth = 95;
    final double minSeparatorXCoord = minWidth + (gapSize / 2);
    final double maxSeparatorXCoord = svgWidth - minWidth - (gapSize / 2);

    final ratio = calcRatioByScores(
      leftScore: leftScore,
      rightScore: rightScore,
    );

    final separator = lerpDouble(
      minSeparatorXCoord,
      maxSeparatorXCoord,
      ratio,
    )!;

    leftSideXCoord = separator - (gapSize / 2);
    rightSideXCoord = separator + (gapSize / 2);
    separatorXCoord = separator;
    separatorRatio = separator / svgWidth;
  }

  final int leftScore;
  final int rightScore;
  final String leftColorHex;
  final String rightColorHex;
  final String leftTeamName;
  final String rightTeamName;

  late final double separatorRatio;
  late final double leftSideXCoord;
  late final double rightSideXCoord;
  late final double separatorXCoord;

  final double gapSize = 6;
  // its the width in svg, not real width. real width would be responsive by device
  final double svgWidth = 320;

  @override
  String get leftPart {
    return '''
      <path d="M$leftSideXCoord 31 H5.98131 C2.67792 31 0 28.3137 0 25 V6 C0 2.68629 2.67792 0 5.98131 0 H$leftSideXCoord V31 Z" fill="$leftColorHex" />
    ''';
  }

  @override
  String get rightPart {
    return '''
      <path d="M314.019 0 C317.322 0 320 2.68629 320 6 V25 C320 28.3137 317.322 31 314.019 31 H$rightSideXCoord V0 H314.019Z" fill="$rightColorHex"/>
    ''';
  }

  @override
  String get svgString {
    return '''
      <svg width="100%" height="31" viewBox="0 0 320 31">$leftPart$rightPart</svg>
    ''';
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 31,
      child: WithLabel(
        graph: SizedBox.expand(
          child: SvgPicture.string(svgString, fit: BoxFit.fitWidth),
        ),
        leftText: leftTeamName,
        rightText: rightTeamName,
        centerLeftText: leftScore.toString(),
        centerRightText: rightScore.toString(),
        separatorRatio: separatorRatio,
      ),
    );
  }
}

class PendingBottomSheepChip extends BottomSheetChip {
  const PendingBottomSheepChip({
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

  @override
  String get leftPart {
    return '''
      <path d="M155.972 31H5.98131C2.67792 31 0 28.3137 0 25V6C0 2.68629 2.67792 0 5.98131 0H164.252L155.972 31Z" fill="$leftColorHex" />
    ''';
  }

  @override
  String get rightPart {
    return '''
      <path d="M314.019 0C317.322 1.83613e-06 320 2.68629 320 6V25C320 28.3137 317.322 31 314.019 31H162.164L170.445 0H314.019Z" fill="$rightColorHex"/>
    ''';
  }

  @override
  String get svgString {
    return '''
      <svg width="100%" height="31" viewBox="0 0 320 31">$leftPart$rightPart</svg>
    ''';
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 31,
      child: WithLabel(
        graph: SizedBox.expand(
          child: SvgPicture.string(svgString, fit: BoxFit.fitWidth),
        ),
        leftText: leftTeamName,
        rightText: rightTeamName,
      ),
    );
  }
}

class OngoingBottomSheetChip extends BottomSheetChip {
  OngoingBottomSheetChip({
    super.key,
    required this.leftColorHex,
    required this.rightColorHex,
    required this.leftTeamName,
    required this.rightTeamName,
    required this.leftScore,
    required this.rightScore,
  }) {
    final minWidth = 95;
    final double minSeparatorXCoord = minWidth + (gapSize / 2);
    final double maxSeparatorXCoord = svgWidth - minWidth - (gapSize / 2);

    final ratio = 0.5;

    final separator = lerpDouble(
      minSeparatorXCoord,
      maxSeparatorXCoord,
      ratio,
    )!;

    separatorXCoord = separator;
    separatorRatio = separator / svgWidth;
  }

  final int leftScore;
  final int rightScore;
  final String leftColorHex;
  final String rightColorHex;
  final String leftTeamName;
  final String rightTeamName;

  late final double separatorRatio;
  late final double separatorXCoord;

  final double gapSize = 6;
  final double svgWidth = 320;

  @override
  String get leftPart {
    return '''
      <path d="M5.98131 0C2.67792 0 0 2.68629 0 6V25C0 28.3137 2.67792 31 5.98131 31H146.72L151.717 12.2891L162.988 13.2783L166.535 0H5.98131Z" fill="$leftColorHex" />
    ''';
  }

  @override
  String get rightPart {
    return '''
      <path d="M320 6C320 2.68629 317.322 0 314.019 0H172.727L167.466 19.6943L156.196 18.7051L152.913 31H314.019C317.322 31 320 28.3137 320 25V6Z" fill="$rightColorHex"/>
    ''';
  }

  @override
  String get svgString {
    return '''
      <svg width="100%" height="31" viewBox="0 0 320 31">$leftPart$rightPart</svg>
    ''';
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 31,
      child: WithLabel(
        graph: SizedBox.expand(
          child: SvgPicture.string(svgString, fit: BoxFit.fitWidth),
        ),
        leftText: leftTeamName,
        rightText: rightTeamName,
        centerLeftText: leftScore.toString(),
        centerRightText: rightScore.toString(),
        separatorRatio: separatorRatio,
        centerTextSpacing: 20,
      ),
    );
  }
}
