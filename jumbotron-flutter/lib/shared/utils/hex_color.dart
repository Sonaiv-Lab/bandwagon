import 'package:flutter/material.dart';

Color fromRGBHex(String hexString) {
  final buffer = StringBuffer();

  if (hexString.length == 7 && hexString.startsWith('#')) buffer.write('ff');
  buffer.write(hexString.replaceFirst('#', ''));

  return Color(int.parse(buffer.toString(), radix: 16));
}

Color fromRGBAHex(String hexString) {
  final buffer = StringBuffer();

  if (hexString.length == 9 && hexString.startsWith('#')) buffer.write('ff');
  buffer.write(hexString.replaceFirst('#', ''));

  return Color(int.parse(buffer.toString(), radix: 16));
}
