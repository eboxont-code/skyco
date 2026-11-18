# SkyCo Android source scaffold

This directory contains an uncompiled Flutter source scaffold for the planned Android app. It includes the Home, Tools and Settings shell, five independent product placeholder routes, light and dark themes, shared asynchronous-state widgets, and a versioned local-persistence interface with a migration hook.

## Source baseline

- Flutter stable: **3.50.0**, pinned in `.flutter-version`.
- Dart stable: **3.14.0**, required by `pubspec.yaml`.
- Flutter stable release hash: `ab2912035e160d9cad6306df307576da6128ebdb`, published 11 November 2026 in the official release manifest.
- Android application identifier: `online.skyco.skyco_app`.
- Display name: **SkyCo**.

The identifier and display name are source constants until the Android host project is generated. The existing SkyCo colour tokens are in `lib/app/brand_tokens.dart`; no new artwork, icon or splash screen has been created.

No product calculations, durable storage implementation, Android platform folder, icon, splash screen, signing setup or native integration is implemented. CurrenSee has no network client yet; its only permitted future rate path is `/api/v1/rates`, with no provider hosts or secrets in mobile source. No Flutter SDK is available in this repository environment, so nothing here has been compiled, analyzed or run.

See [source architecture and persistence strategy](../../docs/flutter/source-architecture.md) and [testing conventions](../../docs/flutter/testing.md).

## Windows generation and verification

On the Windows development machine, follow [the Windows guide](../../docs/flutter/windows-dev-guide.md), install and verify the pinned toolchain, then generate the platform folders and remaining project metadata from this directory:

```powershell
cd apps/skyco_app
flutter create --org online.skyco --project-name skyco_app .
flutter analyze
flutter test
flutter build apk --debug
```

Review generated files before committing them. Confirm the generated Android application ID and label match the source constants. Keep signing material and local configuration out of Git. Do not treat the placeholder screens as shipped Android product modules.
