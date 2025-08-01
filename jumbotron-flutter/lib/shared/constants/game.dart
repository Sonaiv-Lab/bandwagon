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
  regularSeason(value: 'A', name: '一軍例行賽'),
  @JsonValue('C')
  championshipSeries(value: 'C', name: '一軍總冠軍賽'),
  @JsonValue('E')
  playoffChallenge(value: 'E', name: '一軍季後挑戰賽'),
  @JsonValue('G')
  preseason(value: 'G', name: '一軍熱身賽'),
  @JsonValue('B')
  allStarGame(value: 'B', name: '一軍明星賽'),
  @JsonValue('D')
  minorRegularSeason(value: 'D', name: '二軍例行賽'),
  @JsonValue('F')
  minorChampionshipSeries(value: 'F', name: '二軍總冠軍賽'),
  @JsonValue('H')
  futureStarsGame(value: 'H', name: '未來之星邀請賽'),
  @JsonValue('X')
  internationalGame(value: 'X', name: '國際交流賽');

  const GameKind({
    required this.value,
    required this.name,
  });

  final String value;
  final String name;
}
