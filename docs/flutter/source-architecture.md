# SkyCo Flutter source architecture

**Status: source written 18 November 2026, not compiled, analyzed or run.** Android platform folders and product modules are not implemented.

## Identity and brand

The planned Android application ID is `online.skyco.skyco_app`, and the display name is SkyCo. `apps/skyco_app/lib/app/app_identity.dart` holds the source constants. Generated Android configuration must be checked against them after `flutter create .` runs on Windows.

`apps/skyco_app/lib/app/brand_tokens.dart` reuses the existing SkyCo colour palette and a 44-pixel minimum tap target. No new icon, splash screen or other artwork is part of this source batch.

## Shell and feature boundaries

`SkyCoApp` owns only the theme mode and app-level routes. `AppShell` owns the selected Home, Tools or Settings tab. Each of CurrenSee, Chronos, SkyCo Grocery Packs, My Finance Friend and Float has a separate route and feature folder. Product state must stay inside its feature; shared shell state must not become a cross-product data store.

The current screens are navigation placeholders, not shipped product modules. State management, dependency injection and repository implementations remain deliberately dependency-free until their package choices are reviewed. New packages require a separate decision rather than being added for architectural symmetry.

## CurrenSee service boundary

CurrenSee may read remote rates only through `GET /api/v1/rates`, identified by `RateApiContract.path`. It must not call Frankfurter, CoinGecko or Nepal Rastra Bank directly, scrape website HTML, infer framework transport URLs, or contain provider credentials or other secrets. The current scaffold has no HTTP client and performs no rate requests.

Future requests should send only `from`, `to` and the optional `history` period, then multiply amounts locally. Preserve source, reference date, fetched time, stale, approximate and fallback states. Never invent missing rates or history points.

## Theme and accessible text

Light, dark and system theme modes are available in Settings. The scaffold does not fix text scale factors or disable system font scaling. Flutter's text scaling therefore follows Android font-size and display-size settings. Every future product flow must be checked with enlarged text and 44-pixel minimum interactive targets.

## Local persistence and migration strategy

`LocalPersistence` is an interface only. It does not write to disk and has no storage plugin. A future implementation must:

1. Store each feature under its own namespaced key, with no cross-product records.
2. Wrap every record in an envelope containing an integer `schemaVersion` and a `value` object.
3. Validate the envelope, field types, bounds and feature ownership before returning data.
4. Migrate sequentially from the stored version to the implementation's current version. Migrations must be deterministic and must not discard valid older data silently.
5. Keep the original record until every migrated write succeeds. Unsupported future versions and malformed records must fail closed without blocking in-memory use.
6. Keep Finance Friend session-only by default. Float durable records require a reviewed encrypted-storage design and matching privacy disclosures before release.
7. Never store signing credentials, provider secrets or rate-service credentials through this interface.

Unit tests must cover current-version round trips, each supported migration step, malformed data, unsupported future versions, failed writes and unavailable storage before a durable implementation ships.
