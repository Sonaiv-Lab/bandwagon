import 'dart:convert';

import 'package:flutter/services.dart' show rootBundle;
import 'package:bandwagon/shared/models/team_info/team_info.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

const path = 'assets/data/team_info.json';

typedef TeamInfoMap = Map<String, TeamInfo>;

Future<TeamInfoMap> loadTeamInfoMap() async {
  final teamInfoJson = await rootBundle.loadString(path);
  final decodeJson = jsonDecode(teamInfoJson) as List<dynamic>;

  final teamInfoList = decodeJson
      .map((teamInfo) => TeamInfo.fromJson(teamInfo))
      .toList();

  final teamInfoMap = <String, TeamInfo>{
    for (final team in teamInfoList) team.code: team,
  };

  return teamInfoMap;
}

final teamInfoMapProvider = FutureProvider.autoDispose<TeamInfoMap>((ref) async {
  return await loadTeamInfoMap();
});
