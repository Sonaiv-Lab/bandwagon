import 'package:flutter/material.dart';

class Tag extends StatelessWidget {
  const Tag({super.key, required this.color, required this.text});

  final Color color;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 1, horizontal: 4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.all(Radius.circular(4)),
        color: color,
      ),
      child: Text(text, style: TextStyle(fontSize: 10, color: Colors.white)),
    );
  }
}
