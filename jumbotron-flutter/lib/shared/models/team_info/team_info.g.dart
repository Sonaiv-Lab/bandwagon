// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_info.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TeamTheme _$TeamThemeFromJson(Map<String, dynamic> json) => TeamTheme(
  primaryColor: json['primaryColor'] as String,
  subtleColor: json['subtleColor'] as String,
);

Map<String, dynamic> _$TeamThemeToJson(TeamTheme instance) => <String, dynamic>{
  'primaryColor': instance.primaryColor,
  'subtleColor': instance.subtleColor,
};

Assets _$AssetsFromJson(Map<String, dynamic> json) =>
    Assets(simplifyIconPath: json['simplifyIconPath'] as String);

Map<String, dynamic> _$AssetsToJson(Assets instance) => <String, dynamic>{
  'simplifyIconPath': instance.simplifyIconPath,
};

TeamInfo _$TeamInfoFromJson(Map<String, dynamic> json) => TeamInfo(
  code: json['code'] as String,
  fullName: json['fullName'] as String,
  name: json['name'] as String,
  theme: TeamTheme.fromJson(json['theme'] as Map<String, dynamic>),
  assets: Assets.fromJson(json['assets'] as Map<String, dynamic>),
);

Map<String, dynamic> _$TeamInfoToJson(TeamInfo instance) => <String, dynamic>{
  'code': instance.code,
  'fullName': instance.fullName,
  'name': instance.name,
  'theme': instance.theme,
  'assets': instance.assets,
};
