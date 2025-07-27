import 'package:intl/intl.dart';
import 'package:json_annotation/json_annotation.dart';

DateTime formatFromRFC3339String(String input) {
  final dartDateStringFormat = input.replaceFirstMapped(
    RegExp(r'([+-]\d{2}):(\d{2})$'),
    (m) => '${m[1]}${m[2]}',
  );

  final result = DateTime.parse(dartDateStringFormat).toLocal();

  return result;
}

String formatToRFC3339String(DateTime date) {
  final raw = DateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ").format(date.toLocal());

  return raw.replaceFirstMapped(
    RegExp(r'([+-]\d{2})(\d{2})$'),
    (m) => '${m[1]}:${m[2]}',
  );
}

class RFC3339TimeConverter implements JsonConverter<DateTime, String> {
  const RFC3339TimeConverter();

  @override
  DateTime fromJson(String json) {
    return formatFromRFC3339String(json);
  }

  @override
  String toJson(DateTime date) => formatToRFC3339String(date);
}

// e.g. '2025/07/11 星期五'
// ignore: non_constant_identifier_names
String toYYYY_MM_DD__EEE(DateTime date) {
  return DateFormat('y/M/d EEEE', 'zh_TW').format(date);
}

// e.g. '2025/07/11'
// ignore: non_constant_identifier_names
String toYYYY_MM_DD(DateTime date) {
  return DateFormat('yyyy-MM-dd').format(date);
}

// e.g. 18:30, 9:30
// ignore: non_constant_identifier_names
String toH_MM(DateTime date) {
  return DateFormat('H:mm').format(date);
}
