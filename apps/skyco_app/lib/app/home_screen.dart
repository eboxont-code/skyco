import 'package:flutter/material.dart';

import 'brand_tokens.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(BrandTokens.spaceLarge),
      children: [
        Text('SkyCo', style: Theme.of(context).textTheme.headlineLarge),
        const SizedBox(height: BrandTokens.spaceSmall),
        Text(
          'Small useful tools, clear limitations, no compulsory account.',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: BrandTokens.spaceLarge),
        const Card(
          child: Padding(
            padding: EdgeInsets.all(BrandTokens.spaceMedium),
            child: Text(
              'Source scaffold only. Product calculations and saved mobile records are not implemented yet.',
            ),
          ),
        ),
      ],
    );
  }
}
