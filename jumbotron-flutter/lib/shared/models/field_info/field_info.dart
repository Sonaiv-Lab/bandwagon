
import 'package:json_annotation/json_annotation.dart';


part 'field_info.g.dart';


@JsonSerializable()
class FieldInfo {
  final String key, shortName, name, fullName;

  FieldInfo({
    required this.key,
    required this.shortName,
    required this.name,
    required this.fullName,
  });

  factory FieldInfo.fromJson(Map<String, dynamic> json) =>
      _$FieldInfoFromJson(json);

  Map<String, dynamic> toJson() => _$FieldInfoToJson(this);
}
