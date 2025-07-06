import 'package:intl/intl.dart';
import 'package:jiffy/jiffy.dart';

class ScheduleYearMonth {
  static const yearMonthFormat = 'yyyy-MM';
  static const displayFormat = 'yyyy/M';
  DateTime datetime;

  ScheduleYearMonth(String str)
    : datetime = ScheduleYearMonth.parseOrThrow(str);

  ScheduleYearMonth.fromDatetime(this.datetime);

  ScheduleYearMonth getNext() {
    final nextDatetime = Jiffy.parseFromDateTime(
      datetime,
    ).add(months: 1).dateTime;

    return ScheduleYearMonth.fromDatetime(nextDatetime);
  }

  ScheduleYearMonth getPrev() {
    final nextDatetime = Jiffy.parseFromDateTime(
      datetime,
    ).subtract(months: 1).dateTime;

    return ScheduleYearMonth.fromDatetime(nextDatetime);
  }

  String toFormatted() {
    return ScheduleYearMonth.format(datetime);
  }

  String toDisplayFormatted() {
    return ScheduleYearMonth.formatDisplay(datetime);
  }

  static String format(DateTime datetime) {
    return DateFormat(yearMonthFormat).format(datetime);
  }

  static String getNow() => ScheduleYearMonth.format(DateTime.now());

  static bool isValid(String string) =>
      DateFormat(yearMonthFormat).tryParseStrict(string) != null;

  static DateTime? parse(String string) =>
      DateFormat(yearMonthFormat).tryParseStrict(string);

  static DateTime parseOrThrow(String string) {
    try {
      return DateFormat(yearMonthFormat).parseStrict(string);
    } catch (_) {
      throw FormatException('Invalid ScheduleYearMonth format');
    }
  }

  static String formatDisplay(DateTime? datetime) {
    if (datetime == null) return '';

    return DateFormat(displayFormat).format(datetime);
  }

  static String transDisplayFormat(String string) =>
      formatDisplay(parse(string));
}
