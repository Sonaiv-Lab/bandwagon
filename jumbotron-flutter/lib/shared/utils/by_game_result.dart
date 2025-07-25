import 'package:bandwagon/shared/constants/game.dart';
// This function is used to ensure all game status been processed.
T byGameStatus<T extends dynamic>(
  GameResult result,
  bool isPlayBall, {
  required T inProgress,
  required T pending,
  required T postponed,
  required T suspended,
  required T ended,
}) {
  return switch (result) {
    GameResult.pending when isPlayBall => inProgress,
    GameResult.pending => pending,
    GameResult.postponed => postponed,
    GameResult.suspended => suspended,
    GameResult.ended => ended,
  };
}
