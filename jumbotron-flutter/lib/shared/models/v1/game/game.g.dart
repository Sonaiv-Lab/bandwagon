// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'game.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Game _$GameFromJson(Map<String, dynamic> json) => Game(
  id: json['id'] as String,
  year: json['year'] as String,
  kind: $enumDecode(_$GameKindEnumMap, json['kind']),
  season: json['season'] as String,
  homeTeamCode: json['homeTeamCode'] as String,
  visitingTeamCode: json['visitingTeamCode'] as String,
  seriesNo: (json['seriesNo'] as num).toInt(),
  plays: (json['plays'] as List<dynamic>).map((e) => e as String).toList(),
);

Map<String, dynamic> _$GameToJson(Game instance) => <String, dynamic>{
  'id': instance.id,
  'year': instance.year,
  'kind': _$GameKindEnumMap[instance.kind]!,
  'season': instance.season,
  'homeTeamCode': instance.homeTeamCode,
  'visitingTeamCode': instance.visitingTeamCode,
  'seriesNo': instance.seriesNo,
  'plays': instance.plays,
};

const _$GameKindEnumMap = {
  GameKind.regularSeason: 'A',
  GameKind.championshipSeries: 'C',
  GameKind.playoffChallenge: 'E',
  GameKind.preseason: 'G',
  GameKind.allStarGame: 'B',
  GameKind.minorRegularSeason: 'D',
  GameKind.minorChampionshipSeries: 'F',
  GameKind.futureStarsGame: 'H',
  GameKind.internationalGame: 'X',
};
