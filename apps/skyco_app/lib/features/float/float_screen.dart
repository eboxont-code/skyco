import 'package:flutter/material.dart';

import '../../shared/widgets/product_placeholder_screen.dart';

class FloatScreen extends StatelessWidget {
  const FloatScreen({super.key});

  @override
  Widget build(BuildContext context) => const ProductPlaceholderScreen(
        productName: 'Float',
        singleJob: 'Plan income, bills and instalments across a selected period.',
      );
}
