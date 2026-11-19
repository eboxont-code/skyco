// CurrenSee domain logic for the Android client.
// UNBUILT / UNVERIFIED: source only, not yet compiled or run (19 November 2026).
// Mirrors the web rules: rates come only from GET /api/v1/rates; nothing here
// produces a rate on its own.

/// Display state of a conversion, matching the web converter's states.
enum RateState { fresh, stale, approximate, unavailable, providerError }

/// One NRB published row: buying and selling rates in NPR for [unit] units.
class NrbRow {
  const NrbRow({required this.iso3, required this.buy, required this.sell, required this.unit});
  final String iso3;
  final double buy;
  final double sell;
  final int unit;

  bool get isValid =>
      RegExp(r'^[A-Z]{3}$').hasMatch(iso3) &&
      [buy, sell, unit.toDouble()].every((v) => v.isFinite && v > 0);

  /// NPR per one unit of the currency: midpoint of buy and sell, divided by unit.
  /// Returns null for an invalid row so callers show the unavailable state.
  double? get nprPerUnitMidpoint => isValid ? (buy + sell) / 2 / unit : null;
}

/// Result of a conversion, keeping the source labels the UI must show.
class Conversion {
  const Conversion({
    required this.from,
    required this.to,
    required this.amount,
    required this.result,
    required this.state,
    this.source,
    this.referenceDate,
    this.fetchedAt,
  });
  final String from;
  final String to;
  final double amount;
  final double? result;
  final RateState state;
  final String? source;
  final String? referenceDate;
  final String? fetchedAt;
}

/// Parses an amount the user typed. Returns null for empty, negative or
/// non-numeric input.
double? parseAmount(String input) {
  final v = double.tryParse(input.trim().replaceAll(',', ''));
  return (v == null || !v.isFinite || v < 0) ? null : v;
}

/// Converts [amount] with a rate from the API. A null rate yields no result.
Conversion convert({
  required String from,
  required String to,
  required double amount,
  required double? rate,
  required bool stale,
  bool approximate = false,
  bool providerError = false,
  String? source,
  String? referenceDate,
  String? fetchedAt,
}) {
  final valid = rate != null && rate.isFinite && rate > 0;
  final state = providerError && !valid
      ? RateState.providerError
      : !valid
          ? RateState.unavailable
          : stale
              ? RateState.stale
              : approximate
                  ? RateState.approximate
                  : RateState.fresh;
  return Conversion(
    from: from,
    to: to,
    amount: amount,
    result: valid ? amount * rate : null,
    state: state,
    source: source,
    referenceDate: referenceDate,
    fetchedAt: fetchedAt,
  );
}

/// Swaps the pair; the caller must request a fresh rate for the new direction.
(String, String) swapPair(String from, String to) => (to, from);
