import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { LanguageSelector } from './language-selector';
import { UserMenu } from './user-menu';

export function MobileHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <button 
          className="flex items-center gap-2 touch-manipulation min-h-[44px]"
          onClick={() => navigate('/')}
        >
          <Sprout className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {t('app.title')}
          </h1>
        </button>
        
        <div className="flex items-center gap-1">
          <LanguageSelector />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
