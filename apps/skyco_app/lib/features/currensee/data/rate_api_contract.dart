/// The only service path CurrenSee may use for remote rates.
///
/// Provider hosts and credentials remain on the SkyCo server. This source
/// scaffold does not include a network implementation yet.
abstract final class RateApiContract {
  static const String path = '/api/v1/rates';
  static const Set<String> historyPeriods = {'7d', '30d'};
}
