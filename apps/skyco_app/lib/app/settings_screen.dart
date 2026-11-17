import 'package:flutter/material.dart';

import 'brand_tokens.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({
    required this.themeMode,
    required this.onThemeModeChanged,
    super.key,
  });

  final ThemeMode themeMode;
  final ValueChanged<ThemeMode> onThemeModeChanged;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(BrandTokens.spaceLarge),
      children: [
        Text('Settings', style: Theme.of(context).textTheme.headlineMedium),
        const SizedBox(height: BrandTokens.spaceLarge),
        const Text('Theme'),
        for (final option in [
          (ThemeMode.system, 'Use device setting'),
          (ThemeMode.light, 'Light'),
          (ThemeMode.dark, 'Dark'),
        ])
          RadioListTile<ThemeMode>(
            value: option.$1,
            groupValue: themeMode,
            onChanged: (value) {
              if (value != null) onThemeModeChanged(value);
            },
            title: Text(option.$2),
          ),
        const SizedBox(height: BrandTokens.spaceMedium),
        const Text(
          'Text follows your Android font-size and display-size accessibility settings. No mobile records are stored by this scaffold.',
        ),
      ],
    );
  }
}
