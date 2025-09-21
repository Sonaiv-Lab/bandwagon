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
      path: ':playId',
      pageBuilder: (context, GoRouterState state) {
        final playId = state.pathParameters['playId']!;

        // 如果有資料 => Game PAge
        // 如果沒有資料 => Not Found

        // 這裡要拿資料

        // TODO 這裡要改成 Play Screen... 幹有夠麻煩
        return pageBuilderFactory(
          child: GameScreen(playId: playId),
          key: state.pageKey,
        );
      },
    ),
  ],
);
