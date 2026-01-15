import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download, Smartphone, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if user dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
    
    // Show again after 7 days
    if (dismissed && daysSinceDismissed < 7) {
      return;
    }

    // Listen for the install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Delay showing the prompt for better UX
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show custom instructions after delay
    if (iOS && !standalone) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA was installed');
        setShowPrompt(false);
        setDeferredPrompt(null);
      } else {
        handleDismiss();
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed
  if (isStandalone) return null;

  // Don't show if no prompt available (except iOS)
  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        >
          <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Header gradient */}
            <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Download className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {t('pwa.installTitle', 'Install MyFarm')}
                    </h3>
                    <p className="text-sm opacity-90">
                      {t('pwa.installSubtitle', 'Get the full app experience')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  {t('pwa.benefit1', 'Works offline with cached data')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  {t('pwa.benefit2', 'Faster loading times')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  {t('pwa.benefit3', 'Easy access from home screen')}
                </li>
              </ul>

              {isIOS ? (
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Share className="h-4 w-4" />
                    {t('pwa.iosInstructions', 'To install on iOS:')}
                  </p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>{t('pwa.iosStep1', 'Tap the Share button in Safari')}</li>
                    <li>{t('pwa.iosStep2', 'Scroll down and tap "Add to Home Screen"')}</li>
                    <li>{t('pwa.iosStep3', 'Tap "Add" to confirm')}</li>
                  </ol>
                </div>
              ) : deferredPrompt ? (
                <Button 
                  onClick={handleInstall}
                  className="w-full h-12 text-base touch-manipulation"
                >
                  <Smartphone className="h-5 w-5 mr-2" />
                  {t('pwa.installButton', 'Install App')}
                </Button>
              ) : null}

              <button
                onClick={handleDismiss}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {t('pwa.maybeLater', 'Maybe later')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
