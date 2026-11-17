import 'package:flutter/material.dart';

import 'brand_tokens.dart';

abstract final class AppTheme {
  static ThemeData light() => _theme(
        ColorScheme.fromSeed(
          seedColor: BrandTokens.skyBright,
          brightness: Brightness.light,
          surface: BrandTokens.skyIce,
        ),
      );

  static ThemeData dark() => _theme(
        ColorScheme.fromSeed(
          seedColor: BrandTokens.skyBright,
          brightness: Brightness.dark,
        ),
      );

  static ThemeData _theme(ColorScheme colors) => ThemeData(
        useMaterial3: true,
        colorScheme: colors,
        scaffoldBackgroundColor: colors.surface,
        appBarTheme: AppBarTheme(
          backgroundColor: colors.surface,
          foregroundColor: colors.onSurface,
          centerTitle: false,
        ),
        navigationBarTheme: const NavigationBarThemeData(
          height: 64,
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        ),
        listTileTheme: const ListTileThemeData(
          minTileHeight: BrandTokens.minimumTapTarget,
        ),
      );
}
