import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { Keyboard } from '@capacitor/keyboard';

export const isNative = Capacitor.isNativePlatform();
export const nativePlatform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

/**
 * Initialize native-only behaviors. Safe no-op on the web.
 */
export async function initNativeApp() {
  if (!isNative) return;

  // Hide splash after first paint
  setTimeout(() => {
    SplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {});
  }, 600);

  // Initial status bar style based on current resolved theme
  await syncStatusBarWithTheme();

  // React to theme changes initiated elsewhere
  const observer = new MutationObserver(() => {
    syncStatusBarWithTheme();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  // Android hardware back button -> use browser history; exit if at root
  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack && window.history.length > 1) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });

  // Hide keyboard accessory bar on iOS for nicer UX
  Keyboard.setAccessoryBarVisible({ isVisible: false }).catch(() => {});
}

async function syncStatusBarWithTheme() {
  if (!isNative) return;
  try {
    const isDark = document.documentElement.classList.contains('dark');
    await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
    if (nativePlatform === 'android') {
      await StatusBar.setBackgroundColor({
        color: isDark ? '#0a0a0a' : '#16a34a',
      });
    }
  } catch {
    // status bar plugin not available
  }
}
