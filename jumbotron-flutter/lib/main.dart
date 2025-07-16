import 'package:flutter/material.dart';
import 'package:bandwagon/app/app.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:jiffy/jiffy.dart';
import 'package:timezone/data/latest.dart' as tz;
import 'package:timezone/standalone.dart' as tz;

Future<void> init() async {
  await initializeDateFormatting('zh_TW', null);
  await Jiffy.setLocale('zh_TW', startOfWeek: StartOfWeek.monday);
  tz.initializeTimeZones();

  var tp = tz.getLocation('Asia/Taipei');
  var now = tz.TZDateTime.now(tp);
}

void main() {
  init().then((_) => runApp(ProviderScope(child: const App())));
}
