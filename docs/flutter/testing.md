# SkyCo Flutter testing conventions

**Status: conventions and source tests written 18 November 2026; no Flutter test, analyzer or CI run has executed.** The workflow in `.github/workflows/flutter.yml` is unverified and must not be treated as a passing gate.

## Unit tests

Place pure Dart tests under `apps/skyco_app/test/`, mirroring the source path where practical. Use `flutter_test` only at this stage. Reuse approved website JSON fixtures by copying selected, reviewed values into test inputs only when Dart cannot read the repository fixture directly. Never weaken expected outputs to make a port pass.

Cover exact values, dates, ordering, nulls, empty states and errors. Rate tests must use mocked transport and deterministic timestamps, never live provider requests. Persistence tests must cover schema versions, sequential migrations, malformed input, unsupported future versions and storage failures.

## Widget tests

Test one feature at a time through its public screen. Verify accessible labels, keyboard/focus behaviour where supported, 44-pixel targets, light and dark themes, system text scaling, loading, empty, offline, error and retry states. Do not share product state between test cases.

The source `app_shell_test.dart` covers only Home, Tools and Settings navigation. It has not run and is not evidence of device behaviour.

## Integration tests

Add emulator and physical-device tests only after the Windows toolchain and Android host project exist. Cover every product's main flow, process recreation, storage migration, sharing and cancellation. Do not mark integration coverage complete from widget tests.

## CI

The Flutter workflow pins Flutter 3.50.0 and runs dependency resolution, formatting checks, analysis and unit/widget tests. It is source configuration only until a real hosted run passes. The existing website CI remains separate, and its lint backlog is not hidden or weakened by the Flutter job.
