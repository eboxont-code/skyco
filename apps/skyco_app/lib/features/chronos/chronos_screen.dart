import 'package:flutter/material.dart';

import '../../shared/widgets/product_placeholder_screen.dart';

class ChronosScreen extends StatelessWidget {
  const ChronosScreen({super.key});

  @override
  Widget build(BuildContext context) => const ProductPlaceholderScreen(
        productName: 'Chronos',
        singleJob: 'Read one selected date across seven calendar systems.',
      );
}
