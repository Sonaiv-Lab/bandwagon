import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class GameChip extends StatelessWidget {
  const GameChip({
    super.key,
    required this.leftColorHex,
    required this.rightColorHex,
  });

  final String leftColorHex;
  final String rightColorHex;

  String get leftPart {
    return '''
      <path d="M20.0195 12H2.42856C1.32401 12 0.428591 11.1045 0.428558 10V2C0.428558 0.895431 1.32399 1.61069e-08 2.42856 0H31.5195L25.7695 6L20.0195 12Z" fill="$leftColorHex" />
    ''';
  }

  String get rightPart {
    return '''
      <path d="M52.4286 0C53.5331 0 54.4286 0.895431 54.4286 2V10C54.4285 11.1045 53.5331 12 52.4286 12H25.5L31.2495 6L36.999 0H52.4286Z" fill="$rightColorHex"/>
    ''';
  }

  String get svgString {
    return '''
      <svg height="12" width="55" viewBox="0 0 55 12">$leftPart$rightPart</svg>
    ''';
  }

  @override
  Widget build(BuildContext context) {
    return SvgPicture.string(svgString);
  }
}
