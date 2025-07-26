import 'package:flutter/material.dart';
import 'package:bandwagon/features/schedule/route.dart';
import 'package:bandwagon/features/game/route.dart';
import 'package:bandwagon/features/home/home.dart';
import 'package:go_router/go_router.dart';
import 'package:bandwagon/features/schedule/utils.dart';



pageBuilderFactory({required child, LocalKey? key}) {
  return CustomTransitionPage(
    key: key,
    child: child,
    transitionDuration: const Duration(milliseconds: 200),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(
        opacity: CurveTween(curve: Curves.easeInOut).animate(animation),
        child: child,
      );
    },
  );
}

class App extends StatelessWidget {
  const App({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(
          seedColor: Color.fromRGBO(13, 125, 113, 1.0),
        ),
      ),
      routerConfig: GoRouter(
        debugLogDiagnostics: true,
        initialLocation: '/schedule',
        routes: [
          ShellRoute(
            builder: (context, state, child) {
              final currentIndex = switch (state.uri.path) {
                    var p when p.startsWith('/schedule') => 1,
                    var p when p.startsWith('/') => 0,
                    _ => 0,
                  };

              return Scaffold(
                body: child,
                bottomNavigationBar: BottomNavigationBar(
                  onTap: (index) {
                    final currentYearMonth = ScheduleYearMonth.getNow();

                    final path = switch (index) {
                      _ when index == 0 => '/',
                      // _ when index == 1 => '/schedule/$currentYearMonth',
                      _ when index == 1 => '/schedule',
                      _ => '/',
                    };

                    context.go(path);
                  },
                  items: const [
                    BottomNavigationBarItem(
                      icon: Icon(Icons.home),
                      label: 'Home',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.calendar_month_outlined),
                      label: 'Schedule',
                    ),
                  ],
                  currentIndex: currentIndex,
                ),
              );
            },
            routes: [
              GoRoute(
                path: '/',
                // redirect: ,
                pageBuilder: (context, state) => pageBuilderFactory(
                  child: const Home(title: 'Home'),
                  key: state.pageKey,
                ),
                // builder: (context, state) => const Home(title: 'Home'),
              ),
              scheduleRoute,
              gameRoute
            ],
          ),
        ],
      ),
    );
  }
}
