import 'package:flutter/material.dart';

import 'app_identity.dart';
import 'app_shell.dart';
import 'app_theme.dart';
import 'routes.dart';

class SkyCoApp extends StatefulWidget {
  const SkyCoApp({super.key});

  @override
  State<SkyCoApp> createState() => _SkyCoAppState();
}

class _SkyCoAppState extends State<SkyCoApp> {
  ThemeMode _themeMode = ThemeMode.system;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppIdentity.displayName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: _themeMode,
      routes: AppRoutes.productRoutes,
      home: AppShell(
        themeMode: _themeMode,
        onThemeModeChanged: (mode) => setState(() => _themeMode = mode),
      ),
    );
  }
}
