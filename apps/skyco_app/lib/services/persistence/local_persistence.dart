abstract interface class LocalPersistence {
  int get currentSchemaVersion;

  Future<Map<String, Object?>?> read(String key);

  Future<void> write(String key, Map<String, Object?> value);

  Future<void> delete(String key);

  Future<Map<String, Object?>> migrate({
    required String key,
    required int fromVersion,
    required Map<String, Object?> value,
  });
}
