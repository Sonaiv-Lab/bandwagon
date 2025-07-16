import 'package:go_router/go_router.dart';
import 'package:bandwagon/shared/router.dart';
import 'game_screen/not_found.dart';
import 'game_screen/game_screen.dart';

final gameRoute = GoRoute(
  path: '/game',
  pageBuilder: (context, GoRouterState state) {
    print('game');
    return pageBuilderFactory(child: NotFoundScreen(), key: state.pageKey);
  },
  routes: [
    GoRoute(
      path: ':gameId',
      pageBuilder: (context, GoRouterState state) {
        final gameId = state.pathParameters['gameId']!;

        // 如果有資料 => Game PAge
        // 如果沒有資料 => Not Found

        // 這裡要拿資料
        return pageBuilderFactory(
          child: GameScreen(gameId: gameId),
          key: state.pageKey,
        );
      },
    ),
  ],
);
