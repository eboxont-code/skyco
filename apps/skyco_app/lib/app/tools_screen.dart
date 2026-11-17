import 'package:flutter/material.dart';

import 'brand_tokens.dart';
import 'routes.dart';

class ToolsScreen extends StatelessWidget {
  const ToolsScreen({super.key});

  static const _tools = [
    ('CurrenSee', AppRoutes.currensee),
    ('Chronos', AppRoutes.chronos),
    ('My Finance Friend', AppRoutes.financeFriend),
    ('SkyCo Grocery Packs', AppRoutes.grocery),
    ('Float', AppRoutes.float),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(BrandTokens.spaceMedium),
      children: [
        Text('Tools', style: Theme.of(context).textTheme.headlineMedium),
        const SizedBox(height: BrandTokens.spaceMedium),
        for (final tool in _tools)
          Card(
            child: ListTile(
              title: Text(tool.$1),
              subtitle: const Text('Placeholder screen'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => Navigator.of(context).pushNamed(tool.$2),
            ),
          ),
      ],
    );
  }
}
