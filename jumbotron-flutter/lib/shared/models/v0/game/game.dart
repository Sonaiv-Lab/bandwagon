import 'package:bandwagon/shared/utils/time.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:bandwagon/shared/constants/game.dart';

part 'game.g.dart';

@JsonSerializable()
class Game {
  final String id;
  final int gameNo;
  final String year;
  final GameKind gameKindCode;
  final String gameSeason;
  final int gameSeriesNo;
  final bool isGameStop;
  final bool isPlayBall;

  final int durationSeconds;
  final String field;
  final GameResult result;
  final int homeScore;
  final int visitingScore;

  final String homeTeamCode;
  final String homeTeamName;
  final String homeTeamIconUrl;
  final String visitingTeamCode;
  final String visitingTeamName;
  final String visitingTeamIconUrl;
  final String mvpPlayerId;
  final String mvpPlayerName;
  final int? mvpCount;
  final String visitingPitcherId;
  final String visitingPitcherName;
  final String homePitcherId;
  final String homePitcherName;
  final String winningPitcherId;
  final String winningPitcherName;
  final String loserPitcherId;
  final String loserPitcherName;
  final String closerId;
  final String closerName;

  @RFC3339TimeConverter()
  final DateTime startDatetime;

  @RFC3339TimeConverter()
  final DateTime? endDatetime;

  @RFC3339TimeConverter()
  final DateTime? reserveDate;

  Game({
    required this.id,
    required this.gameNo,
    required this.year,
    required this.gameKindCode,
    required this.gameSeason,
    required this.gameSeriesNo,
    required this.isGameStop,
    required this.isPlayBall,
    required this.startDatetime,
    this.endDatetime,
    required this.durationSeconds,
    required this.field,
    required this.result,
    required this.homeScore,
    required this.visitingScore,
    this.reserveDate,
    required this.homeTeamCode,
    required this.homeTeamName,
    required this.homeTeamIconUrl,
    required this.visitingTeamCode,
    required this.visitingTeamName,
    required this.visitingTeamIconUrl,
    required this.mvpPlayerId,
    required this.mvpPlayerName,
    this.mvpCount,
    required this.visitingPitcherId,
    required this.visitingPitcherName,
    required this.homePitcherId,
    required this.homePitcherName,
    required this.winningPitcherId,
    required this.winningPitcherName,
    required this.loserPitcherId,
    required this.loserPitcherName,
    required this.closerId,
    required this.closerName,
  });

  factory Game.fromJson(Map<String, dynamic> json) => _$GameFromJson(json);
  Map<String, dynamic> toJson() => _$GameToJson(this);
}
