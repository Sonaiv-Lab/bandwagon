import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';

import '../widgets/duel.dart';

class GameScreen extends HookConsumerWidget {
  const GameScreen({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final datetime = DateTime.now();

    final dateStr = DateFormat('y/M/d EEEE', 'zh_TW').format(datetime);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        leading: IconButton(
          onPressed: () {
            GoRouter.of(context).pop(true);
          },
          icon: Icon(Icons.arrow_back),
        ),
        actions: [
          IconButton(
            onPressed: () {},
            icon: Icon(Icons.calendar_today_rounded),
            color: Color(0x00000000),
          ),
        ],
        title: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(onPressed: () {}, icon: Icon(Icons.chevron_left)),
            Column(
              spacing: 2,
              children: [
                Text(
                  dateStr,
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 18),
                ),
                Text(
                  'No.123',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 14),
                ),
              ],
            ),
            IconButton(onPressed: () {}, icon: Icon(Icons.chevron_right)),
          ],
        ),
      ),
      body: Container(
        padding: EdgeInsetsGeometry.symmetric(vertical: 14, horizontal: 16),
        child: Column(
          spacing: 12,
          children: [
            Duel(),
            Duel(),
            Duel(),
            Duel(),
          ],
        ),
      ),
    );
  }
}
