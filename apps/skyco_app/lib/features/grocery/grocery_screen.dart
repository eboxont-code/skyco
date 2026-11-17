import 'package:flutter/material.dart';

import '../../shared/widgets/product_placeholder_screen.dart';

class GroceryScreen extends StatelessWidget {
  const GroceryScreen({super.key});

  @override
  Widget build(BuildContext context) => const ProductPlaceholderScreen(
        productName: 'SkyCo Grocery Packs',
        singleJob: 'Size a sample grocery pack and keep a practical shopping list.',
      );
}
