
import 'package:bandwagon/shared/utils/time.dart';
import 'package:bandwagon/shared/constants/game.dart';
import 'package:json_annotation/json_annotation.dart';


part 'game_summary.g.dart';


@JsonSerializable()
class GameSummary {
  final String id,
      year,
      homeTeamName,
      homeTeamCode,
      visitingTeamName,
      visitingTeamCode,
      gameKindCode,
      field;

  final int homeScore, visitingScore, gameNo;

  final GameSeason gameSeason;
  final GameResult result;

  @RFC3339TimeConverter()
  final DateTime startDatetime; 

  @RFC3339TimeConverter()
  final DateTime? endDatetime; 


  GameSummary({
    required this.id,
    required this.startDatetime,
    required this.endDatetime,
    required this.year,
    required this.gameKindCode,
    required this.homeTeamName,
    required this.homeTeamCode,
    required this.visitingTeamName,
    required this.visitingTeamCode,
    required this.homeScore,
    required this.visitingScore,
    required this.gameNo,
    required this.gameSeason,
    required this.result,
    required this.field,
  });

  factory GameSummary.fromJson(Map<String, dynamic> json) =>
      _$GameSummaryFromJson(json);

  Map<String, dynamic> toJson() => _$GameSummaryToJson(this);
}



