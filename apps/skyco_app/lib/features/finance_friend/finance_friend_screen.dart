import 'package:flutter/material.dart';

import '../../shared/widgets/product_placeholder_screen.dart';

class FinanceFriendScreen extends StatelessWidget {
  const FinanceFriendScreen({super.key});

  @override
  Widget build(BuildContext context) => const ProductPlaceholderScreen(
        productName: 'My Finance Friend',
        singleJob: 'Turn a plain-English trade description into an inspectable preview.',
      );
}
