import 'package:json_annotation/json_annotation.dart';

part 'team_info.g.dart';

@JsonSerializable()
class TeamTheme {
  final String primaryColor;
  final String subtleColor;

  TeamTheme({required this.primaryColor, required this.subtleColor});

  factory TeamTheme.fromJson(Map<String, dynamic> json) =>
      _$TeamThemeFromJson(json);

  Map<String, dynamic> toJson() => _$TeamThemeToJson(this);
}

@JsonSerializable()
class Assets {
  final String simplifyIconPath;

  Assets({required this.simplifyIconPath});

  factory Assets.fromJson(Map<String, dynamic> json) => _$AssetsFromJson(json);

  Map<String, dynamic> toJson() => _$AssetsToJson(this);
}

@JsonSerializable()
class TeamInfo {
  final String code, fullName, name;
  final TeamTheme theme;
  final Assets assets;

  TeamInfo({
    required this.code,
    required this.fullName,
    required this.name,
    required this.theme,
    required this.assets,
  });

  factory TeamInfo.fromJson(Map<String, dynamic> json) =>
      _$TeamInfoFromJson(json);

  Map<String, dynamic> toJson() => _$TeamInfoToJson(this);
}
