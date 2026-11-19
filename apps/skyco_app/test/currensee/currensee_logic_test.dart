// UNBUILT / UNVERIFIED: not yet run with flutter test (19 November 2026).
import 'package:flutter_test/flutter_test.dart';
import 'package:skyco_app/features/currensee/domain/currensee_logic.dart';

void main() {
  test('NRB midpoint is unit adjusted', () {
    const row = NrbRow(iso3: 'INR', buy: 160, sell: 160.24, unit: 100);
    expect(row.nprPerUnitMidpoint, closeTo(1.6012, 1e-9));
  });

  test('invalid NRB row gives no rate', () {
    const row = NrbRow(iso3: 'USD', buy: 0, sell: 133, unit: 1);
    expect(row.nprPerUnitMidpoint, isNull);
  });

  test('missing rate is unavailable, never a number', () {
    final c = convert(from: 'USD', to: 'NPR', amount: 10, rate: null, stale: false);
    expect(c.result, isNull);
    expect(c.state, RateState.unavailable);
  });

  test('provider error without cached rate', () {
    final c = convert(from: 'USD', to: 'EUR', amount: 1, rate: null, stale: false, providerError: true);
    expect(c.state, RateState.providerError);
  });

  test('stale rate keeps its labels', () {
    final c = convert(
        from: 'USD', to: 'EUR', amount: 2, rate: 0.5, stale: true,
        source: 'Frankfurter', referenceDate: '2026-11-18', fetchedAt: '2026-11-18T10:00:00Z');
    expect(c.result, 1);
    expect(c.state, RateState.stale);
    expect(c.referenceDate, '2026-11-18');
  });

  test('amount parsing and swap', () {
    expect(parseAmount('1,250.5'), 1250.5);
    expect(parseAmount('-3'), isNull);
    expect(parseAmount('abc'), isNull);
    expect(swapPair('USD', 'NPR'), ('NPR', 'USD'));
  });
}
