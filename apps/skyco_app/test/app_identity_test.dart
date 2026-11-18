import 'package:flutter_test/flutter_test.dart';
import 'package:skyco_app/app/app_identity.dart';
import 'package:skyco_app/features/currensee/data/rate_api_contract.dart';

void main() {
  test('app identity and versioned rate path stay explicit', () {
    expect(AppIdentity.applicationId, 'online.skyco.skyco_app');
    expect(AppIdentity.displayName, 'SkyCo');
    expect(RateApiContract.path, '/api/v1/rates');
    expect(RateApiContract.historyPeriods, {'7d', '30d'});
  });
}
