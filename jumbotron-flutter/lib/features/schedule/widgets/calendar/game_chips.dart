import 'dart:ui';

import 'package:bandwagon/shared/utils/by_platform.dart';
import 'package:bandwagon/shared/utils/calc_by_scores.dart';
import 'package:bandwagon/shared/utils/inverse_lerp.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class WithLabel extends StatelessWidget {
  const WithLabel({
    super.key,
    required this.chipSvg,
    required this.leftText,
    required this.rightText,
  });

  final SvgPicture chipSvg;
  final String leftText;
  final String rightText;
  final double textSpacing = 2;

  Text scoreLabel(String text) {
    return Text(
      text,
      style: TextStyle(
        color: Colors.white,
        fontSize: 10,
        fontWeight: FontWeight.w700,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        chipSvg,
        Positioned(
          left: textSpacing,
          child: scoreLabel(leftText),
        ),
        Positioned(
          right: textSpacing,
          child: scoreLabel(rightText),
        ),
      ],
    );
    ;
  }
}

abstract class GameChip extends StatelessWidget {
  const GameChip({super.key});

  String get leftPart;
  String get rightPart;
  String get svgString;
}

class EndedGameChip extends GameChip {
  EndedGameChip({
    super.key,
    required this.leftColorHex,
    required this.rightColorHex,
    required this.leftScore,
    required this.rightScore,
  }) {
    final (l, r) = sidesXCoord(leftScore, rightScore);

    leftSideXCoord = l;
    rightSideXCoord = r;
  }

  final int leftScore;
  final int rightScore;
  final String leftColorHex;
  final String rightColorHex;

  late final double leftSideXCoord;
  late final double rightSideXCoord;

  final double textSpacing = 2;
  final double gapSize = 3;

  (double, double) sidesXCoord(int leftScore, int rightScore) {
    final double minSeparatorXCoord = 14.5;
    final double maxSeparatorXCoord = 40.5;


    final ratio = calcRatioByScores(
      leftScore: leftScore,
      rightScore: rightScore,
    );

    final separatorXCoord = lerpDouble(
      minSeparatorXCoord,
      maxSeparatorXCoord,
      ratio,
    )!;

    return (separatorXCoord - (gapSize / 2), separatorXCoord + (gapSize / 2));
  }

  @override
  String get leftPart {
    final double min = 13;
    final double max = 39;

    double value = leftSideXCoord;

    if (value > max) value = max;
    if (value < min) value = min;
    return '''
      <path d="M2 15 H$value V0 H2 C1 0 0 0.9 0 2 V10 C0 11 1 12 2 12Z" fill="$leftColorHex" />
    ''';
  }

  @override
  String get rightPart {
    final double min = 16;
    final double max = 42;

    double value = rightSideXCoord;

    if (value > max) value = max;
    if (value < min) value = min;

    // M53 0 C54.1046 0 55 0.895431 55 2 V10C55 11.1046 54.1046 12 53 12H29.2041V0H53Z
    return '''
      <path d="M53 0 C54 0 55 0.9 55 2 V10 C55 11 54 12 53 12 H$value V0 H53Z" fill="$rightColorHex"/>
    ''';
  }

  @override
  String get svgString {
    return '''
      <svg height="12" width="55" viewBox="0 0 55 12">$leftPart$rightPart</svg>
    ''';
  }

  Text scoreLabel(String text) {
    return Text(
      text,
      style: TextStyle(
        color: Colors.white,
        fontSize: 10,
        fontWeight: FontWeight.w700,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return WithLabel(
      chipSvg: SvgPicture.string(
        svgString,
        height: 12,
        width: 55,
        fit: BoxFit.fill,
      ),
      leftText: leftScore.toString(),
      rightText: rightScore.toString(),
    );
  }
}

class PendingGameChip extends GameChip {
  const PendingGameChip({
    super.key,
    required this.leftColorHex,
    required this.rightColorHex,
  });

  final String leftColorHex;
  final String rightColorHex;

  @override
  String get leftPart {
    return '''
      <path d="M 2 0 H 27.8223L 24.6074 12H 2C0.895431 12 0 11.1046 0 10V 2C0 0.895431 0.895431 0 2 0Z" fill="$leftColorHex" />
    ''';
  }

  @override
  String get rightPart {
    return '''
      <path d=" M53 0C54.1045 0 55 0.895431 55 2V10C55 11.1046 54.1046 12 53 12H27.7129L30.9277 0H53Z" fill="$rightColorHex"/>
    ''';
  }

  @override
  String get svgString {
    return '''
      <svg height="12" width="55" viewBox="0 0 55 12">$leftPart$rightPart</svg>
    ''';
  }

  @override
  Widget build(BuildContext context) {
    return SvgPicture.string(
      svgString,
      height: 12,
      width: 55,
      fit: BoxFit.fill,
    );
  }
}

class OngoingGameChip extends GameChip {
  const OngoingGameChip({
    super.key,
    required this.leftColorHex,
    required this.rightColorHex,
    required this.leftScore,
    required this.rightScore,
  });

  final int leftScore;
  final int rightScore;
  final String leftColorHex;
  final String rightColorHex;

  @override
  String get leftPart {
    return '''
      <path d="M25.3545 0H2C0.895431 0 0 0.895431 0 2V10C0 11.1046 0.895431 12 2 12H22.1387L23.2959 7.68066L24.084 4.73828L27.1182 5.00391L27.9922 5.08105L29.3545 0H28.46H25.3545Z" fill="$leftColorHex" />
    ''';
  }

  @override
  String get rightPart {
    return '''
      <path d="M30.2383 8.28809L27.2041 8.02344L26.3301 7.94629L25.2441 12H26.1387H29.2441H53C54.1046 12 55 11.1046 55 10V2C55 0.895431 54.1046 0 53 0H32.46L31.0264 5.34668L30.2383 8.28809Z" fill="$rightColorHex"/>
    ''';
  }

  @override
  String get svgString {
    return '''
      <svg height="12" width="55" viewBox="0 0 55 12">$leftPart$rightPart</svg>
    ''';
  }

  @override
  Widget build(BuildContext context) {
    return WithLabel(
      chipSvg: SvgPicture.string(
        svgString,
        height: 12,
        width: 55,
        fit: BoxFit.fill,
      ),
      leftText: leftScore.toString(),
      rightText: rightScore.toString(),
    );
  }
}
