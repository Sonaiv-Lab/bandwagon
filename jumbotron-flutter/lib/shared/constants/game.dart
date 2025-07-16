import 'package:json_annotation/json_annotation.dart';

enum GameSeason {
  @JsonValue('')
  none,
  @JsonValue('0')
  singleSeason,
  @JsonValue('1')
  firstSeason,
  @JsonValue('2')
  lastSeason,
}

enum GameResult {
  @JsonValue('pending')
  pending,
  @JsonValue('ended')
  ended,
  @JsonValue('postponed')
  postponed,
  @JsonValue('suspended')
  suspended,
}

enum GameKind {
  @JsonValue('A')
  regularSeason, // 一軍例行賽
  @JsonValue('C')
  championshipSeries, // 一軍總冠軍賽
  @JsonValue('E')
  playoffChallenge, // 一軍季後挑戰賽
  @JsonValue('G')
  preseason, // 一軍熱身賽
  @JsonValue('B')
  allStarGame, // 一軍明星賽
  @JsonValue('D')
  minorRegularSeason, // 二軍例行賽
  @JsonValue('F')
  minorChampionshipSeries, // 二軍總冠軍賽
  @JsonValue('H')
  futureStarsGame, // 未來之星邀請賽
  @JsonValue('X')
  internationalGame, // 國際交流賽
}
