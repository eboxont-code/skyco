import 'package:flutter/material.dart';

import '../features/chronos/chronos_screen.dart';
import '../features/currensee/currensee_screen.dart';
import '../features/finance_friend/finance_friend_screen.dart';
import '../features/float/float_screen.dart';
import '../features/grocery/grocery_screen.dart';

abstract final class AppRoutes {
  static const String currensee = '/currensee';
  static const String chronos = '/chronos';
  static const String financeFriend = '/finance-friend';
  static const String grocery = '/grocery';
  static const String float = '/float';

  static Map<String, WidgetBuilder> get productRoutes => {
        currensee: (_) => const CurrenSeeScreen(),
        chronos: (_) => const ChronosScreen(),
        financeFriend: (_) => const FinanceFriendScreen(),
        grocery: (_) => const GroceryScreen(),
        float: (_) => const FloatScreen(),
      };
}
