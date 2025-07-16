import 'dart:convert';

import 'package:flutter/services.dart' show rootBundle;
import 'package:bandwagon/shared/models/field_info/field_info.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

const path = 'assets/data/field_info.json';

typedef FieldInfoMap = Map<String, FieldInfo>;

Future<FieldInfoMap> loadFieldInfoMap() async {
  final fieldInfoJson = await rootBundle.loadString(path);
  final decodeJson = jsonDecode(fieldInfoJson) as List<dynamic>;

  final fieldInfoList = decodeJson
      .map((fieldInfo) => FieldInfo.fromJson(fieldInfo))
      .toList();

  final fieldInfoMap = <String, FieldInfo>{
    for (final field in fieldInfoList) field.key: field,
  };

  return fieldInfoMap;
}

final fieldInfoMapProvider = FutureProvider.autoDispose<FieldInfoMap>((
  ref,
) async {
  return await loadFieldInfoMap();
});
