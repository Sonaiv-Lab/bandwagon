// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'play.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Play _$PlayFromJson(Map<String, dynamic> json) => Play(
  id: json['id'] as String,
  gameId: json['gameId'] as String,
  nextPlayId: json['nextPlayId'] as String?,
  isGameStop: json['isGameStop'] as bool,
  isPlayBall: json['isPlayBall'] as bool,
  startDatetime: const RFC3339TimeConverter().fromJson(
    json['startDatetime'] as String,
  ),
  endDatetime: _$JsonConverterFromJson<String, DateTime>(
    json['endDatetime'],
    const RFC3339TimeConverter().fromJson,
  ),
  reserveDate: _$JsonConverterFromJson<String, DateTime>(
    json['reserveDate'],
    const RFC3339TimeConverter().fromJson,
  ),
  durationSeconds: (json['durationSeconds'] as num).toInt(),
  field: json['field'] as String,
  result: $enumDecode(_$GameResultEnumMap, json['result']),
  homeScore: (json['homeScore'] as num).toInt(),
  visitingScore: (json['visitingScore'] as num).toInt(),
  visitingPitcherId: json['visitingPitcherId'] as String?,
  visitingPitcherName: json['visitingPitcherName'] as String?,
  homePitcherId: json['homePitcherId'] as String?,
  homePitcherName: json['homePitcherName'] as String?,
  winningPitcherId: json['winningPitcherId'] as String?,
  winningPitcherName: json['winningPitcherName'] as String?,
  loserPitcherId: json['loserPitcherId'] as String?,
  loserPitcherName: json['loserPitcherName'] as String?,
  closerId: json['closerId'] as String?,
  closerName: json['closerName'] as String?,
  mvpPlayerId: json['mvpPlayerId'] as String?,
  mvpPlayerName: json['mvpPlayerName'] as String?,
  mvpCount: (json['mvpCount'] as num?)?.toInt(),
  game: Game.fromJson(json['game'] as Map<String, dynamic>),
);

Map<String, dynamic> _$PlayToJson(Play instance) => <String, dynamic>{
  'id': instance.id,
  'gameId': instance.gameId,
  'nextPlayId': instance.nextPlayId,
  'isGameStop': instance.isGameStop,
  'isPlayBall': instance.isPlayBall,
  'startDatetime': const RFC3339TimeConverter().toJson(instance.startDatetime),
  'endDatetime': _$JsonConverterToJson<String, DateTime>(
    instance.endDatetime,
    const RFC3339TimeConverter().toJson,
  ),
  'durationSeconds': instance.durationSeconds,
  'field': instance.field,
  'result': _$GameResultEnumMap[instance.result]!,
  'homeScore': instance.homeScore,
  'visitingScore': instance.visitingScore,
  'reserveDate': _$JsonConverterToJson<String, DateTime>(
    instance.reserveDate,
    const RFC3339TimeConverter().toJson,
  ),
  'visitingPitcherId': instance.visitingPitcherId,
  'visitingPitcherName': instance.visitingPitcherName,
  'homePitcherId': instance.homePitcherId,
  'homePitcherName': instance.homePitcherName,
  'winningPitcherId': instance.winningPitcherId,
  'winningPitcherName': instance.winningPitcherName,
  'loserPitcherId': instance.loserPitcherId,
  'loserPitcherName': instance.loserPitcherName,
  'closerId': instance.closerId,
  'closerName': instance.closerName,
  'mvpPlayerId': instance.mvpPlayerId,
  'mvpPlayerName': instance.mvpPlayerName,
  'mvpCount': instance.mvpCount,
  'game': instance.game,
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
