import 'package:bandwagon/shared/utils/by_platform.dart';
import 'package:flutter/material.dart';

final double appBarHeight = byPlatform(ios: 70, android: 100);

mixin CustomAppBarPreferredSize implements PreferredSizeWidget {
  @override
  Size get preferredSize => Size.fromHeight(appBarHeight);
}

class CustomAppBar extends StatelessWidget with CustomAppBarPreferredSize {
  const CustomAppBar({
    super.key,
    required this.title,
    this.leadings,
    this.actions,
  });

  final List<Widget>? leadings;
  final List<Widget>? actions;
  final Widget title;

  @override
  Widget build(BuildContext context) {
    return IconTheme.merge(
      data: IconThemeData(size:20),
      child: PreferredSize(
        preferredSize: Size.fromHeight(appBarHeight),
        child: Container(
          height: appBarHeight,
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.inversePrimary,
          ),
          child: SafeArea(
            top: true,
            bottom: false,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(children: leadings ?? []),
                DefaultTextStyle.merge(
                  style: TextStyle(fontSize: 18),
                  child: title,
                ),
                Row(children: actions ?? []),
              ],
            ),
          ),
        ),
      ),
    );
    ;
  }
}
