import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget {
  const CustomAppBar({
    super.key,
    required this.leadings,
    required this.title,
    required this.actions,
  });

  final List<Widget> leadings;
  final List<Widget> actions;
  final Widget title;

  @override
  Widget build(BuildContext context) {
    return IconTheme(
      data: IconTheme.of(context).copyWith(size: 20),
      child: PreferredSize(
        preferredSize: Size.fromHeight(48),
        child: Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.inversePrimary,
          ),
          child: SafeArea(
            top: true,
            bottom: false,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(children: leadings),
                title,
                Row(children: actions),
              ],
            ),
          ),
        ),
      ),
    );
    ;
  }
}
