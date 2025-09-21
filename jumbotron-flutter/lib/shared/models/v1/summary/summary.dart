import 'package:bandwagon/shared/utils/time.dart';
import 'package:bandwagon/shared/constants/game.dart';
import 'package:json_annotation/json_annotation.dart';

part 'summary.g.dart';

@JsonSerializable()
class Summary {
  final String gameId,
      playId,
      year,
      kind,
      level,
      season,
      homeTeamCode,
      visitingTeamCode,
      field;

  final int homeScore, visitingScore, seriesNo;

  final GameResult result;
  final bool isPlayBall, isGameStop;

  @RFC3339TimeConverter()
  final DateTime startDatetime;

  @RFC3339TimeConverter()
  final DateTime? endDatetime;

  Summary({
    required this.endDatetime,
    required this.field,
    required this.gameId,
    required this.homeScore,
    required this.homeTeamCode,
    required this.isGameStop,
    required this.isPlayBall,
    required this.kind,
    required this.level,
    required this.playId,
    required this.result,
    required this.season,
    required this.seriesNo,
    required this.startDatetime,
    required this.visitingScore,
    required this.visitingTeamCode,
    required this.year,
  });

  factory Summary.fromJson(Map<String, dynamic> json) {
    try {
      print('json');
      print(json);
      return _$SummaryFromJson(json);
    } catch (e) {
      print(e);
      throw FormatException('Invalid Summary JSON: $json, error: $e');
    }
  }

  Map<String, dynamic> toJson() => _$SummaryToJson(this);
}
