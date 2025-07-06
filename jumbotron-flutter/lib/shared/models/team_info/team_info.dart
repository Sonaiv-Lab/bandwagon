
import 'package:json_annotation/json_annotation.dart';


part 'team_info.g.dart';

@JsonSerializable()
class TeamTheme {
  final String primaryColor;

  TeamTheme({required this.primaryColor});

  factory TeamTheme.fromJson(Map<String, dynamic> json) =>
      _$TeamThemeFromJson(json);

  Map<String, dynamic> toJson() => _$TeamThemeToJson(this);
}

@JsonSerializable()
class TeamInfo {
  final String code, fullName, name;
  final TeamTheme theme;

  TeamInfo({
    required this.code,
    required this.fullName,
    required this.name,
    required this.theme,
  });

  factory TeamInfo.fromJson(Map<String, dynamic> json) =>
      _$TeamInfoFromJson(json);

  Map<String, dynamic> toJson() => _$TeamInfoToJson(this);
}
