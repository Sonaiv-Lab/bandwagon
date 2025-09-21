// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'summary.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Summary _$SummaryFromJson(Map<String, dynamic> json) => Summary(
  endDatetime: _$JsonConverterFromJson<String, DateTime>(
    json['endDatetime'],
    const RFC3339TimeConverter().fromJson,
  ),
  field: json['field'] as String,
  gameId: json['gameId'] as String,
  homeScore: (json['homeScore'] as num).toInt(),
  homeTeamCode: json['homeTeamCode'] as String,
  isGameStop: json['isGameStop'] as bool,
  isPlayBall: json['isPlayBall'] as bool,
  kind: json['kind'] as String,
  level: json['level'] as String,
  playId: json['playId'] as String,
  result: $enumDecode(_$GameResultEnumMap, json['result']),
  season: json['season'] as String,
  seriesNo: (json['seriesNo'] as num).toInt(),
  startDatetime: const RFC3339TimeConverter().fromJson(
    json['startDatetime'] as String,
  ),
  visitingScore: (json['visitingScore'] as num).toInt(),
  visitingTeamCode: json['visitingTeamCode'] as String,
  year: json['year'] as String,
);

Map<String, dynamic> _$SummaryToJson(Summary instance) => <String, dynamic>{
  'gameId': instance.gameId,
  'playId': instance.playId,
  'year': instance.year,
  'kind': instance.kind,
  'level': instance.level,
  'season': instance.season,
  'homeTeamCode': instance.homeTeamCode,
  'visitingTeamCode': instance.visitingTeamCode,
  'field': instance.field,
  'homeScore': instance.homeScore,
  'visitingScore': instance.visitingScore,
  'seriesNo': instance.seriesNo,
  'result': _$GameResultEnumMap[instance.result]!,
  'isPlayBall': instance.isPlayBall,
  'isGameStop': instance.isGameStop,
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
