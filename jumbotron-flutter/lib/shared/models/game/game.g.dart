// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'game.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Game _$GameFromJson(Map<String, dynamic> json) => Game(
  id: json['id'] as String,
  gameNo: (json['gameNo'] as num).toInt(),
  year: json['year'] as String,
  gameKindCode: $enumDecode(_$GameKindEnumMap, json['gameKindCode']),
  gameSeason: json['gameSeason'] as String,
  gameSeriesNo: (json['gameSeriesNo'] as num).toInt(),
  isGameStop: json['isGameStop'] as bool,
  isPlayBall: json['isPlayBall'] as bool,
  startDatetime: DateTime.parse(json['startDatetime'] as String),
  endDatetime: json['endDatetime'] == null
      ? null
      : DateTime.parse(json['endDatetime'] as String),
  durationSeconds: (json['durationSeconds'] as num).toInt(),
  field: json['field'] as String,
  result: $enumDecode(_$GameResultEnumMap, json['result']),
  homeScore: (json['homeScore'] as num).toInt(),
  visitingScore: (json['visitingScore'] as num).toInt(),
  reserveDate: json['reserveDate'] == null
      ? null
      : DateTime.parse(json['reserveDate'] as String),
  homeTeamCode: json['homeTeamCode'] as String,
  homeTeamName: json['homeTeamName'] as String,
  homeTeamIconUrl: json['homeTeamIconUrl'] as String,
  visitingTeamCode: json['visitingTeamCode'] as String,
  visitingTeamName: json['visitingTeamName'] as String,
  visitingTeamIconUrl: json['visitingTeamIconUrl'] as String,
  mvpPlayerId: json['mvpPlayerId'] as String,
  mvpPlayerName: json['mvpPlayerName'] as String,
  mvpCount: (json['mvpCount'] as num?)?.toInt(),
  visitingPitcherId: json['visitingPitcherId'] as String,
  visitingPitcherName: json['visitingPitcherName'] as String,
  homePitcherId: json['homePitcherId'] as String,
  homePitcherName: json['homePitcherName'] as String,
  winningPitcherId: json['winningPitcherId'] as String,
  winningPitcherName: json['winningPitcherName'] as String,
  loserPitcherId: json['loserPitcherId'] as String,
  loserPitcherName: json['loserPitcherName'] as String,
  closerId: json['closerId'] as String,
  closerName: json['closerName'] as String,
);

Map<String, dynamic> _$GameToJson(Game instance) => <String, dynamic>{
  'id': instance.id,
  'gameNo': instance.gameNo,
  'year': instance.year,
  'gameKindCode': _$GameKindEnumMap[instance.gameKindCode]!,
  'gameSeason': instance.gameSeason,
  'gameSeriesNo': instance.gameSeriesNo,
  'isGameStop': instance.isGameStop,
  'isPlayBall': instance.isPlayBall,
  'durationSeconds': instance.durationSeconds,
  'field': instance.field,
  'result': _$GameResultEnumMap[instance.result]!,
  'homeScore': instance.homeScore,
  'visitingScore': instance.visitingScore,
  'homeTeamCode': instance.homeTeamCode,
  'homeTeamName': instance.homeTeamName,
  'homeTeamIconUrl': instance.homeTeamIconUrl,
  'visitingTeamCode': instance.visitingTeamCode,
  'visitingTeamName': instance.visitingTeamName,
  'visitingTeamIconUrl': instance.visitingTeamIconUrl,
  'mvpPlayerId': instance.mvpPlayerId,
  'mvpPlayerName': instance.mvpPlayerName,
  'mvpCount': instance.mvpCount,
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
  'startDatetime': instance.startDatetime.toIso8601String(),
  'endDatetime': instance.endDatetime?.toIso8601String(),
  'reserveDate': instance.reserveDate?.toIso8601String(),
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

const _$GameResultEnumMap = {
  GameResult.pending: 'pending',
  GameResult.ended: 'ended',
  GameResult.postponed: 'postponed',
  GameResult.suspended: 'suspended',
};
