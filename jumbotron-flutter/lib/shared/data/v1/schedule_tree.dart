import 'package:bandwagon/shared/network/rest.dart';
import 'package:bandwagon/shared/models/v1/summary/summary.dart';
import 'package:collection/collection.dart';
import 'package:dio/dio.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

typedef YYYY = String;
typedef YYYYMM = String;
typedef YYYYMMDD = String;

typedef DateTreeMap = Map<YYYYMMDD, List<Summary>>;
typedef MonthTreeMap = Map<YYYYMM, DateTreeMap>;
typedef YearTreeMap = Map<YYYY, MonthTreeMap>;

typedef ListWithDate = List<(YYYYMMDD, Summary)>;

updateScheduleTree() async {
  await rest.post(
    '/v1/schedule/tree',
    options: Options(receiveTimeout: Duration(seconds: 5)),
  );
}

Future<ScheduleTree> getScheduleTree() async {
  final scheduleTreeResponse = await rest.get('/v1/schedule/tree');
  final Response(:data) = scheduleTreeResponse;

  final scheduleTree = parseScheduleTree(data);

  return ScheduleTree(scheduleTree);
}

YearTreeMap parseScheduleTree(dynamic decodeJson) {
  if (decodeJson is! Map) {
    throw FormatException();
  }

  final YearTreeMap output = {};

  for (final year in decodeJson.entries) {
    final monthMap = year.value;

    final MonthTreeMap monthSerializedMap = {};

    assert(
      monthMap is Map,
      'Expected monthMap for year ${year.key} to be Map but got ${monthMap.runtimeType}',
    );

    if (monthMap is! Map) continue;

    for (final month in monthMap.entries) {
      final dateMap = month.value;

      final DateTreeMap dateSerializedMap = {};

      assert(
        dateMap is Map,
        'Expected dateMap for month ${month.key} to be Map but got ${dateMap.runtimeType}',
      );

      if (dateMap is! Map) continue;

      for (final date in dateMap.entries) {
        final gameList = date.value;

        assert(
          gameList is List,
          'Expected gameList for date ${date.key} to be Map but got ${gameList.runtimeType}',
        );

        if (gameList is! List) continue;

        final List<Summary> gameSummaries = gameList
            .whereType<Map<String, dynamic>>()
            .map((data) => Summary.fromJson(data))
            .toList();

        dateSerializedMap[date.key] = gameSummaries;
      }

      monthSerializedMap[month.key] = dateSerializedMap;
    }

    output[year.key] = monthSerializedMap;
  }

  return output;
}

class ScheduleTree {
  final YearTreeMap _data;

  ScheduleTree(this._data);

  // TODO, how about save the sorted result? to prevent sorting every time
  List<YYYY> get yearsList {
    return _data.keys.toList().sorted();
  }

  List<YYYYMM> get monthsList {
    return _data.values.expand((month) => month.keys).toList().sorted();
  }

  List<YYYYMMDD> get datesList {
    return _data.values
        .expand((month) => month.values)
        .expand((date) => date.keys)
        .toList()
        .sorted();
  }

  YearTreeMap get yearsMap {
    return _data;
  }

  MonthTreeMap get monthsMap {
    final Iterable<MapEntry<YYYYMM, DateTreeMap>> monthMapEntries = _data.values
        .expand((monthMap) => monthMap.entries);

    return {for (final e in monthMapEntries) e.key: e.value};
  }

  DateTreeMap get datesMap {
    final Iterable<MapEntry<YYYYMMDD, List<Summary>>> dateMapEntries = _data
        .values
        .expand(
          (monthMap) => monthMap.values.expand((dateMap) => dateMap.entries),
        );

    return {for (final e in dateMapEntries) e.key: e.value};
  }

  ListWithDate get listWithDate {
    final datesMap = this.datesMap;

    return datesMap.entries
        .expand((entry) {
          return entry.value.map((game) => (entry.key, game));
        })
        .toList()
        .sorted((a, b) {
          final (String dateA, _) = a;
          final (String dateB, _) = b;

          return dateA.compareTo(dateB);
        });
  }
}

final scheduleTreeProvider = FutureProvider.autoDispose((ref) async {
  return getScheduleTree();
});
