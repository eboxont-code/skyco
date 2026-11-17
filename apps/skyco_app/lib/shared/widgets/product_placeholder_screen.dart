import 'package:flutter/material.dart';

import '../../app/brand_tokens.dart';

class ProductPlaceholderScreen extends StatelessWidget {
  const ProductPlaceholderScreen({
    required this.productName,
    required this.singleJob,
    super.key,
  });

  final String productName;
  final String singleJob;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(productName)),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(BrandTokens.spaceLarge),
          children: [
            Text(productName, style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: BrandTokens.spaceSmall),
            Text(singleJob, style: Theme.of(context).textTheme.bodyLarge),
            const SizedBox(height: BrandTokens.spaceLarge),
            const Card(
              child: Padding(
                padding: EdgeInsets.all(BrandTokens.spaceMedium),
                child: Text(
                  'This is a navigation placeholder. Product logic has not been ported to the mobile app.',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
