import 'package:flutter/material.dart';
import 'package:bandwagon/app/app.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/date_symbol_data_local.dart';

void main() {
  initializeDateFormatting(
    'zh_TW',
    null,
  ).then((_) => runApp(ProviderScope(child: const App())));
}
