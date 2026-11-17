import 'package:flutter/material.dart';

import '../../shared/widgets/product_placeholder_screen.dart';

class CurrenSeeScreen extends StatelessWidget {
  const CurrenSeeScreen({super.key});

  @override
  Widget build(BuildContext context) => const ProductPlaceholderScreen(
        productName: 'CurrenSee',
        singleJob: 'Convert between supported currencies with a dated reference rate.',
      );
}
