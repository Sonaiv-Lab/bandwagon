import 'package:bandwagon/shared/utils/time.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:bandwagon/shared/constants/game.dart';

part 'game.g.dart';

@JsonSerializable()
class Game {
  final String id;
  final String year;
  final GameKind kind;
  final String season;
  final String homeTeamCode;
  final String visitingTeamCode;
  final int seriesNo;
  final List<String> plays;


  Game({
    required this.id,
    required this.year,
    required this.kind,
    required this.season,
    required this.homeTeamCode,
    required this.visitingTeamCode,
    required this.seriesNo,
    required this.plays,
  });

  factory Game.fromJson(Map<String, dynamic> json) => _$GameFromJson(json);
  Map<String, dynamic> toJson() => _$GameToJson(this);
}
