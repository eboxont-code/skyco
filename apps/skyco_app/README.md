# SkyCo Android source scaffold

This directory contains an uncompiled Flutter source scaffold for the planned Android app. It includes the Home, Tools and Settings shell, five independent product placeholder routes, light and dark themes, shared asynchronous-state widgets, and a versioned local-persistence interface with a migration hook.

No product calculations, rate client, durable storage implementation, Android platform folder, icon, splash screen, signing setup, or native integration is implemented. No Flutter SDK is available in this repository environment, so nothing here has been compiled, analyzed, or run.

On the Windows development machine, follow [the existing Windows guide](../../docs/flutter/windows-dev-guide.md), install and verify the toolchain, then generate the platform folders and remaining project metadata from this directory:

```powershell
cd apps/skyco_app
flutter create .
flutter analyze
flutter test
flutter build apk --debug
```

Review generated files before committing them. Keep signing material and local configuration out of Git. Do not treat the placeholder screens as shipped Android product modules.
