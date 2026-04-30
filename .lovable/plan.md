
# Convert MyFarm to a Native Mobile App (Capacitor)

The project already has Capacitor configured (`capacitor.config.ts`, iOS + Android packages installed) and the camera works natively in the file upload. This plan finishes the conversion to a real native app suitable for the Apple App Store and Google Play.

## What you'll get

- A real native iOS and Android app shell wrapping the existing UI.
- Full native camera (already in place) for crop scans.
- Native splash screen and themed status bar that match the brand.
- Native location for outbreak map / weather widget.
- Native share for the share-scan dialog.
- Native push notifications for forum replies and alerts.
- Light haptic feedback on scan results.
- Hot-reload from the Lovable preview while developing on a device.

## Step 1 — Native plugins

Add the following Capacitor plugins:

- `@capacitor/splash-screen` — branded launch screen
- `@capacitor/status-bar` — themed status bar (light/dark aware)
- `@capacitor/app` — Android back-button + lifecycle
- `@capacitor/geolocation` — for outbreak map / weather widget
- `@capacitor/share` — used by the share-scan dialog when running natively
- `@capacitor/haptics` — feedback on successful scans
- `@capacitor/push-notifications` — registers device token for forum alerts
- `@capacitor/keyboard` — keyboard avoidance for forms

(Camera is already installed.)

## Step 2 — Update `capacitor.config.ts`

Add plugin config blocks for splash screen (brand green background, fade animation), status bar (default style follows app theme), keyboard (resize body), and push notifications (presentation alerts in foreground).

## Step 3 — Native runtime initialization

Create a small `src/lib/native.ts` initializer called from `src/main.tsx`:

- Detect native vs web with `Capacitor.isNativePlatform()`.
- On native: hide splash after the first paint, set status-bar style based on the active theme, register the Android hardware back button to use React Router history.
- Wire the existing theme hook so the status bar updates when the user switches Light/Dark/System.

## Step 4 — Use native APIs where it matters

- `share-scan-dialog`: prefer `Share.share(...)` on native, fall back to `navigator.share` / clipboard on web.
- `weather-widget` / `OutbreakMap`: use `Geolocation.getCurrentPosition()` on native (better permission UX) instead of the browser API.
- `disease-analyzer`: trigger a light `Haptics.impact` when a result comes back.

## Step 5 — Push notifications (forum + moderation)

- Add a `device_tokens` table in the backend storing `(user_id, platform, token)` with owner-only access rules.
- On app start, when the user is signed in, request push permission and save the token.
- Update the existing notification trigger so it also queues a push (handled by the existing notifications edge path; no new mod logic needed).

## Step 6 — Branding assets (for the native app)

- Generate iOS / Android icon and splash-screen images from `src/assets/myfarm-logo.png` (we'll place them under `resources/` so `@capacitor/assets` can produce all density variants when you run the local build).

## Step 7 — Your local steps to actually run on a device

After we ship the code, you need to run these on your own machine (Lovable's sandbox can't run iOS/Android tooling):

1. Click **Export to GitHub** in Lovable, then `git pull` your repo locally.
2. `npm install`
3. `npx cap add ios` and/or `npx cap add android`
4. `npm run build`
5. `npx cap sync`
6. `npx cap run ios` (requires a Mac with Xcode) or `npx cap run android` (requires Android Studio).

Whenever you `git pull` new changes from Lovable later, re-run `npm install && npm run build && npx cap sync`.

## Technical notes

```text
src/
├── main.tsx                    -> calls initNativeApp()
├── lib/
│   └── native.ts               -> NEW: splash, status bar, back button, theme sync
├── hooks/
│   └── use-push-notifications  -> EXISTING, switched to Capacitor PushNotifications on native
├── components/
│   ├── ui/file-upload.tsx      -> already uses @capacitor/camera
│   ├── share-scan-dialog.tsx   -> add Capacitor Share branch
│   └── weather-widget.tsx      -> add Capacitor Geolocation branch
capacitor.config.ts             -> plugin config (SplashScreen, StatusBar, Keyboard, PushNotifications)
resources/                      -> NEW: icon.png, splash.png for @capacitor/assets
```

- Keep the dev `server.url` in `capacitor.config.ts` so live edits in Lovable show up on the device immediately.
- For App Store / Play Store builds, you (or your developer) will remove the `server.url` block so the app loads its own bundled `dist/`.
- The PWA service worker stays untouched — web users still get the installable PWA experience; native users get the Capacitor shell.

## Out of scope (call out before approving)

- Apple Developer / Google Play developer accounts and store listings — those are manual signup tasks on your side.
- Code-signing certificates and provisioning profiles.
- Any backend changes beyond the small `device_tokens` table for push.

After you approve, I'll implement steps 1–6 in the codebase and walk you through step 7 once it's ready.
