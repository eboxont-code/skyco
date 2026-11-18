import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:skyco_app/app/skyco_app.dart';

void main() {
  testWidgets('shell reaches Tools and Settings', (tester) async {
    await tester.pumpWidget(const SkyCoApp());

    expect(find.text('SkyCo'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.grid_view_outlined));
    await tester.pumpAndSettle();
    expect(find.text('CurrenSee'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.settings_outlined));
    await tester.pumpAndSettle();
    expect(find.text('Use device setting'), findsOneWidget);
    expect(find.text('Light'), findsOneWidget);
    expect(find.text('Dark'), findsOneWidget);
  });
}
