import 'package:bandwagon/shared/network/rest.dart';
import 'package:bandwagon/shared/models/v1/play/play.dart';
import 'package:dio/dio.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

Future<Play> getPlay(String playId) async {
  final scheduleTreeResponse = await rest.get('/v1/plays/$playId');
  final Response(:data) = scheduleTreeResponse;

  final play = parsePlay(data);

  return play;
}

Play parsePlay(dynamic decodeJson) {
  // final decodeJson = jsonDecode(input);

  if (decodeJson is! Map<String, dynamic>) {
    throw FormatException();
  }

  return Play.fromJson(decodeJson);
}

final getPlayProvider = FutureProvider.family((ref, String playId) async {
  return getPlay(playId);
});
