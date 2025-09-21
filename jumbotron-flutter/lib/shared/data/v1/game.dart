import 'package:bandwagon/shared/network/rest.dart';
import 'package:bandwagon/shared/models/v1/game/game.dart';
import 'package:dio/dio.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

Future<Game> getGame(String gameId) async {
  final scheduleTreeResponse = await rest.get('/v1/games/$gameId');
  final Response(:data) = scheduleTreeResponse;

  final game = parseGame(data);

  return game;
}

Game parseGame(dynamic decodeJson) {
  // final decodeJson = jsonDecode(input);

  print(decodeJson);

  if (decodeJson is! Map<String, dynamic>) {
    throw FormatException();
  }

  return Game.fromJson(decodeJson);
}

final getGameProvider = FutureProvider.family((ref, String gameId) async {
  return getGame(gameId);
});
