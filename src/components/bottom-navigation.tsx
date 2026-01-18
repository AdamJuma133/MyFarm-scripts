import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scan, LayoutDashboard, Lightbulb, MapPin, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PendingScansBadge } from '@/components/pending-scans-badge';
import { useBackgroundSync } from '@/hooks/use-background-sync';

interface NavItem {
  path: string;
  icon: React.ElementType;
  labelKey: string;
  fallback: string;
  showBadge?: boolean;
}

const navItems: NavItem[] = [
  { path: '/', icon: Scan, labelKey: 'navigation.scan', fallback: 'Scan', showBadge: true },
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'navigation.dashboard', fallback: 'Dashboard' },
  { path: '/advice', icon: Lightbulb, labelKey: 'navigation.advice', fallback: 'Advice' },
  { path: '/outbreaks', icon: MapPin, labelKey: 'navigation.outbreaks', fallback: 'Map' },
  { path: '/history', icon: History, labelKey: 'navigation.history', fallback: 'History' },
];

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { pendingCount } = useBackgroundSync();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center min-h-[56px] min-w-[56px] px-3 py-2 touch-manipulation",
                "transition-colors duration-200",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground active:text-primary"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-6 w-6 mb-1", active && "scale-110")} />
                {item.showBadge && <PendingScansBadge count={pendingCount} />}
              </div>
              <span className={cn(
                "text-xs font-medium",
                active && "font-semibold"
              )}>
                {t(item.labelKey, item.fallback)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
