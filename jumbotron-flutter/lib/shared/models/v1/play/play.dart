import 'package:bandwagon/shared/utils/time.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:bandwagon/shared/constants/game.dart';
import '../game/game.dart';

part 'play.g.dart';

@JsonSerializable()
class Play {
  final String id;
  final String gameId;
  final String? nextPlayId;
  final bool isGameStop;
  final bool isPlayBall;

  @RFC3339TimeConverter()
  final DateTime startDatetime;

  @RFC3339TimeConverter()
  final DateTime? endDatetime;

  final int durationSeconds;
  final String field;
  final GameResult result;
  final int homeScore;
  final int visitingScore;

  @RFC3339TimeConverter()
  final DateTime? reserveDate;

  final String? visitingPitcherId,
      visitingPitcherName,
      homePitcherId,
      homePitcherName,
      winningPitcherId,
      winningPitcherName,
      loserPitcherId,
      loserPitcherName,
      closerId,
      closerName,
      mvpPlayerId,
      mvpPlayerName;
  final int? mvpCount;

  final Game game;

  Play({
    required this.id,
    required this.gameId,
    required this.nextPlayId,
    required this.isGameStop,
    required this.isPlayBall,
    required this.startDatetime,
    this.endDatetime,
    this.reserveDate,
    required this.durationSeconds,
    required this.field,
    required this.result,
    required this.homeScore,
    required this.visitingScore,
    this.visitingPitcherId,
    this.visitingPitcherName,
    this.homePitcherId,
    this.homePitcherName,
    this.winningPitcherId,
    this.winningPitcherName,
    this.loserPitcherId,
    this.loserPitcherName,
    this.closerId,
    this.closerName,
    this.mvpPlayerId,
    this.mvpPlayerName,
    this.mvpCount,
    required this.game,
  });

  factory Play.fromJson(Map<String, dynamic> json) => _$PlayFromJson(json);
  Map<String, dynamic> toJson() => _$PlayToJson(this);
}
