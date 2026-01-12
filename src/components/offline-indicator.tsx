import { useOffline } from "@/hooks/use-offline";
import { WifiOff, Wifi, Cloud, CloudOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function OfflineIndicator() {
  const { isOnline, isOfflineReady } = useOffline();
  const { t } = useTranslation();

  if (isOnline && !isOfflineReady) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium transition-all duration-300 safe-area-top",
        isOnline
          ? "bg-green-500/90 text-white"
          : "bg-amber-500/90 text-white"
      )}
    >
      <div className="flex items-center justify-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            <span>{t('offline.backOnline', 'Back online')}</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>{t('offline.youAreOffline', 'You are offline')}</span>
          </>
        )}
        {isOfflineReady && (
          <span className="ml-2 text-xs opacity-80">
            {isOnline ? (
              <Cloud className="h-3 w-3 inline" />
            ) : (
              <>
                <CloudOff className="h-3 w-3 inline mr-1" />
                {t('offline.cachedDataAvailable', 'Cached data available')}
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export function OfflineBadge() {
  const { isOnline, isOfflineReady } = useOffline();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
      <WifiOff className="h-3 w-3" />
      {t('offline.offline', 'Offline')}
      {isOfflineReady && (
        <span className="text-amber-600 dark:text-amber-400">
          • {t('offline.cached', 'Cached')}
        </span>
      )}
    </div>
  );
}
