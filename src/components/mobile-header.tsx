import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LanguageSelector } from './language-selector';
import { UserMenu } from './user-menu';
import { NotificationsDropdown } from './notifications-dropdown';
import myfarmLogo from '@/assets/myfarm-logo.png';

export function MobileHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border safe-area-top">
      <div className="flex items-center justify-between px-4 py-2">
        <button 
          className="flex items-center gap-2 touch-manipulation min-h-[44px]"
          onClick={() => navigate('/')}
        >
          <img src={myfarmLogo} alt="MyFarm Logo" className="h-9 w-9 rounded-full border border-border object-cover" />
          <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
            MyFarm
          </span>
        </button>
        
        <div className="flex items-center gap-1">
          <NotificationsDropdown />
          <LanguageSelector />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
