// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'game_summary.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GameSummary _$GameSummaryFromJson(Map<String, dynamic> json) => GameSummary(
  id: json['id'] as String,
  isPlayBall: json['isPlayBall'] as bool,
  startDatetime: const RFC3339TimeConverter().fromJson(
    json['startDatetime'] as String,
  ),
  endDatetime: _$JsonConverterFromJson<String, DateTime>(
    json['endDatetime'],
    const RFC3339TimeConverter().fromJson,
  ),
  year: json['year'] as String,
  gameKindCode: json['gameKindCode'] as String,
  homeTeamName: json['homeTeamName'] as String,
  homeTeamCode: json['homeTeamCode'] as String,
  visitingTeamName: json['visitingTeamName'] as String,
  visitingTeamCode: json['visitingTeamCode'] as String,
  homeScore: (json['homeScore'] as num).toInt(),
  visitingScore: (json['visitingScore'] as num).toInt(),
  gameNo: (json['gameNo'] as num).toInt(),
  gameSeason: $enumDecode(_$GameSeasonEnumMap, json['gameSeason']),
  result: $enumDecode(_$GameResultEnumMap, json['result']),
  field: json['field'] as String,
);

Map<String, dynamic> _$GameSummaryToJson(
  GameSummary instance,
) => <String, dynamic>{
  'id': instance.id,
  'year': instance.year,
  'homeTeamName': instance.homeTeamName,
  'homeTeamCode': instance.homeTeamCode,
  'visitingTeamName': instance.visitingTeamName,
  'visitingTeamCode': instance.visitingTeamCode,
  'gameKindCode': instance.gameKindCode,
  'field': instance.field,
  'homeScore': instance.homeScore,
  'visitingScore': instance.visitingScore,
  'gameNo': instance.gameNo,
  'gameSeason': _$GameSeasonEnumMap[instance.gameSeason]!,
  'result': _$GameResultEnumMap[instance.result]!,
  'isPlayBall': instance.isPlayBall,
  'startDatetime': const RFC3339TimeConverter().toJson(instance.startDatetime),
  'endDatetime': _$JsonConverterToJson<String, DateTime>(
    instance.endDatetime,
    const RFC3339TimeConverter().toJson,
  ),
};

Value? _$JsonConverterFromJson<Json, Value>(
  Object? json,
  Value? Function(Json json) fromJson,
) => json == null ? null : fromJson(json as Json);

const _$GameSeasonEnumMap = {
  GameSeason.none: '',
  GameSeason.singleSeason: '0',
  GameSeason.firstSeason: '1',
  GameSeason.lastSeason: '2',
};

const _$GameResultEnumMap = {
  GameResult.pending: 'pending',
  GameResult.ended: 'ended',
  GameResult.postponed: 'postponed',
  GameResult.suspended: 'suspended',
};

Json? _$JsonConverterToJson<Json, Value>(
  Value? value,
  Json? Function(Value value) toJson,
) => value == null ? null : toJson(value);
