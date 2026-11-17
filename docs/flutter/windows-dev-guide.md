# SkyCo Flutter Android development on Windows

**Status:** setup guide plus an uncompiled source scaffold, updated 17 November 2026. Flutter, Android Studio and an emulator have **not** been installed in this repository environment. The scaffold under `apps/skyco_app/` has not been compiled, analyzed or run. Follow the official installers on a Windows development machine and record the actual tool versions when that work is done.

## Official setup

1. **Install Flutter prerequisites and the stable SDK.** Follow [Flutter's official Windows installation guide](https://docs.flutter.dev/get-started/install/windows). Use the stable channel and a user-writable SDK location. Add Flutter's `bin` directory to `PATH` only as described by that guide, then open a new terminal.
2. **Install Android Studio.** Use the [official Android Studio download and setup](https://developer.android.com/studio). In SDK Manager, install the Android SDK, platform tools, and emulator components recommended by Flutter's Windows guide. Create an Android Virtual Device, or prepare a physical Android device using the official device instructions.
3. **Accept Android SDK licenses.** After Flutter and Android Studio are available in a new terminal, run:

   ```powershell
   flutter doctor --android-licenses
   ```

4. **Check the complete toolchain and connected targets.** Run:

   ```powershell
   flutter doctor -v
   flutter --version
   flutter devices
   ```

   Resolve every issue relevant to Android development before creating product modules. Record the actual Flutter, Dart, Android SDK, emulator/device, and Java versions in the project documentation. A successful `flutter doctor -v` is not evidence that the SkyCo app has been built or tested.

5. **Start an emulator or connect a physical device.** Confirm that `flutter devices` lists it. Use a real device for later sharing, notifications, storage, backup, and App Link checks; an emulator alone does not establish physical-device behaviour.

Do not require macOS or begin iOS setup for this milestone. Android is the current delivery target.

## Proposed project location and boundaries

The source scaffold now exists under `apps/skyco_app/`. After verifying the Windows toolchain, generate its platform folders and remaining metadata without replacing the existing source:

```powershell
cd apps/skyco_app
flutter create --org online.skyco --project-name skyco_app .
```

The existing Vite/TanStack website stays at the repository root. Do not replace it with a WebView or move its configuration into the Flutter directory.

Proposed initial layout:

```text
apps/skyco_app/
  android/                  Generated Android host project; review before committing
  lib/
    main.dart               App entry point
    app/                    Shell, navigation, theme, common settings
    features/
      currensee/
      chronos/
      finance_friend/
      grocery/
      float/
    services/
      rates/                Versioned HTTP client and v1 DTOs, when the endpoint exists
  test/
    fixtures/               Android parity tests using the approved golden cases
  integration_test/         Emulator/device flows
  pubspec.yaml
```

Keep the five products independent. Chronos, Finance Friend, Grocery, and Float begin with local behaviour; do not add server calls for architectural symmetry. Android persistence and Float encryption require their own reviewed implementations and privacy updates.

## CurrenSee rate integration

Read these files before writing the Flutter rate client:

- [Versioned rate HTTP contract v1](../rates/rate-api-contract-v1.md)
- [Machine-checkable v1 JSON Schema](../rates/rate-api-contract-v1.schema.json)
- [Current website request path](../rates/currensee-request-path.md)
- [Website/service/Android parity matrix](../parity-matrix.md)

The base path is `/api/v1/rates`, and its server route now exists in source. Production availability has not been verified in this batch. Do not scrape product pages or infer TanStack Start transport paths. Configure the Flutter client with an environment-specific base URL only after the route's mocked tests pass and the intended runtime is verified.

Keep Frankfurter, CoinGecko, and Nepal Rastra Bank requests on the server. Never place provider credentials, service-role keys, signing keys, or other secrets in Dart source, Flutter assets, the APK, or version control. Preserve `referenceDate`, `fetchedAt`, `stale`, `approximate`, `fallback`, and attribution in the UI. Never invent a rate when the provider and cache have no valid value.

The website currently sends only currency codes and multiplies amounts locally. Flutter should follow that rule unless sending `amount` is separately approved and disclosed. Use only source-backed history points; do not fill missing days.

## Local secrets and generated files

The scoped `apps/skyco_app/.gitignore` contains rules for build output, local databases, keystores, `key.properties`, signing credentials, IDE state, and machine-specific files. The platform-managed root `.gitignore` was not edited. Keep real signing material outside Git and outside Flutter assets. Use a safe placeholder example if configuration documentation needs one. Before each commit, review the staged file list rather than assuming ignore rules cover a new secret location.

## First authorized implementation checks

After the project is actually created on Windows, run and record:

```powershell
cd apps/skyco_app
flutter analyze
flutter test
flutter build apk --debug
flutter devices
```

Then run the debug app on both an emulator and a physical device before claiming the Phase 3 exit gate. These commands are instructions for future Windows work, not commands run in this documentation-only batch.
