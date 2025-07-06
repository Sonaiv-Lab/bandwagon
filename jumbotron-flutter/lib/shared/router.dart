import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';


pageBuilderFactory({required child, LocalKey? key}) {
  return CustomTransitionPage(
    key: key,
    child: child,
    opaque: true,
    transitionDuration: const Duration(milliseconds: 200),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(
        opacity: CurveTween(curve: Curves.easeInOut).animate(animation),
        child: child,
      );
    },
  );
}
